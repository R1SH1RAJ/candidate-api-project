# schemas.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --------------------------------------------------------
# Candidate Schemas
# --------------------------------------------------------

class CandidateBase(BaseModel):
    name: str
    email: str
    phone: str

class CandidateCreate(CandidateBase):
    pass

class Candidate(CandidateBase):
    id: int
    resume_path: Optional[str] = None 
    class Config:
        orm_mode = True


# --------------------------------------------------------
# Job Schemas
# --------------------------------------------------------

class JobBase(BaseModel):
    title: str
    description: str
    location: str

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int

    class Config:
        orm_mode = True


# --------------------------------------------------------
# Application Schemas
# --------------------------------------------------------

class ApplicationCreate(BaseModel):
    candidate_id: int
    job_id: int

# Standard Application schema (basic)
class Application(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    applied_at: datetime

    class Config:
        orm_mode = True

# Extended Application schema (nested candidate & job)
class ApplicationResponse(BaseModel):
    id: int
    candidate: Candidate   # nested candidate object
    job: Job               # nested job object
    applied_at: datetime

    class Config:
        orm_mode = True


# Forward reference resolution (in case of circular refs)
ApplicationResponse.update_forward_refs()

