from enum import Enum
from sqlalchemy import desc
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.assignment import Assignment,AssignmentStatus
from app.schemas.assignment import AssignmentCreate
from fastapi import HTTPException

# Create
def create_assignment(db: Session, assignment_data: AssignmentCreate,current_user:User):
    assignment = Assignment(
        title=assignment_data.title,
        details=assignment_data.details,
        due_date=assignment_data.due_date,
        created_by=current_user.id
    
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

# Read (single)
def get_assignment(db: Session, assignment_id: int):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment

# Read (all)
def get_all_assignments(
    db: Session,
    current_user: User,
    skip: int = 0,
    limit: int = 100
):
    return (
        db.query(Assignment)
        .filter(Assignment.created_by == current_user.id) 
        .offset(skip)
        .limit(limit)
        .all()
    )
# Update
def get_all_assignments_admin(
    db: Session,
    skip: int = 0,
    limit: int = 100
):
    return (
        db.query(Assignment)
        .order_by(desc(Assignment.created_at))  # or desc(Assignment.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
def update_assignment(db: Session, assignment_id: int, update_data: dict, current_user: User):
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update assignments")

    assignment = get_assignment(db, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    for field, value in update_data.items():
        if hasattr(assignment, field) and value is not None:
            # Convert to Enum value if field is approval_status
            if field == "approval_status":
                if isinstance(value, str):
                    value = AssignmentStatus(value)  # will raise ValueError if invalid
                setattr(assignment, field, value)
            elif isinstance(value, Enum):
                setattr(assignment, field, value.value)
            else:
                setattr(assignment, field, value)

    db.commit()
    db.refresh(assignment)
    return assignment
# Delete
def delete_assignment(db: Session, assignment_id: int):
    assignment = get_assignment(db, assignment_id)
    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted"}
