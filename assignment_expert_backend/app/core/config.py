from typing import Any, Dict, List, Optional, Union
from pathlib import Path
import os

from pydantic import AnyHttpUrl, BaseSettings, PostgresDsn, validator


class Settings(BaseSettings):
    PROJECT_NAME: str
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # DB selection
    DB_TYPE: str = "sqlite"  # "sqlite" or "postgres"

    # SQLite
    SQLITE_PATH: Optional[str] = "./data/app.db"  # default file

    # Postgres (kept for fallback)
    POSTGRES_HOST: Optional[str] = None
    POSTGRES_PORT: Optional[str] = None
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None

    DATABASE_URI: Optional[str] = None

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_S3_BUCKET: str
    AWS_S3_REGION: str

    RAZORPAY_KEY_ID: str
    RAZORPAY_SECRET_KEY: str

    @validator("DATABASE_URI", pre=True, always=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        db_type = (values.get("DB_TYPE") or "sqlite").lower()
        if isinstance(v, str) and v.strip():
            return v  # explicit override

        if db_type == "sqlite":
            path = values.get("SQLITE_PATH") or ":memory:"
            if path != ":memory:":
                p = Path(path)
                try:
                    p.parent.mkdir(parents=True, exist_ok=True)
                except Exception:
                    pass  # best-effort, let SQLite error surface if cannot create
                abs_path = os.path.abspath(p.as_posix())
                return f"sqlite:///{abs_path}"
            else:
                return "sqlite:///:memory:"
        elif db_type in ("postgres", "postgresql"):
            required = ["POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_HOST", "POSTGRES_PORT", "POSTGRES_DB"]
            if not all(values.get(k) for k in required):
                missing = [k for k in required if not values.get(k)]
                raise ValueError(f"Missing Postgres settings: {missing}")
            return PostgresDsn.build(
                scheme="postgresql",
                user=values.get("POSTGRES_USER"),
                password=values.get("POSTGRES_PASSWORD"),
                host=values.get("POSTGRES_HOST"),
                port=str(values.get("POSTGRES_PORT")),
                path=f"/{values.get('POSTGRES_DB') or ''}",
            )
        else:
            raise ValueError("DB_TYPE must be 'sqlite' or 'postgres'")

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
