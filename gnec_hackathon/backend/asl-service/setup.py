#!/usr/bin/env python
"""
Setup script for ASL Recognition Service.
This script helps ensure all necessary components are installed and configured.
"""
import os
import sys
import subprocess
import platform
import shutil
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("asl-setup")

def check_python_version():
    """Check that Python version is compatible."""
    required_version = (3, 9)
    current_version = sys.version_info
    
    if current_version.major < required_version[0] or (
        current_version.major == required_version[0] and current_version.minor < required_version[1]
    ):
        logger.error(
            f"Python {required_version[0]}.{required_version[1]} or higher is required. "
            f"You are using Python {current_version.major}.{current_version.minor}.{current_version.micro}."
        )
        return False
    
    logger.info(f"Using Python {current_version.major}.{current_version.minor}.{current_version.micro}")
    return True

def create_virtual_environment():
    """Create a virtual environment if one doesn't exist."""
    venv_dir = "venv"
    
    if os.path.exists(venv_dir):
        logger.info(f"Virtual environment already exists at {venv_dir}")
        return True
    
    try:
        logger.info("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", venv_dir], check=True)
        logger.info(f"Virtual environment created at {venv_dir}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to create virtual environment: {e}")
        return False

def install_requirements():
    """Install required packages."""
    try:
        logger.info("Installing required packages...")
        
        # Determine pip command based on venv and platform
        if platform.system() == 'Windows':
            pip_cmd = os.path.join("venv", "Scripts", "pip")
        else:
            pip_cmd = os.path.join("venv", "bin", "pip")
        
        subprocess.run([pip_cmd, "install", "--upgrade", "pip"], check=True)
        subprocess.run([pip_cmd, "install", "-r", "requirements.txt"], check=True)
        
        logger.info("Required packages installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to install required packages: {e}")
        return False

def create_env_file():
    """Create .env file if it doesn't exist."""
    env_file = ".env"
    
    if os.path.exists(env_file):
        logger.info(f".env file already exists at {env_file}")
        return True
    
    try:
        logger.info("Creating .env file...")
        with open(env_file, "w") as f:
            f.write("# ASL Service Configuration\n")
            f.write("PORT=8000\n")
            f.write("\n# Model paths\n")
            f.write("MODEL_SAVE_DIR=../../../gnec_hackathon/ai/models\n")
            f.write("BEST_MODEL_PATH=../../../gnec_hackathon/ai/models/best_lstm_model_sequences_sorted.pth\n")
            f.write("LABEL_MAP_PATH=../../../gnec_hackathon/ai/models/label_map_sequences.pickle\n")
            f.write("\n# Model parameters\n")
            f.write("SEQUENCE_LENGTH=10\n")
            f.write("NUM_LANDMARKS=21\n")
            f.write("FEATURES_PER_LANDMARK=2\n")
            f.write("PREDICTION_THRESHOLD=0.7\n")
            f.write("\n# Recognition parameters\n")
            f.write("STABLE_THRESHOLD=8\n")
            f.write("REQUIRED_HOLD_TIME=0.0\n")
            f.write("COOLDOWN_TIME=1.5\n")
            f.write("\n# CORS settings\n")
            f.write("CORS_ORIGINS=http://localhost:3000\n")
            f.write("\n# Gemini API settings\n")
            f.write("GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE\n")
        
        logger.info(f".env file created at {env_file}")
        return True
    except Exception as e:
        logger.error(f"Failed to create .env file: {e}")
        return False

def create_model_directories():
    """Create model directories if they don't exist."""
    model_dir = "../../../gnec_hackathon/ai/models"
    
    try:
        if not os.path.exists(model_dir):
            os.makedirs(model_dir, exist_ok=True)
            logger.info(f"Created model directory at {model_dir}")
        else:
            logger.info(f"Model directory already exists at {model_dir}")
        return True
    except Exception as e:
        logger.error(f"Failed to create model directory: {e}")
        return False

def main():
    """Main setup function."""
    logger.info("Starting ASL Recognition Service setup...")
    
    # Check Python version
    if not check_python_version():
        logger.error("Setup failed: Python version check failed")
        return False
    
    # Create virtual environment
    if not create_virtual_environment():
        logger.error("Setup failed: Virtual environment creation failed")
        return False
    
    # Install requirements
    if not install_requirements():
        logger.error("Setup failed: Package installation failed")
        return False
    
    # Create .env file
    if not create_env_file():
        logger.error("Setup failed: .env file creation failed")
        return False
    
    # Create model directories
    if not create_model_directories():
        logger.error("Setup failed: Model directory creation failed")
        return False
    
    logger.info("ASL Recognition Service setup completed successfully!")
    logger.info("To start the service, run:")
    
    if platform.system() == 'Windows':
        logger.info("venv\\Scripts\\python run.py")
    else:
        logger.info("venv/bin/python run.py")
    
    logger.info("Note: You will need to add real model files to the models directory.")
    logger.info("And update the GEMINI_API_KEY in the .env file for sentence analysis.")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 