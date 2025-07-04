from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.assignment import Assignment
from app.utils.s3 import upload_file_to_s3
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/admin/assignments", tags=["Admin Service"])

@router.post("/{assignment_id}/upload-final")
def admin_upload_final_file(
    assignment_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Only admins can upload final files")

    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Optional: enforce approval before final upload
    if assignment.approval_status.value != "approved":
        raise HTTPException(status_code=400, detail="Assignment must be approved before uploading final file")

    file_url = upload_file_to_s3(file, assignment_id)
    assignment.completed_url = file_url  # ensure this column exists
    db.commit()
    return {"final_file_url": file_url}
