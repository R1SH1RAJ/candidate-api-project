# App/crud.py
# -------------------------------------------------
# CRUD operations for Candidate, Job, and Application
# -------------------------------------------------

from sqlalchemy.orm import Session
from App import models, schemas
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from sqlalchemy.orm import selectinload


# -------------------------------------------------
# Candidate CRUD
# -------------------------------------------------

def create_candidate(db: Session, candidate: schemas.CandidateCreate):
    db_candidate = models.Candidate(**candidate.dict())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def get_candidates(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Candidate).offset(skip).limit(limit).all()

def get_candidate(db: Session, candidate_id: int):
    return db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

def update_candidate(db: Session, candidate_id: int, candidate: schemas.CandidateCreate):
    db_candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    for key, value in candidate.dict().items():
        setattr(db_candidate, key, value)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def delete_candidate(db: Session, candidate_id: int):
    db_candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    db.delete(db_candidate)
    db.commit()
    return {"message": "Candidate deleted successfully"}


# -------------------------------------------------
# Job CRUD
# -------------------------------------------------

def create_job(db: Session, job: schemas.JobCreate):
    db_job = models.Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def get_jobs(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Job).offset(skip).limit(limit).all()

def get_job(db: Session, job_id: int):
    return db.query(models.Job).filter(models.Job.id == job_id).first()

def update_job(db: Session, job_id: int, job: schemas.JobCreate):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    for key, value in job.dict().items():
        setattr(db_job, key, value)
    db.commit()
    db.refresh(db_job)
    return db_job

def delete_job(db: Session, job_id: int):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(db_job)
    db.commit()
    return {"message": "Job deleted successfully"}


# -------------------------------------------------
# Application CRUD
# -------------------------------------------------

# Create an application (with basic duplicate check)
def create_application(db: Session, application: schemas.ApplicationCreate):
    # Check if candidate exists
    candidate = db.query(models.Candidate).filter(models.Candidate.id == application.candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Check if job exists
    job = db.query(models.Job).filter(models.Job.id == application.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Optional: Check for duplicate application
    existing_app = db.query(models.Application).filter(
        models.Application.candidate_id == application.candidate_id,
        models.Application.job_id == application.job_id
    ).first()
    if existing_app:
        raise HTTPException(status_code=400, detail="Application already exists")

    db_application = models.Application(
        candidate_id=application.candidate_id,
        job_id=application.job_id
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

# Get all applications
def get_applications(db: Session, skip: int = 0, limit: int = 10):
    """
    Return applications and eagerly load candidate & job so the response
    serializer doesn't trigger N+1 queries.
    """
    return (
        db.query(models.Application)
          .options(
              selectinload(models.Application.candidate),
              selectinload(models.Application.job),
          )
          .offset(skip)
          .limit(limit)
          .all()
    )

# Get single application
def get_application(db: Session, application_id: int):
    return (
        db.query(models.Application)
          .options(
              selectinload(models.Application.candidate),
              selectinload(models.Application.job),
          )
          .filter(models.Application.id == application_id)
          .first()
    )


# Delete application
def delete_application(db: Session, application_id: int):
    db_application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(db_application)
    db.commit()
    return {"message": "Application deleted successfully"}
