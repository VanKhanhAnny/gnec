# GNEC - Sign Language Recognition Platform

GNEC is a comprehensive platform that combines modern web technologies with AI-powered sign language recognition to create an accessible communication solution.

## Project Structure

The project consists of three main components:

### 1. Frontend (`gnec_frontend/`)
- Built with Next.js and TypeScript
- Modern UI with responsive design
- Authentication using Clerk
- Real-time communication with backend services

### 2. Backend (`gnec_hackathon/backend/`)
- NestJS-based REST API
- Prisma ORM for database management
- User authentication and management
- Job search integration
- API endpoints for AI service integration

### 3. ASL Service (`gnec_hackathon/backend/asl-service/`)
- Python-based FastAPI application
- WebSocket connection for real-time video streaming
- Machine learning models for ASL recognition
- Integration with Google Gemini API for sentence analysis

### 4. AI Component (`gnec_hackathon/ai/`)
- Python-based sign language recognition models
- Training and testing utilities

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- PostgreSQL database
- Clerk account for authentication
- Google Gemini API key (for sentence analysis)

## Complete Setup Guide

Follow these steps in order to set up and run the entire application:

### 1. Environment Files Setup

**Frontend (.env.local)**
```bash
# Navigate to frontend directory
cd gnec_frontend

# Create .env.local file
cat > .env.local << EOL
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_API_URL=http://localhost:5000
EOL
```

**Backend (.env)**
```bash
# Navigate to backend directory
cd gnec_hackathon/backend

# Create .env file
cat > .env << EOL
DATABASE_URL=postgresql://user:password@localhost:5432/gnec
CLERK_SECRET_KEY=your_secret_key
CLERK_PUBLISHABLE_KEY=your_publishable_key
PORT=5000
EOL
```

**ASL Service (.env)**
```bash
# Navigate to ASL service directory
cd gnec_hackathon/backend/asl-service

# Create .env file
cat > .env << EOL
PORT=8000
MODEL_SAVE_DIR=../../../gnec_hackathon/ai/models
PREDICTION_THRESHOLD=0.7
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGINS=http://localhost:3000
EOL
```

### 2. Frontend Setup and Run

```bash
# Navigate to frontend directory
cd gnec_frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 3. Backend Setup and Run

```bash
# Navigate to backend directory
cd gnec_hackathon/backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run start:dev

# Optional: Open Prisma Studio in another terminal
npx prisma studio
```

### 4. ASL Service Setup and Run

```bash
# Navigate to ASL service directory
cd gnec_hackathon/backend/asl-service

# Create and activate Python virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the service
python run.py
```

### 5. AI Component Setup (if needed for model training)

```bash
# Navigate to AI directory
cd gnec_hackathon/ai

# Create and activate Python virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Running the Application

After completing the setup, you should have:

1. Frontend running on http://localhost:3000
2. Backend API running on http://localhost:5000
3. ASL Service running on http://localhost:8000
4. Prisma Studio (optional) on http://localhost:5555

To use the application:
1. Navigate to http://localhost:3000 in your browser
2. Create an account or log in using Clerk authentication
3. Access the sign language recognition feature at http://localhost:3000/sign-language
4. Allow camera access when prompted
5. Start signing to see real-time translation

## Troubleshooting

### Common Issues and Solutions

1. **Database connection issues**:
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in the backend .env file
   - Run `npx prisma db push` to sync the database schema

2. **"No module named 'xyz'"**:
   - Ensure you've activated the correct virtual environment
   - Run `pip install -r requirements.txt` again in the specific directory

3. **WebSocket connection failed**:
   - Ensure ASL service is running on port 8000
   - Check browser console for CORS errors
   - Verify all services are running

4. **No sentence analysis in ASL recognition**:
   - Make sure you've added your Google Gemini API key to the ASL service .env file
   - Check the logs for API related errors

5. **Video feed appears then turns black**:
   - This may be due to WebSocket connection issues
   - Check that both frontend and ASL service are running
   - Inspect browser console for errors

6. **Authentication issues**:
   - Verify your Clerk credentials in both frontend and backend .env files
   - Check browser console for authentication errors

## Development

### Running Tests
```bash
# Frontend tests
cd gnec_frontend
npm test

# Backend tests
cd gnec_hackathon/backend
npm test

# AI component tests
cd gnec_hackathon/ai
python -m pytest
```

### Database Migrations
```bash
cd gnec_hackathon/backend
npx prisma migrate dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Clerk for authentication services
- Next.js team for the frontend framework
- NestJS team for the backend framework
- All contributors and supporters of the project
