// frontend/js/candidates.js

const API_BASE = "http://127.0.0.1:8000"; // used for file upload endpoint

let editId = null; // null => creating new, otherwise editing id

document.addEventListener("DOMContentLoaded", () => {
  loadCandidates();

  const form = document.getElementById("candidateForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const submitBtn = document.getElementById("submitBtn");

  // forms may not exist on other pages; guard them
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();

      if (!name || !email || !phone) {
        alert("Please fill all fields.");
        return;
      }

      const payload = { name, email, phone };

      try {
        if (!editId) {
          // Create new
          await postData("/candidates/", payload);
        } else {
          // Update existing
          await putData(`/candidates/${editId}`, payload);
        }
        resetForm();
        await loadCandidates();
      } catch (err) {
        console.error(err);
        alert("Error: " + (err.message || err));
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resetForm();
    });
  }

  // wire upload button (if present)
  const uploadBtn = document.getElementById("uploadBtn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", uploadResume);
  }

  // when user changes candidate selection, update resume link
  const candidateSelect = document.getElementById("candidateSelect");
  if (candidateSelect) {
    candidateSelect.addEventListener("change", onCandidateChange);
  }

  function resetForm() {
    editId = null;
    if (document.getElementById("candidateForm")) document.getElementById("candidateForm").reset();
    if (submitBtn) submitBtn.textContent = "Add Candidate";
    if (cancelBtn) cancelBtn.style.display = "none";
  }
});

// Load and display candidates (table + candidateSelect dropdown)
async function loadCandidates() {
  const tbody = document.querySelector("#candidateTable tbody");
  if (tbody) tbody.innerHTML = ""; // clear existing rows

  try {
    const candidates = await fetchData("/candidates/");

    // build table rows
    if (tbody) {
      candidates.forEach(candidate => {
        const row = document.createElement("tr");

        // Create action buttons
        const editBtn = `<button onclick="startEdit(${candidate.id})">Edit</button>`;
        const deleteBtn = `<button onclick="deleteCandidate(${candidate.id})">Delete</button>`;

        row.innerHTML = `
          <td>${candidate.id}</td>
          <td>${escapeHtml(candidate.name)}</td>
          <td>${escapeHtml(candidate.email)}</td>
          <td>${escapeHtml(candidate.phone)}</td>
          <td>${editBtn} ${deleteBtn}</td>
        `;
        tbody.appendChild(row);
      });
    }

    // populate candidateSelect dropdown if present
    const select = document.getElementById("candidateSelect");
    if (select) {
      select.innerHTML = "";
      candidates.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = `${c.name} (${c.email})`;
        select.appendChild(option);
      });

      // trigger change handler to update resume link for the first candidate
      if (candidates.length > 0) {
        // set to first if nothing selected
        if (!select.value) select.value = candidates[0].id;
        onCandidateChange();
      } else {
        // no candidates
        const link = document.getElementById("resumeLink");
        if (link) {
          link.textContent = "none";
          link.href = "#";
        }
      }
    }

  } catch (err) {
    console.error(err);
    alert("Failed to load candidates: " + (err.message || err));
  }
}

// Start edit mode for a candidate
async function startEdit(id) {
  try {
    const candidate = await fetchData(`/candidates/${id}`);
    document.getElementById("name").value = candidate.name;
    document.getElementById("email").value = candidate.email;
    document.getElementById("phone").value = candidate.phone;

    editId = id;
    const submitBtn = document.getElementById("submitBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    if (submitBtn) submitBtn.textContent = "Save Changes";
    if (cancelBtn) cancelBtn.style.display = "inline";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
    alert("Failed to fetch candidate: " + (err.message || err));
  }
}

// Delete a candidate
async function deleteCandidate(id) {
  if (!confirm("Are you sure you want to delete this candidate?")) return;
  try {
    await deleteData(`/candidates/${id}`);
    await loadCandidates();
  } catch (err) {
    console.error(err);
    alert("Delete failed: " + (err.message || err));
  }
}

// small helper to prevent XSS in table rendering
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
  }[m]));
}

/* ---------------- Resume upload related functions ---------------- */

// Called when candidateSelect changes — shows current resume link (if any)
async function onCandidateChange() {
  const select = document.getElementById("candidateSelect");
  if (!select) return;
  const id = select.value;
  if (!id) return;

  try {
    // fetch single candidate details (so we can get resume_path)
    const candidate = await fetchData(`/candidates/${id}`);
    const link = document.getElementById("resumeLink");
    if (!link) return;

    if (candidate && candidate.resume_path) {
      // resume_path stored as '/resumes/filename.ext'
      link.textContent = "Open resume";
      link.href = `${API_BASE}${candidate.resume_path}`;
      link.target = "_blank";
    } else {
      link.textContent = "none";
      link.href = "#";
    }
  } catch (err) {
    console.error("Failed to load candidate details:", err);
  }
}

// Upload resume file for selected candidate
async function uploadResume(e) {
  // If called as event handler, prevent default
  if (e && e.preventDefault) e.preventDefault();

  const select = document.getElementById("candidateSelect");
  const fileInput = document.getElementById("resumeFile");
  const uploadBtn = document.getElementById("uploadBtn");
  if (!select || !fileInput) {
    alert("Candidate select or file input missing.");
    return;
  }

  const id = select.value;
  if (!id) {
    alert("Please select a candidate first.");
    return;
  }

  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please choose a file to upload.");
    return;
  }

  const file = fileInput.files[0];

  // Optional: basic client-side file type check
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 1).toLowerCase();
  if (!allowed.includes("." + ext)) {
    if (!confirm("File type not recognized. Continue upload?")) return;
  }

  const form = new FormData();
  form.append("file", file);

  try {
    if (uploadBtn) {
      uploadBtn.disabled = true;
      uploadBtn.textContent = "Uploading...";
    }

    const res = await fetch(`${API_BASE}/candidates/${id}/upload_resume/`, {
      method: "POST",
      body: form
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Upload failed: ${res.status} ${txt}`);
    }

    const json = await res.json();
    // server returns resume_url or file_path or similar
    const resumeUrl = json.resume_url || json.file_path || json.resume_path || null;

    // refresh link from server-side candidate resource for consistency
    await onCandidateChange();

    alert(json.message || "Resume uploaded successfully");
    // clear file input
    fileInput.value = "";

  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload failed: " + (err.message || err));
  } finally {
    if (uploadBtn) {
      uploadBtn.disabled = false;
      uploadBtn.textContent = "Upload Resume";
    }
  }
}
