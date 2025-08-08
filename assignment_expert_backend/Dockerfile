# Use official Python 3.9.13 image (slim for smaller size)
FROM python:3.9.13-slim

# Prevent Python from writing pyc files & force stdout/stderr to be unbuffered
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies (only if needed for building wheels)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

# Copy dependency file first for Docker cache efficiency
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade "pip<24.1" \
 && pip install --no-cache-dir -r requirements.txt

# Copy Alembic config
COPY alembic.ini ./alembic.ini

# Copy application code
COPY ./app ./app
COPY ./data ./data
COPY ./uploads ./uploads

# Copy migrations folder into container root
COPY ./migrations ./migrations

# Expose FastAPI port
EXPOSE 8000

# Run migrations automatically before starting FastAPI
CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
