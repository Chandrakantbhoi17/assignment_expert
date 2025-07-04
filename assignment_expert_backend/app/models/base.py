
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base,Session
from app.core.config import settings

DATABASE_URI = str(settings.DATABASE_URI)

engine = create_engine(DATABASE_URI, echo=False, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Session:
    """Yields a new database session and ensures it's closed after request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
