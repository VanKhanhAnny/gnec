# ASL Recognition Integration Guide

This guide explains how to integrate and run the ASL Recognition system with the GNEC application.

## Components Overview

The integration consists of three main components:

1. **Next.js Frontend**: The user interface that captures video from the webcam and displays recognition results.
2. **NestJS Backend**: The REST API server that handles user authentication, job search, and other core features.
3. **ASL Recognition Service**: A Python FastAPI service that processes sign language video and returns recognized text.

## Running the System

### Option 1: Running Each Component Separately

#### 1. Start the NestJS backend:

```bash
cd gnec_hackathon/backend
npm install
npm run start:dev
```

The backend will be available at http://localhost:5000.

#### 2. Start the ASL Recognition service:

```bash
cd gnec_hackathon/backend/asl-service
python setup.py      # First-time setup
python run.py        # Start the service
```

The ASL service will be available at http://localhost:8000.

#### 3. Start the Next.js frontend:

```bash
cd gnec_frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000.

### Option 2: Running the Integrated System

For convenience, a script is provided that starts all components together:

```bash
cd gnec_hackathon/backend
python run_services.py
```

This will start both the NestJS backend and the ASL Recognition service in the same terminal. Then start the frontend separately:

```bash
cd gnec_frontend
npm run dev
```

## Using the ASL Recognition Feature

1. Navigate to http://localhost:3000/sign-language in your browser
2. Click the "Start Camera" button to activate your webcam
3. Start signing to see the real-time translation

## Configuration

### ASL Recognition Service Configuration

The ASL service can be configured by editing the `.env` file in the `gnec_hackathon/backend/asl-service` directory:

- `USE_MOCK_MODEL=true` - Uses a simulated model for testing when set to true (default)
- `USE_MOCK_MODEL=false` - Uses a real trained model when set to false (requires model files)

### Frontend Configuration

The frontend can be configured by editing the `.env.local` file in the `gnec_frontend` directory:

- `NEXT_PUBLIC_API_URL=http://localhost:5000` - URL of the NestJS backend
- `NEXT_PUBLIC_ASL_SERVICE_URL=ws://localhost:8000` - WebSocket URL of the ASL service

## Troubleshooting

### Camera Access Issues

If the camera doesn't start:

1. Ensure your browser has camera permissions
2. Check console for WebSocket connection errors
3. Ensure the ASL service is running

### WebSocket Connection Issues

If the WebSocket connection fails:

1. Check that the ASL service is running
2. Verify that port 8000 is not blocked by a firewall
3. Check browser console for specific error messages

### Model Loading Issues

By default, the system uses a mock model for development. To use a real trained model:

1. Set `USE_MOCK_MODEL=false` in the ASL service `.env` file
2. Ensure the model files exist in the configured directory
3. Restart the ASL service

## Development and Extension

### Using a Real Trained Model

1. Place your `.pth` model file and label map pickle file in the `gnec_hackathon/ai/models` directory
2. Update the paths in the ASL service `.env` file
3. Set `USE_MOCK_MODEL=false`
4. Restart the ASL service

### Adding New ASL Recognition Features

To extend the ASL recognition capabilities:

1. Modify `asl_recognizer.py` to add new features
2. Update the frontend to support the new features
3. Test with both mock and real models

### Adding Support for Other Sign Languages

The current implementation focuses on ASL, but can be extended for other sign languages:

1. Train a new model for the target sign language
2. Update the model paths in the `.env` file
3. Add language selection in the frontend UI 