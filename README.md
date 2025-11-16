# Tunisia Real Estate Platform

A full-stack real estate platform for buying, selling, and renting properties in Tunisia.

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Hono + Bun
- **Database**: MySQL + Prisma ORM
- **Authentication**: JWT
- **Containerization**: Docker + Docker Compose

## 📋 Prerequisites

- Node.js 18+ (for frontend)
- Bun 1.0+ (for backend)
- Docker & Docker Compose
- Git

## 🛠️ Setup Instructions

### Option 1: Docker (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd tunisia-real-estate-platform

# Start all services
npm run docker:dev

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Database: localhost:3306
```

### Option 2: Local Development
```bash
# Install dependencies
npm run setup

# Start database
docker-compose up mysql -d

# Start backend (in one terminal)
cd backend
bun install
bunx prisma migrate dev
bunx prisma db seed
bun run dev

# Start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## 📁 Project Structure
```
tunisia-real-estate-platform/
├── frontend/          # React frontend
├── backend/           # Hono API backend
├── docker-compose.yml # Production Docker config
└── docker-compose.dev.yml # Development Docker config
```

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql://appuser:apppassword@localhost:3306/tunisia_real_estate
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📝 Available Scripts
```bash
npm run docker:dev          # Start development environment
npm run docker:prod         # Start production environment
npm run docker:clean        # Clean all containers and volumes
npm run db:only             # Run only database
```

## 🧪 Testing
```bash
# Test backend
cd backend
bun run test-auth.ts

# Test API manually
curl http://localhost:3000/health
```

## 👥 User Roles

- **Admin**: Full access to all features
- **Homeowner**: Can list and manage properties
- **Buyer**: Can search and buy properties
- **Renter**: Can search and rent properties

## 🚧 Development Status

- [x] Authentication system
- [x] Database schema
- [x] Docker setup
- [ ] Property management
- [ ] Google Maps integration
- [ ] Payment system
- [ ] Chatbot

## 📄 License

MIT License