from typing import List
from app.models.base import get_db
from fastapi import APIRouter, Depends, HTTPException,UploadFile,File
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.assignment import Assignment
from app.utils.s3 import upload_file_to_s3
from app.core.dependencies import get_current_user
from app.schemas.assignment import AssignmentCreate,AssignmentOut,AssignmentUpdate
from app.crud.assignment import create_assignment,get_all_assignments,update_assignment,get_all_assignments_admin,get_assignment

router = APIRouter(prefix="/assignments")

@router.post("/create", response_model=AssignmentOut,tags=["User Service"])
def create(assignment: AssignmentCreate, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    return create_assignment(db, assignment,current_user)

@router.get("/my", response_model=List[AssignmentOut],tags=["User Service"])
def get_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_assignments(db,current_user)


@router.get("/{assignment_id}", response_model=AssignmentOut,tags=["Admin Service", "User Service"])
def read_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = get_assignment(db, assignment_id)
    return assignment


@router.get("/", response_model=List[AssignmentOut],tags=["Admin Service"])
def get_all_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_assignments_admin(db)
@router.patch("/{assignment_id}", response_model=AssignmentOut,tags=["Admin Service"])
def patch_assignment(
    assignment_id: int,
    update_data: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return update_assignment(
        db,
        assignment_id,
        update_data.dict(exclude_unset=True),
        current_user
    )


@router.post("/{assignment_id}/upload-file",tags=["User Service"])
def upload_assignment_file(
    assignment_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    file_url = upload_file_to_s3(file,assignment_id)
    assignment.file_url = file_url
    db.commit()
    return {"file_url": file_url}
