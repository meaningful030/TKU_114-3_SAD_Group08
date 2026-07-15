const applications = [];
let latestApplicationId = null;
let selectedApplicationId = null;
let editingApplicationId = null;

const form = document.querySelector('#applicationForm');
const fields = {
  boothName: {
    input: document.querySelector('#boothName'),
    error: document.querySelector('#boothNameError'),
    message: '請填寫攤位名稱。'
  },
  category: {
    input: document.querySelector('#category'),
    error: document.querySelector('#categoryError'),
    message: '請選擇作品類型。'
  },
  categoryOther: {
    input: document.querySelector('#categoryOther'),
    error: document.querySelector('#categoryOtherError'),
    message: '請說明其他作品類型。'
  },
  email: {
    input: document.querySelector('#email'),
    error: document.querySelector('#emailError'),
    message: '請填寫有效的 email。'
  }
};

function validateApplication() {
  const errors = ApplicationDomain.validateDraft({
    boothName: fields.boothName.input.value,
    category: fields.category.input.value,
    categoryOther: fields.categoryOther.input.value,
    email: fields.email.input.value
  });
  Object.entries(fields).forEach(([name, field]) => {
    const failed = Boolean(errors[name]);
    field.input.classList.toggle('invalid', failed);
    field.input.setAttribute('aria-invalid', String(failed));
    field.error.textContent = errors[name] || '';
  });
  return Object.keys(errors).length === 0;
}

function clearFieldError(field) {
  field.input.classList.remove('invalid');
  field.input.removeAttribute('aria-invalid');
  field.error.textContent = '';
}

Object.values(fields).forEach(field => {
  field.input.addEventListener('input', () => clearFieldError(field));
  field.input.addEventListener('change', () => clearFieldError(field));
});

function updateCategoryOtherVisibility() {
  const isOther = fields.category.input.value === '其他';
  document.querySelector('#categoryOtherGroup').hidden = !isOther;
  fields.categoryOther.input.disabled = !isOther;
  if (!isOther) {
    fields.categoryOther.input.value = '';
    clearFieldError(fields.categoryOther);
  }
}

fields.category.input.addEventListener('change', updateCategoryOtherVisibility);

function makeApplicationId() {
  const now = new Date();
  const clock = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  return `A-${clock}-${String(applications.length + 1).padStart(2, '0')}`;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateApplication()) {
    document.querySelector('.invalid')?.focus();
    return;
  }

  const now = new Date();
  const submittedAt = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
  const draft = {
    boothName: fields.boothName.input.value,
    category: fields.category.input.value,
    categoryOther: fields.categoryOther.input.value,
    email: fields.email.input.value,
    note: document.querySelector('#note').value
  };
  let application;

  if (editingApplicationId) {
    const index = applications.findIndex(item => item.id === editingApplicationId);
    application = ApplicationDomain.reviseApplication(applications[index], draft, submittedAt);
    applications[index] = application;
    editingApplicationId = null;
  } else {
    application = {
      id: makeApplicationId(),
      boothName: draft.boothName.trim(),
      category: draft.category,
      categoryOther: draft.categoryOther.trim(),
      email: draft.email.trim(),
      note: draft.note.trim(),
      time: submittedAt,
      status: '審核中',
      reviewComment: '',
      reviewedAt: '',
      resubmissionCount: 0
    };
    applications.push(application);
  }

  latestApplicationId = application.id;
  updateOwnerStatus(application);
  renderApplications();
  form.reset();
  updateCategoryOtherVisibility();
  document.querySelector('#submitButton').innerHTML = '送出申請 <span aria-hidden="true">→</span>';
  document.querySelector('#ownerStatusCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function statusClass(status) {
  if (status === '通過') return 'approved';
  if (status === '退回') return 'returned';
  return 'pending';
}

function createStatusBadge(status) {
  const badge = document.createElement('span');
  badge.className = `status ${statusClass(status)}`;
  badge.textContent = status;
  return badge;
}

function updateOwnerStatus(application) {
  const ownerStatus = ApplicationDomain.toOwnerStatus(application);
  const card = document.querySelector('#ownerStatusCard');
  card.hidden = false;
  card.dataset.status = statusClass(ownerStatus.status);
  document.querySelector('#ownerStatusTitle').textContent = `${ownerStatus.id} · ${ownerStatus.boothName}`;
  document.querySelector('#ownerStatusTime').textContent = ownerStatus.time;

  const badge = document.querySelector('#ownerStatusBadge');
  badge.className = `status ${statusClass(ownerStatus.status)}`;
  badge.textContent = ownerStatus.status;

  const icon = document.querySelector('#ownerStatusIcon');
  icon.textContent = ownerStatus.status === '退回' ? '!' : '✓';

  const note = document.querySelector('#ownerReviewNote');
  note.hidden = !ownerStatus.reviewComment;
  note.textContent = ownerStatus.reviewComment ? `審核意見：${ownerStatus.reviewComment}` : '';

  const goOrganizer = document.querySelector('#goOrganizer');
  goOrganizer.hidden = ownerStatus.status !== '審核中';
  document.querySelector('#editReturnedButton').hidden = ownerStatus.status !== '退回';
}

