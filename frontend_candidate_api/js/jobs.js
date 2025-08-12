// frontend/js/jobs.js

let editJobId = null; // null -> new, otherwise editing

document.addEventListener("DOMContentLoaded", () => {
  loadJobs();

  const form = document.getElementById("jobForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !location || !description) {
      alert("Please fill all fields.");
      return;
    }

    const payload = { title, description, location };

    try {
      if (!editJobId) {
        await postData("/jobs/", payload);
      } else {
        await putData(`/jobs/${editJobId}`, payload);
      }
      resetForm();
      await loadJobs();
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.message || err));
    }
  });

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resetForm();
  });

  function resetForm() {
    editJobId = null;
    document.getElementById("jobForm").reset();
    submitBtn.textContent = "Add Job";
    cancelBtn.style.display = "none";
  }
});

async function loadJobs() {
  const tbody = document.querySelector("#jobTable tbody");
  tbody.innerHTML = "";

  try {
    const jobs = await fetchData("/jobs/");
    jobs.forEach(job => {
      const row = document.createElement("tr");
      const editBtn = `<button onclick="startEditJob(${job.id})">Edit</button>`;
      const deleteBtn = `<button onclick="deleteJob(${job.id})">Delete</button>`;

      row.innerHTML = `
        <td>${job.id}</td>
        <td>${escapeHtml(job.title)}</td>
        <td>${escapeHtml(job.location)}</td>
        <td>${escapeHtml(job.description)}</td>
        <td>${editBtn} ${deleteBtn}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load jobs: " + err.message);
  }
}

// Begin editing
async function startEditJob(id) {
  try {
    const job = await fetchData(`/jobs/${id}`);
    document.getElementById("title").value = job.title;
    document.getElementById("location").value = job.location;
    document.getElementById("description").value = job.description;

    editJobId = id;
    document.getElementById("submitBtn").textContent = "Save Changes";
    document.getElementById("cancelBtn").style.display = "inline";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
    alert("Failed to fetch job: " + err.message);
  }
}

// Delete
async function deleteJob(id) {
  if (!confirm("Delete this job?")) return;
  try {
    await deleteData(`/jobs/${id}`);
    await loadJobs();
  } catch (err) {
    console.error(err);
    alert("Delete failed: " + err.message);
  }
}

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
