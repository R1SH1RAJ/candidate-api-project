# App/routes/candidate_routes.py

from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from App import models, schemas, crud
from App.database import get_db

router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)

@router.post("/", response_model=schemas.Candidate)
def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
    return crud.create_candidate(db=db, candidate=candidate)

@router.get("/", response_model=list[schemas.Candidate])
def read_candidates(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_candidates(db=db, skip=skip, limit=limit)

@router.get("/{candidate_id}", response_model=schemas.Candidate)
def read_candidate(candidate_id: int, db: Session = Depends(get_db)):
    db_candidate = crud.get_candidate(db, candidate_id=candidate_id)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate

@router.put("/{candidate_id}", response_model=schemas.Candidate)
def update_candidate(candidate_id: int, candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
    db_candidate = crud.update_candidate(db, candidate_id, candidate)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate

@router.delete("/{candidate_id}", response_model=schemas.Candidate)
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    db_candidate = crud.delete_candidate(db, candidate_id)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate


UPLOAD_DIR = Path("resumes")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/{candidate_id}/upload_resume/")
async def upload_resume(
    candidate_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    file_path = UPLOAD_DIR / f"{candidate_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    candidate.resume_path = str(file_path)
    db.commit()

    return {
        "message": "Resume uploaded successfully",
        "file_path": str(file_path)
    }





