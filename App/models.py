from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from .database import Base


# -------------------- Candidate Model --------------------
class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    resume_path = Column(String, nullable=True) 

    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")


# -------------------- Job Model --------------------
class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    location = Column(String)

    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")


# -------------------- Application (Join Table) --------------------
class Application(Base):
    __tablename__ = "applications"
    __table_args__ = {'extend_existing': True}  # ✅ Fixes table already defined error

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    candidate = relationship("Candidate", back_populates="applications")
    job = relationship("Job", back_populates="applications")

