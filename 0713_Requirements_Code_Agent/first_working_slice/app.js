const applications = [];
const form = document.querySelector('#applicationForm');
const fields = {
  boothName: { input: document.querySelector('#boothName'), error: document.querySelector('#boothNameError'), message: '請填寫攤位名稱。' },
  category: { input: document.querySelector('#category'), error: document.querySelector('#categoryError'), message: '請選擇作品類型。' },
  email: { input: document.querySelector('#email'), error: document.querySelector('#emailError'), message: '請填寫有效的 email。' }
};

function validate() {
  let valid = true;
  Object.entries(fields).forEach(([name, field]) => {
    const value = field.input.value.trim();
    const failed = !value || (name === 'email' && !field.input.checkValidity());
    field.input.classList.toggle('invalid', failed);
    field.input.setAttribute('aria-invalid', String(failed));
    field.error.textContent = failed ? field.message : '';
    if (failed) valid = false;
  });
  return valid;
}

Object.values(fields).forEach(field => field.input.addEventListener('input', () => {
  field.input.classList.remove('invalid'); field.input.removeAttribute('aria-invalid'); field.error.textContent = '';
}));

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validate()) { document.querySelector('.invalid')?.focus(); return; }
  const now = new Date();
  const id = `A-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}-${String(applications.length + 1).padStart(2,'0')}`;
  applications.push({ id, boothName: fields.boothName.input.value.trim(), category: fields.category.input.value, time: now.toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'}), status: '審核中' });
  document.querySelector('#successId').textContent = id;
  document.querySelector('#successTime').textContent = applications[applications.length - 1].time;
  document.querySelector('#successCard').hidden = false;
  document.querySelector('#successCard').scrollIntoView({behavior:'smooth',block:'center'});
  renderApplications();
  form.reset();
});

function renderApplications() {
  const body = document.querySelector('#pendingBody');
  body.replaceChildren(...applications.map(item => {
    const row = document.createElement('tr');
    [item.id, item.boothName, item.category, item.time, item.status].forEach((value, index) => {
      const cell = document.createElement('td'); cell.textContent = value;
      if (index === 0) cell.className = 'code';
      if (index === 4) cell.innerHTML = `<span class="status">${value}</span>`;
      row.appendChild(cell);
    });
    return row;
  }));
  document.querySelector('#pendingCount').textContent = `${applications.length} 筆`;
  document.querySelector('#emptyState').hidden = applications.length > 0;
}

function switchRole(role) {
  document.querySelector('#ownerView').hidden = role !== 'owner';
  document.querySelector('#organizerView').hidden = role !== 'organizer';
  document.querySelectorAll('.role').forEach(button => {
    const active = button.dataset.role === role;
    button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
  });
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('.role').forEach(button => button.addEventListener('click', () => switchRole(button.dataset.role)));
document.querySelector('#goOrganizer').addEventListener('click', () => switchRole('organizer'));
renderApplications();

