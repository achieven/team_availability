# Team Availability Management System

A full-stack application for managing team member availability status with real-time updates.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **React Hook Form** - Form handling

### Backend
- **NestJS** - Node.js framework
- **Couchbase** - NoSQL database
- **Redis** - Session storage
- **JWT** - Authentication
- **Passport** - Authentication strategies
- **TypeScript** - Type safety

## Features

- User authentication (login/logout)
- Real-time status updates
- Session management with Redis
- Responsive UI with Tailwind CSS
- Type-safe development with TypeScript

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Couchbase (running on localhost:8091)
- Redis (running on localhost:6379)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd team-availability
```

2. Install dependencies for both frontend and backend:
```bash
npm run install:all
```

## Environment Setup

### Frontend Environment
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend Environment
Create a `.env` file in the `backend` directory:
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key
COUCHBASE_URL=couchbase://localhost
COUCHBASE_USERNAME=Administrator
COUCHBASE_PASSWORD=password
COUCHBASE_BUCKET=team_availability
COUCHBASE_SCOPE=_default
COUCHBASE_COLLECTION=_default
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
```

## Running the Application

### Development Mode
Run both frontend and backend simultaneously:
```bash
npm run dev
```

Or run them separately:

**Frontend:**
```bash
npm run dev:frontend
```

**Backend:**
```bash
npm run dev:backend
```

### Production Mode
Build and start the application:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Status Management
- `GET /api/status/current` - Get current user status
- `PUT /api/status/update` - Update user status
- `GET /api/status/all` - Get all users' statuses
- `GET /api/status/user` - Get user's status history

## Database Setup

### Couchbase
1. Install and start Couchbase Server
2. Create a bucket named `team_availability`
3. The application will automatically create the necessary indexes
4. Access Couchbase Web Console at http://localhost:8091

### Redis
1. Install and start Redis
2. The application will automatically connect to Redis for session storage

## Project Structure

```
team-availability/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js App Router
│   │   ├── login/          # Login page
│   │   ├── status/         # Status update page
│   │   └── ...
│   ├── store/              # Redux store and slices
│   └── ...
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── status/         # Status management module
│   │   ├── database/       # Database service
│   │   └── ...
│   └── ...
└── package.json            # Root package.json for workspaces
```

## Development

### Adding New Features
1. Create new modules in the backend following NestJS conventions
2. Add corresponding Redux slices in the frontend
3. Create new pages/components in the frontend
4. Update API endpoints and documentation

### Testing
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## Deployment

### Frontend Deployment
The frontend can be deployed to Vercel, Netlify, or any static hosting service.

### Backend Deployment
The backend can be deployed to:
- Heroku
- AWS
- Google Cloud Platform
- DigitalOcean

Make sure to set up the environment variables and database connections accordingly.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## TODO:
- grey on vacation
- Hello Mr <lastname> instead of username
- ottomanjs
- flickering FE
- cleaner FE code

## License

This project is licensed under the MIT License.
