import os
import cv2
import numpy as np
import base64
import json
from typing import Dict, List, Optional, Union
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from dotenv import load_dotenv
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import our ASL recognition modules
from asl_recognizer import ASLRecognizer

# Try to load environment variables from .env file, but don't fail if it doesn't exist
try:
    load_dotenv(dotenv_path=".env", verbose=False)
    logger.info("Loaded environment variables from .env file")
except Exception as e:
    logger.warning(f"Could not load .env file: {e}. Using environment variables directly.")

# Get environment variables
PORT = int(os.environ.get("PORT", 8000))
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")

# Create FastAPI app
app = FastAPI(
    title="ASL Recognition API",
    description="API for real-time ASL recognition",
    version="1.0.0"
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the ASL recognizer
asl_recognizer = ASLRecognizer()

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "ASL Recognition API is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "model_loaded": asl_recognizer.model_loaded
    }

@app.get("/status")
async def status():
    """Return detailed status information"""
    return {
        "status": "online",
        "version": "1.0.0",
        "model_loaded": asl_recognizer.model_loaded,
        "current_sentence": asl_recognizer.sentence,
        "prediction_threshold": asl_recognizer.PREDICTION_THRESHOLD,
    }

@app.post("/reset")
async def reset_recognizer():
    """Reset the recognizer state"""
    return asl_recognizer.reset()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        return len(self.active_connections)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        return len(self.active_connections)

    async def broadcast(self, message: Dict):
        """Broadcast a message to all connected clients"""
        for connection in self.active_connections:
            await connection.send_json(message)

# Initialize the connection manager
manager = ConnectionManager()

@app.websocket("/ws/asl-recognition")
async def websocket_endpoint(websocket: WebSocket):
    # Accept the connection
    client_id = await manager.connect(websocket)
    logger.info(f"Client connected. Total active connections: {client_id}")
    
    try:
        while True:
            # Receive the base64 encoded image from the client
            data = await websocket.receive_text()
            try:
                json_data = json.loads(data)
                image_data = json_data.get("image", "")
                
                # Check if this is a command message
                if "command" in json_data:
                    command = json_data["command"]
                    if command == "reset":
                        result = asl_recognizer.reset()
                        await websocket.send_json(result)
                        continue
                
                if not image_data:
                    await websocket.send_json({"error": "No image data received"})
                    continue
                
                # Decode base64 image
                img_bytes = base64.b64decode(image_data)
                img_array = np.frombuffer(img_bytes, dtype=np.uint8)
                frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                
                if frame is None or frame.size == 0:
                    await websocket.send_json({"error": "Invalid image data"})
                    continue
                
                # Process the frame with our ASL recognizer
                result = asl_recognizer.process_frame(frame)
                
                # Send the result back to the client
                await websocket.send_json(result)
            
            except json.JSONDecodeError:
                await websocket.send_json({"error": "Invalid JSON data"})
            except Exception as e:
                logger.error(f"Error processing frame: {str(e)}")
                await websocket.send_json({"error": f"Error processing frame: {str(e)}"})
    
    except WebSocketDisconnect:
        # Remove the client from the connection manager
        remaining = manager.disconnect(websocket)
        logger.info(f"Client disconnected. Remaining active connections: {remaining}")

@app.post("/api/upload-video")
async def upload_video(file: UploadFile = File(...)):
    """Upload and process a video file for ASL recognition"""
    try:
        # Save the uploaded video file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as temp_file:
            content = await file.read()
            temp_file.write(content)
        
        # Process the video file
        results = asl_recognizer.process_video(temp_file_path)
        
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        return {"message": "Video processed successfully", "results": results}
    
    except Exception as e:
        # Clean up in case of errors
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

# Error handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for the API"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"message": f"An unexpected error occurred: {str(exc)}"}
    )

if __name__ == "__main__":
    logger.info(f"Starting ASL Recognition API on port {PORT}")
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True) 