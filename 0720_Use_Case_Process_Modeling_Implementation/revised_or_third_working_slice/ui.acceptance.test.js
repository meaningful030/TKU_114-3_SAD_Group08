const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const pageUrl = pathToFileURL(path.join(__dirname, 'index.html')).href;
const evidenceDir = process.env.TASK12_EVIDENCE_DIR || path.join(__dirname, 'task12-evidence');
const browserExecutable = process.env.BROWSER_EXECUTABLE ||
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function submitApplication(page, suffix = '') {
  await page.goto(pageUrl);
  await page.locator('#boothName').fill(`星屑工房${suffix}`);
  await page.locator('#category').selectOption({ label: '原創漫畫' });
  await page.locator('#email').fill('owner@example.com');
  await page.locator('#note').fill('初次送件');
  await page.locator('#submitButton').click();
  await page.locator('#ownerStatusCard:not([hidden])').waitFor();
  const title = await page.locator('#ownerStatusTitle').textContent();
  const applicationId = title.split(' · ')[0];
  await page.locator('button[data-role="organizer"]').click();
  assert.equal(await page.locator('#pendingCount').textContent(), '1 筆待審', '送件後應有一筆待審');
  assert.equal(await page.locator('#pendingBody tr').count(), 1, '待審表應有一列');
  return applicationId;
}

async function openPendingReview(page) {
  await page.locator('#pendingBody .table-action').click();
  assert.equal(await page.locator('#reviewTitle').textContent(), '審核申請');
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  try {
    // AC-05-06：通過後離開待審，保留一筆唯讀結果。
    const approvedId = await submitApplication(page, '・通過情境');
    await openPendingReview(page);
    await page.locator('#approveButton').click();
    assert.equal(await page.locator('#pendingCount').textContent(), '0 筆待審');
    assert.equal(await page.locator('#pendingBody tr').count(), 0, '通過案件不得殘留待審表');
    assert.equal(await page.locator('#emptyState').isVisible(), true, '待審空狀態應可見');
    assert.equal(await page.locator('#reviewedCount').textContent(), '1 筆已審');
    assert.match(await page.locator('#reviewedBody').textContent(), new RegExp(approvedId));
    await page.locator('#reviewedBody .table-action').click();
    assert.equal(await page.locator('#reviewTitle').textContent(), '查看審核結果');
    assert.equal(await page.locator('#approveButton').isDisabled(), true, '已審結果不得再次通過');
    assert.equal(await page.locator('#returnButton').isDisabled(), true, '已審結果不得再次退回');
    await page.screenshot({ path: path.join(evidenceDir, 'AC-05-06_通過後分流.png'), fullPage: true });
    console.log('PASS AC-05-06：通過後待審 0 筆，已審結果可唯讀回查');

    // AC-05-04～05、AC-05-03、AC-05-07、AC-08-02：退回例外與有效退回。
    const returnedId = await submitApplication(page, '・退回情境');
    await openPendingReview(page);
    await page.locator('#returnButton').click();
    assert.match(await page.locator('#reviewCommentError').textContent(), /請填寫審核意見/);
    assert.equal(await page.locator('#pendingCount').textContent(), '1 筆待審');
    assert.equal(await page.locator('#reviewedCount').textContent(), '0 筆已審');
    await page.locator('#reviewComment').fill('   ');
    await page.locator('#returnButton').click();
    assert.match(await page.locator('#reviewCommentError').textContent(), /請填寫審核意見/);
    assert.equal(await page.locator('#pendingBody tr').count(), 1, '全空白退回仍應留在待審');
    console.log('PASS AC-05-04～05：空白與全空白意見不改變案件狀態');

    const returnComment = '請補充攤位展示說明';
    await page.locator('#reviewComment').fill(returnComment);
    await page.locator('#returnButton').click();
    assert.equal(await page.locator('#pendingCount').textContent(), '0 筆待審');
    assert.equal(await page.locator('#reviewedCount').textContent(), '1 筆已審');
    assert.match(await page.locator('#reviewedBody').textContent(), new RegExp(returnedId));
    await page.locator('#reviewedBody .table-action').click();
    assert.equal(await page.locator('#reviewComment').inputValue(), returnComment, '主辦方回查應保留完整意見');
    await page.locator('button[data-role="owner"]').click();
    assert.equal(await page.locator('#ownerStatusBadge').textContent(), '退回');
    assert.match(await page.locator('#ownerReviewNote').textContent(), new RegExp(returnComment));
    await page.screenshot({ path: path.join(evidenceDir, 'AC-05-03_AC-08-02_退回與攤主回查.png'), fullPage: true });
    console.log('PASS AC-05-03、AC-05-07、AC-08-02：有效退回及雙方結果回查');

    // AC-08-03、AC-04-01：修改原案件重送，同編號由已審回到待審。
    await page.locator('#editReturnedButton').click();
    await page.locator('#note').fill('已補充攤位展示說明');
    await page.locator('#submitButton').click();
    assert.match(await page.locator('#ownerStatusTitle').textContent(), new RegExp(`^${returnedId} ·`));
    assert.equal(await page.locator('#ownerStatusBadge').textContent(), '審核中');
    await page.locator('button[data-role="organizer"]').click();
    assert.equal(await page.locator('#pendingCount').textContent(), '1 筆待審');
    assert.equal(await page.locator('#reviewedCount').textContent(), '0 筆已審');
    assert.equal(await page.locator('#pendingBody tr').count(), 1);
    assert.equal(await page.locator('#reviewedBody tr').count(), 0);
    assert.match(await page.locator('#pendingBody').textContent(), new RegExp(returnedId));
    await page.locator('#pendingBody .table-action').click();
    assert.equal(await page.locator('#reviewApplicationNote').textContent(), '已補充攤位展示說明');
    await page.screenshot({ path: path.join(evidenceDir, 'AC-08-03_補正重送回待審.png'), fullPage: true });
    console.log('PASS AC-08-03、AC-04-01：同編號補正重送並回到待審');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
