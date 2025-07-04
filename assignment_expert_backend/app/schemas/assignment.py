import enum
from pydantic import BaseModel,validator
from typing import Optional, List
from datetime import datetime,date
from enum import Enum

class AssignmentStatus(str, Enum):
    Pending = "pending"
    Approved = "approved"
    Rejected = "rejected"

class AssignmentCreate(BaseModel):
    title: str
    details: Optional[str]
    due_date: date


class AssignmentUpdate(BaseModel):
    amount: Optional[float] = None
    approval_status: Optional[AssignmentStatus] = None

class AssignmentOut(BaseModel):
    id: int
    title: str
    details: Optional[str]
    due_date: date
    created_at: datetime
    updated_at: datetime
    approval_status: AssignmentStatus
    amount: Optional[float] = None
    completed_url:Optional[str]=None
    file_url:Optional[str]=None
    total_paid: float
    is_half_paid: bool
    is_fully_paid: bool

    class Config:
        orm_mode = True

    @validator("approval_status", pre=True)
    def convert_enum_to_str(cls, v):
        return v.value if isinstance(v, enum.Enum) else v
