"""
Run script for the ASL Recognition Service.
"""
import os
import subprocess
import sys
import uvicorn
import logging
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO,
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from .env file if it exists
try:
    load_dotenv()
    logger.info("Loaded environment variables from .env file")
except Exception as e:
    logger.warning(f"Could not load .env file: {e}")

# Set default environment variables if not already set
if not os.environ.get("PORT"):
    os.environ["PORT"] = "8000"
if not os.environ.get("CORS_ORIGINS"):
    os.environ["CORS_ORIGINS"] = "http://localhost:3000"
if not os.environ.get("MODEL_SAVE_DIR"):
    os.environ["MODEL_SAVE_DIR"] = "../../../gnec_hackathon/ai/models"
if not os.environ.get("PREDICTION_THRESHOLD"):
    os.environ["PREDICTION_THRESHOLD"] = "0.7"
if not os.environ.get("SEQUENCE_LENGTH"):
    os.environ["SEQUENCE_LENGTH"] = "10"
if not os.environ.get("STABLE_THRESHOLD"):
    os.environ["STABLE_THRESHOLD"] = "8"
if not os.environ.get("REQUIRED_HOLD_TIME"):
    os.environ["REQUIRED_HOLD_TIME"] = "0.0"
if not os.environ.get("COOLDOWN_TIME"):
    os.environ["COOLDOWN_TIME"] = "1.5"

# Check if Gemini API key is set, warn if not found
if not os.environ.get("GEMINI_API_KEY"):
    logger.warning("GEMINI_API_KEY not found in environment or .env file")
    logger.warning("Sentence analysis functionality will not work properly")
    logger.warning("Please set a valid GEMINI_API_KEY in your .env file")

def check_dependencies():
    """Check if all required dependencies are installed."""
    required = [
        "fastapi", "uvicorn", "python-multipart", "numpy", 
        "opencv-python", "torch", "mediapipe", "websockets",
        "python-dotenv", "requests", "google-generativeai"
    ]
    missing = []
    
    for package in required:
        try:
            __import__(package.split("==")[0].replace("-", "_"))
        except ImportError:
            missing.append(package)
    
    if missing:
        logger.info(f"Missing dependencies: {', '.join(missing)}")
        logger.info("Installing missing dependencies...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            logger.info("Dependencies installed successfully.")
        except Exception as e:
            logger.error(f"Failed to install dependencies: {e}")
            logger.error("Please install the required dependencies manually.")
            return False
    return True

def check_model_files():
    """Check if model files exist."""
    model_save_dir = os.environ.get('MODEL_SAVE_DIR', '../../../gnec_hackathon/ai/models')
    best_model_path = os.environ.get('BEST_MODEL_PATH', os.path.join(model_save_dir, 'best_lstm_model_sequences_sorted.pth'))
    label_map_path = os.environ.get('LABEL_MAP_PATH', os.path.join(model_save_dir, 'label_map_sequences.pickle'))
    
    if not os.path.exists(model_save_dir):
        try:
            os.makedirs(model_save_dir, exist_ok=True)
            logger.info(f"Created model directory: {model_save_dir}")
        except Exception as e:
            logger.error(f"Failed to create model directory: {e}")
    
    if not os.path.exists(best_model_path):
        logger.warning(f"Warning: Model file not found at {best_model_path}")
        logger.warning("You will need to train or download the model file for ASL recognition to work.")
    
    if not os.path.exists(label_map_path):
        logger.warning(f"Warning: Label map file not found at {label_map_path}")
        logger.warning("You will need to generate or download the label map file for ASL recognition to work.")

def main():
    """Main entry point."""
    logger.info("Starting ASL Recognition Service...")
    
    # Check dependencies and model files
    if not check_dependencies():
        sys.exit(1)
    
    check_model_files()
    
    # Get port from environment variable or use default
    port = int(os.environ.get("PORT", 8000))
    
    logger.info(f"ASL Recognition Service will be available at: http://localhost:{port}")
    logger.info(f"WebSocket endpoint will be available at: ws://localhost:{port}/ws/asl-recognition")
    logger.info("Press Ctrl+C to stop the server.")
    
    # Start the FastAPI application
    try:
        uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
    except Exception as e:
        logger.error(f"Failed to start the server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 