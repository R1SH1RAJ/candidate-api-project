// js/dashboard.js
// Uses functions from js/api.js: getCandidates, getJobs, getApplications, showToast

document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
});

async function initDashboard() {
  try {
    // fetch all three in parallel
    const [candidates, jobs, applications] = await Promise.all([
      getCandidates().catch(() => { throw new Error("Candidates fetch failed"); }),
      getJobs().catch(() => { throw new Error("Jobs fetch failed"); }),
      getApplications().catch(() => { throw new Error("Applications fetch failed"); })
    ]);

    // counts
    setCount('candidates-count', candidates?.length ?? 0);
    setCount('jobs-count', jobs?.length ?? 0);
    setCount('applications-count', applications?.length ?? 0);

    // recent lists: show last 5 by id (assume IDs increment)
    populateRecentList('recent-candidates-list', (candidates || []).slice(-5).reverse(), candidateItemHtml);
    populateRecentList('recent-jobs-list', (jobs || []).slice(-5).reverse(), jobItemHtml);

  } catch (err) {
    console.error("Dashboard init error:", err);
    if (typeof showToast === 'function') showToast("Failed to load dashboard data", "error");
  }
}

function setCount(elementId, value) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = value;
  // micro-animate
  el.classList.remove('count-animate');
  // trigger reflow
  void el.offsetWidth;
  el.classList.add('count-animate');
}

// helper to render a list of items using renderer(item)
function populateRecentList(containerId, items, renderer) {
  const ul = document.getElementById(containerId);
  if (!ul) return;
  ul.innerHTML = '';
  if (!items || items.length === 0) {
    ul.innerHTML = '<li class="text-muted">No recent items</li>';
    return;
  }
  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'recent-item';
    li.innerHTML = renderer(item);
    ul.appendChild(li);
  });
}

function candidateItemHtml(c) {
  // c: { id, name, email, phone, resume_path? }
  return `
    <div style="display:flex;align-items:center;gap:10px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="flex-shrink:0">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="${encodeURIComponent('#2563eb') ? '#2563eb' : '#2563eb'}"/>
        <path d="M6 20a6 6 0 0 1 12 0" fill="${encodeURIComponent('#e6eef6') ? '#e6eef6' : '#e6eef6'}"/>
      </svg>
      <div>
        <div style="font-weight:600">${escapeHtml(c.name || '—')}</div>
        <div class="text-muted" style="font-size:13px">${escapeHtml(c.email || '')}</div>
      </div>
      <div style="margin-left:auto" class="small text-muted">#${c.id}</div>
    </div>
  `;
}

function jobItemHtml(j) {
  // j: { id, title, location, description }
  return `
    <div style="display:flex;align-items:center;gap:10px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="flex-shrink:0">
        <rect x="3" y="7" width="18" height="13" rx="2" fill="#06b6d4"/>
        <path d="M7 3h10v4H7z" fill="#1e40af"/>
      </svg>
      <div>
        <div style="font-weight:600">${escapeHtml(j.title || '—')}</div>
        <div class="text-muted" style="font-size:13px">${escapeHtml(j.location || '')}</div>
      </div>
      <div style="margin-left:auto" class="small text-muted">#${j.id}</div>
    </div>
  `;
}

// reuse the same small helper used earlier in candidates.js
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, (m) => ( { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m] ));
}
