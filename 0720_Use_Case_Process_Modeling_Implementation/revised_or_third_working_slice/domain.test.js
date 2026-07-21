const assert = require('node:assert/strict');
const domain = require('./domain.js');

assert.deepEqual(
  domain.validateDraft({ boothName: '星屑工房', category: '原創漫畫', categoryOther: '', email: 'owner@example.com' }),
  {},
  '有效申請應通過驗證'
);

const blankErrors = domain.validateDraft({ boothName: '   ', category: '', categoryOther: '', email: 'abc@' });
assert.deepEqual(Object.keys(blankErrors).sort(), ['boothName', 'category', 'email'], '空白與錯誤 email 應同時被指出');

const pending = {
  id: 'A-TEST-01', boothName: '星屑工房', category: '原創漫畫', categoryOther: '', email: 'owner@example.com',
  time: '10:00', status: '審核中', reviewComment: '', reviewedAt: ''
};

const rejectedWithoutReason = domain.applyReview(pending, '退回', '   ', '10:05');
assert.equal(rejectedWithoutReason.ok, false, '空白意見不得退回');
assert.equal(rejectedWithoutReason.application.status, '審核中', '退回失敗時狀態必須保持審核中');

const returned = domain.applyReview(pending, '退回', ' 請補充作品分類 ', '10:05');
assert.equal(returned.ok, true);
assert.equal(returned.application.status, '退回');
assert.equal(returned.application.reviewComment, '請補充作品分類');

const approved = domain.applyReview(pending, '通過', '', '10:06');
assert.equal(approved.ok, true);
assert.equal(approved.application.status, '通過');
assert.equal(domain.countPending([pending, returned.application, approved.application]), 1, '只計算審核中案件');

const ownerStatus = domain.toOwnerStatus(returned.application);
assert.equal(ownerStatus.reviewComment, '請補充作品分類');
assert.equal(Object.prototype.hasOwnProperty.call(ownerStatus, 'email'), false, '攤主審核結果投影不得包含 email');

const otherErrors = domain.validateDraft({ boothName: '紙月堂', category: '其他', categoryOther: '', email: 'paper@example.com' });
assert.equal(otherErrors.categoryOther, '請說明其他作品類型。', '選擇其他時必須補充類型');

const revised = domain.reviseApplication(returned.application, {
  boothName: '星屑工房・修正版', category: '其他', categoryOther: '攝影集', email: 'owner@example.com', note: '補充分類'
}, '10:10');
assert.equal(revised.id, pending.id, '修改原申請必須保留申請編號');
assert.equal(revised.status, '審核中', '重新送出後回到審核中');
assert.equal(revised.reviewComment, '', '重新送出後清除目前退回提示');
assert.equal(revised.resubmissionCount, 1, '應記錄重送次數');
assert.equal(domain.displayCategory(revised), '其他：攝影集');

// IMP-01：混合狀態資料應形成互斥投影，且不可修改來源資料。
const mixedApplications = [pending, returned.application, approved.application];
const mixedSnapshot = JSON.stringify(mixedApplications);
const pendingProjection = domain.getPendingApplications(mixedApplications);
const reviewedProjection = domain.getReviewedApplications(mixedApplications);
assert.deepEqual(pendingProjection.map(item => item.id), [pending.id], '待審投影只含審核中案件');
assert.deepEqual(
  reviewedProjection.map(item => item.status),
  ['退回', '通過'],
  '已審投影只含退回與通過案件'
);
assert.equal(
  pendingProjection.some(item => reviewedProjection.includes(item)),
  false,
  '待審與已審投影必須互斥'
);
assert.equal(JSON.stringify(mixedApplications), mixedSnapshot, '建立投影不得修改來源資料');

// IMP-02／AC-05-06：通過後離開待審，並保留於已審結果。
assert.equal(domain.getPendingApplications([approved.application]).length, 0, '通過後待審應為 0 筆');
assert.deepEqual(
  domain.getReviewedApplications([approved.application]).map(item => item.id),
  [pending.id],
  '通過結果應可由已審結果回查'
);

// IMP-03／AC-05-03、AC-05-07、AC-08-02：有效退回分流並保存完整意見。
assert.equal(domain.getPendingApplications([returned.application]).length, 0, '退回後待審應為 0 筆');
assert.equal(domain.getReviewedApplications([returned.application]).length, 1, '退回後已審應為 1 筆');
assert.equal(
  domain.getReviewedApplications([returned.application])[0].reviewComment,
  '請補充作品分類',
  '已審結果應保留完整退回意見'
);

// IMP-03／AC-05-04～05：無效退回不得移出待審。
assert.equal(domain.getPendingApplications([rejectedWithoutReason.application]).length, 1, '無效退回仍為待審');
assert.equal(domain.getReviewedApplications([rejectedWithoutReason.application]).length, 0, '無效退回不得進入已審');

// IMP-04／AC-08-03：補正重送後，同一案件由已審移回待審。
assert.equal(domain.getPendingApplications([revised]).length, 1, '重送後應回到待審');
assert.equal(domain.getReviewedApplications([revised]).length, 0, '重送後不應留在已審活動列');
assert.equal([revised].filter(item => item.id === pending.id).length, 1, '重送不得建立同編號副本');

console.log('domain.test.js: 原有 14 項行為檢查與 5 組分流回歸通過');
