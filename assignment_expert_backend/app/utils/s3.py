import boto3
import os
from uuid import uuid4
from fastapi import UploadFile
from app.core.config import settings


def upload_file(current_user_id: int, file: UploadFile, assignment_id: int) -> str:
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid4()}.{file_ext}"
    key = f"{current_user_id}/{assignment_id}/{filename}"

    if settings.UPLOAD_TYPE == "aws":
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION,
        )

        s3.upload_fileobj(
            file.file,
            settings.AWS_S3_BUCKET,
            key,
            ExtraArgs={"ContentType": file.content_type}
        )

        return f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_S3_REGION}.amazonaws.com/{key}"

    else:
        # Local file upload
        upload_dir = os.path.join(settings.LOCAL_UPLOAD_DIR, str(current_user_id), str(assignment_id))
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, filename)
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        return f"{settings.BACKEND_URL}\{file_path}"  # Or build URL if serving via StaticFiles
