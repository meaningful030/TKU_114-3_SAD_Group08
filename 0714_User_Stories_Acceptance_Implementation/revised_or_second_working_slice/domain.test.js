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

console.log('domain.test.js: 14 項行為檢查通過');
