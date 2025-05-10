FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for OpenCV and Mediapipe
RUN apt-get update && apt-get install -y \
  libgl1-mesa-glx \
  libglib2.0-0 \
  && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create model directory
RUN mkdir -p models

# Set environment variables
ENV PORT=8000
ENV MODEL_SAVE_DIR=models
ENV PREDICTION_THRESHOLD=0.7
ENV GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["python", "run.py"] 