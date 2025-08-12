# App/routes/job_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from App import models, schemas, crud
from App.database import get_db

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

@router.post("/", response_model=schemas.Job)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    return crud.create_job(db=db, job=job)

@router.get("/", response_model=list[schemas.Job])
def read_jobs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_jobs(db=db, skip=skip, limit=limit)

@router.get("/{job_id}", response_model=schemas.Job)
def read_job(job_id: int, db: Session = Depends(get_db)):
    db_job = crud.get_job(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job

@router.put("/{job_id}", response_model=schemas.Job)
def update_job(job_id: int, job: schemas.JobCreate, db: Session = Depends(get_db)):
    updated = crud.update_job(db, job_id, job)
    if updated is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return updated

@router.delete("/{job_id}", response_model=schemas.Job)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_job(db, job_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return deleted
