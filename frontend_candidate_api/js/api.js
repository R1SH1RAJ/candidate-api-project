// frontend/js/api.js
const BASE_URL = "http://127.0.0.1:8000"; // Adjust if backend URL differs

// small toast helper (paste into js/api.js right after BASE_URL)
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast " + (type === "error" ? "error" : "success");
  toast.textContent = message;
  document.body.appendChild(toast);
  // trigger animation / show
  requestAnimationFrame(() => toast.classList.add("show"));
  // remove after a while
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}


// ==========================
// Generic API Methods
// ==========================

// Generic GET
async function fetchData(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
  return res.json();
}

// Generic POST
async function postData(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`POST ${endpoint} failed: ${res.status} ${errBody}`);
  }
  return res.json();
}

// Generic PUT
async function putData(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`PUT ${endpoint} failed: ${res.status} ${errBody}`);
  }
  return res.json();
}

// Generic DELETE
async function deleteData(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, { method: "DELETE" });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`DELETE ${endpoint} failed: ${res.status} ${errBody}`);
  }
  return true;
}

// ==========================
// Candidate API
// ==========================
async function getCandidates() {
  return fetchData("/candidates/");
}

async function getCandidateById(id) {
  return fetchData(`/candidates/${id}`);
}

async function createCandidate(candidate) {
  return postData("/candidates/", candidate);
}

async function updateCandidate(id, candidate) {
  return putData(`/candidates/${id}`, candidate);
}

async function deleteCandidateById(id) {
  return deleteData(`/candidates/${id}`);
}

// ==========================
// Job API
// ==========================
async function getJobs() {
  return fetchData("/jobs/");
}

async function getJobById(id) {
  return fetchData(`/jobs/${id}`);
}

async function createJob(job) {
  return postData("/jobs/", job);
}

async function updateJob(id, job) {
  return putData(`/jobs/${id}`, job);
}

async function deleteJobById(id) {
  return deleteData(`/jobs/${id}`);
}

// ==========================
// Application API
// ==========================
async function getApplications() {
  return fetchData("/applications/");
}

async function getApplicationById(id) {
  return fetchData(`/applications/${id}`);
}

async function createApplication(application) {
  return postData("/applications/", application);
}

async function updateApplication(id, application) {
  return putData(`/applications/${id}`, application);
}

async function deleteApplicationById(id) {
  return deleteData(`/applications/${id}`);
}

// ===============================================================================
// frontend/js/api.js
// const BASE_URL = "http://127.0.0.1:8000"; // adjust if your backend URL differs

// // Generic GET
// async function fetchData(endpoint) {
//   const res = await fetch(`${BASE_URL}${endpoint}`);
//   if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
//   return res.json();
// }

// // Generic POST
// async function postData(endpoint, data) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) {
//     const errBody = await res.text();
//     throw new Error(`POST ${endpoint} failed: ${res.status} ${errBody}`);
//   }
//   return res.json();
// }

// // Generic PUT
// async function putData(endpoint, data) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) {
//     const errBody = await res.text();
//     throw new Error(`PUT ${endpoint} failed: ${res.status} ${errBody}`);
//   }
//   return res.json();
// }

// // Generic DELETE
// async function deleteData(endpoint) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, { method: "DELETE" });
//   if (!res.ok) {
//     const errBody = await res.text();
//     throw new Error(`DELETE ${endpoint} failed: ${res.status} ${errBody}`);
//   }
//   return true;
// }




//===========================================================OR==========================================
// const BASE_URL = "http://127.0.0.1:8000";  // Your FastAPI server

// // Generic GET
// async function fetchData(endpoint) {
//   const res = await fetch(`${BASE_URL}${endpoint}`);
//   return res.json();
// }

// // Generic POST
// async function postData(endpoint, data) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });
//   return res.json();
// }

// // DELETE
// async function deleteData(endpoint) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     method: "DELETE"
//   });
//   return res.ok;
// }
