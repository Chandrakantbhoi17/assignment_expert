# Use official Python 3.9.13 image
FROM python:3.9.13-slim

# Set working directory
WORKDIR /app

# Copy and install dependencies

COPY ./requirements.txt .
RUN pip install --upgrade "pip<24.1" \
 && pip install -r requirements.txt


# Copy the rest of the app
COPY ./app .

# Expose FastAPI port
EXPOSE 8000

# Run the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
