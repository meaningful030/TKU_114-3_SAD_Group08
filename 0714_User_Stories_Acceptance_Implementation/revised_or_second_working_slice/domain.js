(function exposeApplicationDomain(root) {
  function validateDraft(draft) {
    const errors = {};
    if (!draft.boothName.trim()) errors.boothName = '請填寫攤位名稱。';
    if (!draft.category.trim()) errors.category = '請選擇作品類型。';
    if (draft.category === '其他' && !draft.categoryOther.trim()) {
      errors.categoryOther = '請說明其他作品類型。';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      errors.email = '請填寫有效的 email。';
    }
    return errors;
  }

  function applyReview(application, decision, comment, reviewedAt) {
    const trimmedComment = comment.trim();
    if (application.status !== '審核中') {
      return { ok: false, error: '此申請已完成審核。', application };
    }
    if (decision === '退回' && !trimmedComment) {
      return { ok: false, error: '退回申請前，請填寫審核意見。', application };
    }
    return {
      ok: true,
      error: '',
      application: {
        ...application,
        status: decision,
        reviewComment: trimmedComment,
        reviewedAt
      }
    };
  }

  function countPending(applications) {
    return applications.filter(item => item.status === '審核中').length;
  }

  function toOwnerStatus(application) {
    return {
      id: application.id,
      boothName: application.boothName,
      time: application.time,
      status: application.status,
      reviewComment: application.reviewComment
    };
  }

  function displayCategory(application) {
    return application.category === '其他'
      ? `其他：${application.categoryOther}`
      : application.category;
  }

  function reviseApplication(application, draft, submittedAt) {
    return {
      ...application,
      boothName: draft.boothName.trim(),
      category: draft.category.trim(),
      categoryOther: draft.categoryOther.trim(),
      email: draft.email.trim(),
      note: draft.note.trim(),
      time: submittedAt,
      status: '審核中',
      reviewComment: '',
      reviewedAt: '',
      resubmissionCount: (application.resubmissionCount || 0) + 1
    };
  }

  const api = { validateDraft, applyReview, countPending, toOwnerStatus, displayCategory, reviseApplication };
  root.ApplicationDomain = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis));
