# ASL Recognition Service

This service provides real-time American Sign Language (ASL) recognition through a WebSocket API.

## Features

- Real-time ASL recognition through WebSocket connections
- Support for video file uploads for batch processing
- Built with FastAPI, OpenCV, and MediaPipe
- Gemini API integration for enhanced ASL sentence analysis
- Production-ready Docker configuration

## Getting Started

### Prerequisites

- Python 3.9+
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. Clone the repository
2. Navigate to the ASL service directory:

```bash
cd gnec_hackathon/backend/asl-service
```

3. Create and activate a virtual environment (optional but recommended):

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows
```

4. Install the dependencies:

```bash
pip install -r requirements.txt
```

### Configuration

The service can be configured through environment variables or a `.env` file:

- `PORT`: The port to run the service on (default: 8000)
- `MODEL_SAVE_DIR`: Directory for model files
- `BEST_MODEL_PATH`: Path to the trained model file
- `LABEL_MAP_PATH`: Path to the label mapping file
- `PREDICTION_THRESHOLD`: Confidence threshold for predictions (default: 0.7)
- `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS
- `GEMINI_API_KEY`: Your Google Gemini API key for enhanced sentence analysis

### Setting up Gemini API Integration

This service integrates with Google's Gemini API to analyze ASL letter sequences and convert them into meaningful sentences.

1. Get a Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

2. Add the API key to your environment:
   - Create a `.env` file in the asl-service directory
   - Add `GEMINI_API_KEY=your_api_key_here` to the file
   - Or set it as an environment variable

3. The ASL service will automatically use Gemini's AI to analyze letter sequences when pauses are detected.

### Running the Service

Run the service using the provided run script:

```bash
python run.py
```

This will start the service on the configured port (default: 8000).

## API Endpoints

### WebSocket Endpoint

- `/ws/asl-recognition`: WebSocket endpoint for real-time ASL recognition

### HTTP Endpoints

- `GET /`: Root endpoint with service information
- `GET /health`: Health check endpoint
- `GET /status`: Detailed status information
- `POST /reset`: Reset the recognizer state
- `POST /api/upload-video`: Upload and process a video file

## Docker Deployment

The service can be deployed using Docker:

```bash
# Build the Docker image
docker build -t asl-recognition-service .

# Run the container
docker run -p 8000:8000 asl-recognition-service
```

## Frontend Integration

To use this service with the frontend, configure the WebSocket connection to point to `ws://localhost:8000/ws/asl-recognition`.

Example React/Next.js integration:

```typescript
// In your React component
const [websocket, setWebsocket] = useState<WebSocket | null>(null);

useEffect(() => {
  const ws = new WebSocket('ws://localhost:8000/ws/asl-recognition');
  
  ws.onopen = () => {
    console.log('WebSocket connection established');
    setWebsocket(ws);
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Process the recognition results
  };
  
  return () => {
    ws.close();
  };
}, []);
```

## Using a Real Trained Model

To use a trained model:

1. Place your model file in the configured model directory
2. Configure `BEST_MODEL_PATH` and `LABEL_MAP_PATH` to point to your model files
3. Start the service

## License

This project is licensed under the MIT License - see the LICENSE file for details. 