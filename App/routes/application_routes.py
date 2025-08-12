from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from App import models, schemas, crud
from App.database import get_db

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)

# Create application
@router.post("/", response_model=schemas.Application)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    return crud.create_application(db=db, application=application)

# Get all applications
@router.get("/", response_model=list[schemas.Application])
def read_applications(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_applications(db=db, skip=skip, limit=limit)

# Get application by ID
@router.get("/{application_id}", response_model=schemas.Application)
def read_application(application_id: int, db: Session = Depends(get_db)):
    db_application = crud.get_application(db=db, application_id=application_id)
    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application

@router.delete("/{application_id}", response_model=schemas.ApplicationResponse)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_application(db, application_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return deleted

@router.put("/{application_id}", response_model=schemas.ApplicationResponse)
def update_application(application_id: int, application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    updated = crud.update_application(db, application_id, application)
    if updated is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return updated
