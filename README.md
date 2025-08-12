# Candidate API Project

A full-stack application for managing candidates, jobs, and applications with resume uploads.  
Built with **FastAPI**, **PostgreSQL**, and a responsive HTML/CSS/JS frontend.

---

## Features
- Candidate management (CRUD operations)
- Job management (CRUD operations)
- Application management (linking candidates and jobs)
- Resume upload with file storage
- Fully responsive dashboard interface
- REST API with Swagger UI documentation

---

## Tech Stack
**Backend:**
- Python (FastAPI)
- PostgreSQL
- SQLAlchemy ORM
- Pydantic for schema validation

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive design for desktop & mobile

---

## Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/R1SH1RAJ/candidate-api-project.git
cd candidate-api-project


2️⃣ Create a virtual environment & install dependencies
bash
Copy
Edit
python -m venv venv
source venv/bin/activate     # On Mac/Linux
venv\Scripts\activate        # On Windows

pip install -r requirements.txt

3️⃣ Configure environment variables
Create a .env file in the project root:

env
Copy
Edit
DATABASE_URL=postgresql://username:password@localhost:5432/candidates

4️⃣ Run the backend server
bash
Copy
Edit
uvicorn App.main:app --reload

5️⃣ Open the frontend
Simply open frontend_candidate_api/index.html in your browser.


Candidate_Api_project/
│-- App/                  # Backend code
│   ├── main.py            # FastAPI entry point
│   ├── models.py          # SQLAlchemy models
│   ├── routes/            # API route files
│   ├── crud.py             # Database queries
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # DB connection setup
│
│-- frontend_candidate_api/ # Frontend files
│   ├── index.html
│   ├── candidates.html
│   ├── jobs.html
│   ├── applications.html
│   ├── css/styles.css
│   ├── js/
│       ├── api.js
│       ├── candidates.js
│       ├── jobs.js
│       ├── applications.js
│
│-- requirements.txt
│-- README.md
│-- .gitignore



