const apiBase = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    // Load initial data
    loadCandidates();
    loadJobs();
    loadApplications();

    // Application form submit
    document.getElementById("applicationForm").addEventListener("submit", createApplication);

    // If a job form exists on the page
    const jobForm = document.getElementById("jobForm");
    if (jobForm) {
        jobForm.addEventListener("submit", e => {
            e.preventDefault();
            if (document.getElementById("jobId").value) {
                updateJob(e);
            } else {
                createJob(e);
            }
        });
    }
});

/* -------------------- CANDIDATES -------------------- */
// Load candidates into dropdown
function loadCandidates() {
    fetch(`${apiBase}/candidates/`)
        .then(res => res.json())
        .then(data => {
            let select = document.getElementById("candidateSelect");
            if (!select) return;
            select.innerHTML = "";
            data.forEach(candidate => {
                let option = document.createElement("option");
                option.value = candidate.id;
                option.textContent = candidate.name;
                select.appendChild(option);
            });
        })
        .catch(err => console.error("Error loading candidates:", err));
}

/* -------------------- JOBS -------------------- */
// Load jobs into dropdown + jobs table
function loadJobs() {
    fetch(`${apiBase}/jobs/`)
        .then(res => res.json())
        .then(data => {
            // Jobs dropdown in Application form
            let jobSelect = document.getElementById("jobSelect");
            if (jobSelect) {
                jobSelect.innerHTML = "";
                data.forEach(job => {
                    let option = document.createElement("option");
                    option.value = job.id;
                    option.textContent = job.title;
                    jobSelect.appendChild(option);
                });
            }

            // Jobs table (if exists on page)
            let tbody = document.querySelector("#jobsTable tbody");
            if (tbody) {
                tbody.innerHTML = "";
                data.forEach(job => {
                    let row = `<tr>
                        <td>${job.id}</td>
                        <td>${job.title}</td>
                        <td>${job.description}</td>
                        <td>
                            <button onclick="editJob(${job.id}, '${job.title}', '${job.description}')">Edit</button>
                            <button onclick="deleteJob(${job.id})">Delete</button>
                        </td>
                    </tr>`;
                    tbody.innerHTML += row;
                });
            }
        })
        .catch(err => console.error("Error loading jobs:", err));
}

// Create job
function createJob(e) {
    e.preventDefault();

    let jobData = {
        title: document.getElementById("jobTitle").value,
        description: document.getElementById("jobDescription").value
    };

    fetch(`${apiBase}/jobs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
    })
    .then(res => {
        if (res.ok) {
            loadJobs();
            document.getElementById("jobForm").reset();
        }
    });
}

// Edit job
function editJob(id, title, description) {
    document.getElementById("jobTitle").value = title;
    document.getElementById("jobDescription").value = description;
    document.getElementById("jobId").value = id; // Hidden field
}

// Update job
function updateJob(e) {
    e.preventDefault();

    let id = document.getElementById("jobId").value;
    let jobData = {
        title: document.getElementById("jobTitle").value,
        description: document.getElementById("jobDescription").value
    };

    fetch(`${apiBase}/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
    })
    .then(res => {
        if (res.ok) {
            loadJobs();
            document.getElementById("jobForm").reset();
            document.getElementById("jobId").value = "";
        }
    });
}

// Delete job
function deleteJob(id) {
    fetch(`${apiBase}/jobs/${id}`, { method: "DELETE" })
        .then(res => {
            if (res.ok) loadJobs();
        });
}

/* -------------------- APPLICATIONS -------------------- */
// Load applications list
function loadApplications() {
    fetch(`${apiBase}/applications/`)
        .then(res => res.json())
        .then(data => {
            let tbody = document.querySelector("#applicationsTable tbody");
            if (!tbody) return;
            tbody.innerHTML = "";
            data.forEach(app => {
                let row = `<tr>
                    <td>${app.id}</td>
                    <td>${app.candidate.name}</td>
                    <td>${app.job.title}</td>
                    <td>
                        <button onclick="deleteApplication(${app.id})">Delete</button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(err => console.error("Error loading applications:", err));
}

// Create application
function createApplication(e) {
    e.preventDefault();

    let applicationData = {
        candidate_id: document.getElementById("candidateSelect").value,
        job_id: document.getElementById("jobSelect").value
    };

    fetch(`${apiBase}/applications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData)
    })
    .then(res => {
        if (res.ok) {
            loadApplications();
            document.getElementById("applicationForm").reset();
        }
    });
}

// Delete application
function deleteApplication(id) {
    fetch(`${apiBase}/applications/${id}`, { method: "DELETE" })
        .then(res => {
            if (res.ok) loadApplications();
        });
}

