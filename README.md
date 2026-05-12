# DevTrack - Full Stack Application

A modern full-stack application for tracking coding problems and learning goals. Built with **Next.js** (frontend), **Spring Boot** (backend), and **PostgreSQL** (database).

---

## 🚀 Project Structure

```
DevTrack/
├── frontend/          # Next.js React app
├── backend/          # Spring Boot REST API
└── README.md
```

---

## 📋 Prerequisites

- **Node.js 18+**
- **Java 17+**
- **Maven** (via ./mvnw)

---

## 🔧 Setup & Installation

### 1. Backend Setup

#### Step 1: Environment Variables
Create a `backend/.env` file with the following:
```env
DB_URL=jdbc:postgresql://your-db-host:port/database
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

#### Step 2: Run the Application
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

**Backend runs on:** `http://localhost:8080`

---

### 2. Frontend Setup

#### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

#### Step 2: Configure Environment Variables
Create a `frontend/.env.local`:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

#### Step 3: Run Development Server
```bash
npm run dev
```

**Frontend runs on:** `http://localhost:3000`

---

## 🌐 API Endpoints

- `GET /api/problems` — List all problems
- `POST /api/problems` — Create a problem
- `GET /api/goals` — List all goals
- `POST /api/goals` — Create a goal
- `GET /api/users` — List all users

---

## 🛠️ Development Workflow

### Terminal 1: Backend
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

---

## 📝 License

MIT License
