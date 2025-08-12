# App/main.py

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware    # Adding CORS into the backend.
from App.routes import candidate_routes, job_routes, application_routes
from App import models
from App.database import engine


# Create tables in the database
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Candidate Management API",
    description="CRUD API to manage candidate and job records",
    version="1.0.0"
)

# --- CORS config (development) ---
# Option: List specific origins you use (safer)
origins = [
    "http://localhost",
    "http://localhost:5500",
    "http://127.0.0.1",
    "http://127.0.0.1:5500",
    # add other dev origins if needed (e.g. React dev server)
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # OR use ["*"] for any origin in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ----------------------------------------
# Include routers
app.include_router(candidate_routes.router)
app.include_router(job_routes.router)
app.include_router(application_routes.router)

# ... after creating app ...
app.mount("/resumes", StaticFiles(directory="resumes"), name="resumes")

# ======================================================================================================

# ------- This is useful when you run python App/main.py directly instead of using uvicorn.------------
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("App.main:app", host="127.0.0.1", port=8000, reload=True)

# ===================================================================================================================
#  from fastapi import FastAPI, Depends, HTTPException
# from sqlalchemy.orm import Session
# # ✅ Use relative imports because main.py is now inside the same App package
# from . import models, schemas, crud, database

# # Create DB tables
# models.Base.metadata.create_all(bind=database.engine)

# app = FastAPI()

# # Dependency to get DB session
# def get_db():
#     db = database.SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @app.get("/")
# def read_root():
#     return {"message": "Candidate API is running."}

# @app.post("/candidates", response_model=schemas.CandidateResponse)
# def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
#     return crud.create_candidate(db=db, candidate=candidate)

# @app.get("/candidates", response_model=list[schemas.CandidateResponse])
# def read_candidates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     return crud.get_candidates(db, skip=skip, limit=limit)

# @app.get("/candidates/{candidate_id}", response_model=schemas.CandidateResponse)
# def read_candidate(candidate_id: int, db: Session = Depends(get_db)):
#     db_candidate = crud.get_candidate(db, candidate_id=candidate_id)
#     if db_candidate is None:
#         raise HTTPException(status_code=404, detail="Candidate not found")
#     return db_candidate

# @app.put("/candidates/{candidate_id}", response_model=schemas.CandidateResponse)
# def update_candidate(candidate_id: int, candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
#     updated = crud.update_candidate(db, candidate_id, candidate)
#     if updated is None:
#         raise HTTPException(status_code=404, detail="Candidate not found")
#     return updated

# @app.delete("/candidates/{candidate_id}", response_model=schemas.CandidateResponse)
# def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
#     deleted = crud.delete_candidate(db, candidate_id)
#     if deleted is None:
#         raise HTTPException(status_code=404, detail="Candidate not found")
#     return deleted


# from fastapi import FastAPI
# from App.routes import candidate_routes, job_routes
# from App import models
# from App.database import engine

# models.Base.metadata.create_all(bind=engine)

# app = FastAPI()

# app.include_router(candidate_routes.router)
# app.include_router(job_routes.router)

# # ----------------------------------------------

# from fastapi import FastAPI
# from App.routes import candidate_routes  # adjust if route folder is different
# from App import models
# from App.database import engine

# # Create tables
# models.Base.metadata.create_all(bind=engine)

# app = FastAPI()

# # Include API routes
# app.include_router(candidate_routes.router)

# ============================================================================================================





