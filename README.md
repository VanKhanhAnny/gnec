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

### 3. AI Component (`gnec_hackathon/ai/`)
- Python-based sign language recognition
- Real-time video processing
- Machine learning models for ASL recognition
- Training and testing utilities

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- Docker (optional)
- PostgreSQL database
- Clerk account for authentication

## Getting Started

### Frontend Setup
```bash
cd gnec_frontend
npm install
# Create .env.local file with Clerk credentials
cp .env.example .env.local
# Edit .env.local with your Clerk keys
npm run dev
```

### Backend Setup
```bash
cd gnec_hackathon/backend
npm install
# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
npm run start:dev
```

### AI Component Setup
```bash
cd gnec_hackathon/ai
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Variables

### Frontend (.env.local)
```
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/gnec
CLERK_SECRET_KEY=your_secret_key
CLERK_PUBLISHABLE_KEY=your_publishable_key
```

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