function renderApplications() {
  const body = document.querySelector('#pendingBody');
  body.replaceChildren(...applications.map(item => {
    const row = document.createElement('tr');
    [item.id, item.boothName, ApplicationDomain.displayCategory(item), item.time].forEach((value, index) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (index === 0) cell.className = 'code';
      row.appendChild(cell);
    });

    const statusCell = document.createElement('td');
    statusCell.appendChild(createStatusBadge(item.status));
    row.appendChild(statusCell);

    const actionCell = document.createElement('td');
    const reviewButton = document.createElement('button');
    reviewButton.className = 'table-action';
    reviewButton.type = 'button';
    reviewButton.textContent = item.status === '審核中' ? '開始審核' : '查看結果';
    reviewButton.setAttribute('aria-label', `${reviewButton.textContent} ${item.id} ${item.boothName}`);
    reviewButton.addEventListener('click', () => selectApplication(item.id));
    actionCell.appendChild(reviewButton);
    row.appendChild(actionCell);
    return row;
  }));

  const pendingTotal = ApplicationDomain.countPending(applications);
  document.querySelector('#pendingCount').textContent = `${pendingTotal} 筆待審`;
  document.querySelector('#emptyState').hidden = applications.length > 0;

  if (selectedApplicationId) {
    const selected = applications.find(item => item.id === selectedApplicationId);
    if (selected) fillReviewPanel(selected);
  }
}

function selectApplication(id) {
  selectedApplicationId = id;
  const application = applications.find(item => item.id === id);
  if (!application) return;
  fillReviewPanel(application);
  const panel = document.querySelector('#reviewPanel');
  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelector('#reviewComment').focus({ preventScroll: true });
}

function fillReviewPanel(application) {
  document.querySelector('#reviewId').textContent = application.id;
  document.querySelector('#reviewBoothName').textContent = application.boothName;
  document.querySelector('#reviewCategory').textContent = ApplicationDomain.displayCategory(application);
  document.querySelector('#reviewEmail').textContent = application.email;
  document.querySelector('#reviewApplicationNote').textContent = application.note || '無';

  const reviewStatus = document.querySelector('#reviewStatus');
  reviewStatus.className = `status ${statusClass(application.status)}`;
  reviewStatus.textContent = application.status;

  const comment = document.querySelector('#reviewComment');
  comment.value = application.reviewComment;
  comment.disabled = application.status !== '審核中';
  document.querySelector('#approveButton').disabled = application.status !== '審核中';
  document.querySelector('#returnButton').disabled = application.status !== '審核中';
  document.querySelector('#reviewCommentError').textContent = '';
  document.querySelector('#reviewResult').textContent = application.reviewedAt
    ? `已於 ${application.reviewedAt} 完成審核。`
    : '';
}

function updateReview(decision) {
  const application = applications.find(item => item.id === selectedApplicationId);
  if (!application || application.status !== '審核中') return;

  const comment = document.querySelector('#reviewComment');
  const error = document.querySelector('#reviewCommentError');
  const reviewedAt = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
  const result = ApplicationDomain.applyReview(application, decision, comment.value, reviewedAt);

  if (!result.ok) {
    error.textContent = result.error;
    comment.classList.add('invalid');
    comment.setAttribute('aria-invalid', 'true');
    comment.focus();
    return;
  }

  error.textContent = '';
  comment.classList.remove('invalid');
  comment.removeAttribute('aria-invalid');
  Object.assign(application, result.application);
  renderApplications();
  document.querySelector('#reviewResult').textContent = `已將 ${application.id} 標記為「${decision}」。`;
  if (application.id === latestApplicationId) updateOwnerStatus(application);
}

document.querySelector('#reviewComment').addEventListener('input', event => {
  event.currentTarget.classList.remove('invalid');
  event.currentTarget.removeAttribute('aria-invalid');
  document.querySelector('#reviewCommentError').textContent = '';
});
document.querySelector('#approveButton').addEventListener('click', () => updateReview('通過'));
document.querySelector('#returnButton').addEventListener('click', () => updateReview('退回'));

function beginRevision() {
  const application = applications.find(item => item.id === latestApplicationId);
  if (!application || application.status !== '退回') return;
  editingApplicationId = application.id;
  fields.boothName.input.value = application.boothName;
  fields.category.input.value = application.category;
  updateCategoryOtherVisibility();
  fields.categoryOther.input.value = application.categoryOther || '';
  fields.email.input.value = application.email;
  document.querySelector('#note').value = application.note;
  document.querySelector('#submitButton').innerHTML = '重新送出原申請 <span aria-hidden="true">→</span>';
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  fields.boothName.input.focus({ preventScroll: true });
}

function switchRole(role) {
  document.querySelector('#ownerView').hidden = role !== 'owner';
  document.querySelector('#organizerView').hidden = role !== 'organizer';
  document.querySelectorAll('.role').forEach(button => {
    const active = button.dataset.role === role;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  if (role === 'owner' && latestApplicationId) {
    const latest = applications.find(item => item.id === latestApplicationId);
    if (latest) updateOwnerStatus(latest);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.role').forEach(button => {
  button.addEventListener('click', () => switchRole(button.dataset.role));
});
document.querySelector('#goOrganizer').addEventListener('click', () => switchRole('organizer'));
document.querySelector('#editReturnedButton').addEventListener('click', beginRevision);
updateCategoryOtherVisibility();
renderApplications();
