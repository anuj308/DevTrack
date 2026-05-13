# DevTrack - Full Stack Application

A modern full-stack application for tracking coding problems and learning goals with a **LeetCode-style** interface. Built with **Next.js** (frontend), **Spring Boot** (backend), and **PostgreSQL via Supabase** (database).

### ✨ Features
- 🔐 **JWT Authentication** with Google OAuth (NextAuth.js)
- 📋 **Problem Management** — Create, edit, delete coding problems with links, notes, and difficulty levels
- 📚 **List-Based Organization** — Organize problems into custom lists
- 🎯 **Goal Tracking** — Set and track learning goals with due dates
- 🌙 **Dark/Light Mode** — Toggle between themes
- 📱 **Collapsible Sidebar** — GitHub-style navigation with compact mode
- 🔗 **Direct Problem Links** — One-click solve button to open problem URLs
- 🔍 **Searchable Lists** — Inline list creation and search

---

## 📋 Prerequisites

- **Node.js 18+**
- **Java 17+**
- **Maven 3.9+** (project also includes Maven Wrapper)
- **Docker** and **Docker Compose**
- **Supabase Account** (Free tier available at supabase.com)

---

## 🔧 Setup & Installation

### 1. Backend Setup

#### Step 1: Configure Supabase Connection
Create/update `backend/.env`:
```env
DB_URL=jdbc:postgresql://your-supabase-host:6543/postgres?prepareThreshold=0
DB_USERNAME=postgres.your-project-id
DB_PASSWORD=your-supabase-password
DB_DRIVER=org.postgresql.Driver
```

**Get these from Supabase:**
- Project Settings → Database → Connection String (URI)
- Copy the host, port, user, and password

#### Step 2: Build and Run Backend
Build and run using Maven (system `mvn`):
```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

Run backend tests locally:
```bash
cd backend
mvn test
```

Or build and run the generated jar:
```bash
cd backend
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
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
Create `frontend/.env.local`:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-32-hex

# Google OAuth (from Google Cloud Console)
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

### Problems
- `GET /api/problems` — List all problems (with optional listId filter)
- `POST /api/problems` — Create a problem (with link, notes, listId)
- `GET /api/problems/{id}` — Get single problem
- `DELETE /api/problems/{id}` — Delete problem

### Lists
- `GET /api/lists` — List all problem collections
- `POST /api/lists` — Create a new list
- `GET /api/lists/{id}` — Get single list
- `DELETE /api/lists/{id}` — Delete list

### Goals
- `GET /api/goals` — List all goals
- `POST /api/goals` — Create a goal
- `DELETE /api/goals/{id}` — Delete goal

---

## 🛠️ Development Workflow

### Terminal 1: Backend
```bash
cd backend
mvn spring-boot:run
# Backend starts on :8080 connected to Supabase
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# Frontend starts on :3000
```

### Terminal 3: Database (Optional)
Monitor Supabase dashboard at: https://app.supabase.com

---

## 📦 Project Structure

```
DevTrack/
├── backend/
│   ├── src/main/java/backend/
│   │   ├── controller/         # REST endpoints
│   │   ├── entity/             # JPA entities (Problem, Goal, ProblemList)
│   │   ├── repository/         # Spring Data repositories
│   │   ├── util/               # JWT utilities
│   │   ├── security/           # Security config
│   │   ├── filter/             # JWT authentication filter
│   │   └── BackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── .env                    # Database credentials
│   └── pom.xml
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Main dashboard with LeetCode-style list
│   │   ├── layout.tsx          # Root layout with NextAuth
│   │   ├── page.tsx            # Home/login page
│   │   └── globals.css
│   ├── components/
│   │   ├── Sidebar.tsx         # Collapsible navigation
│   │   ├── ProblemDetail.tsx   # Problem modal
│   │   └── GoalDetail.tsx      # Goal modal
│   ├── lib/
│   │   └── api.ts              # Centralized API layer with JWT
│   ├── .env.local              # Next.js & OAuth config
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication Flow

1. User clicks "Sign in with Google"
2. NextAuth redirects to Google OAuth consent screen
3. Google returns ID token to NextAuth
4. NextAuth creates JWT session (24-hour expiration)
5. Frontend stores JWT in secure HTTP-only cookie
6. All API calls include JWT in `Authorization: Bearer <token>` header
7. Backend Spring Security validates JWT via JwtAuthenticationFilter
8. Endpoints return user context for filtering data

---

## 🗄️ Database Schema

### `problems` Table
```sql
id              BIGSERIAL PRIMARY KEY
title           VARCHAR(255) NOT NULL
difficulty      VARCHAR(50)  -- EASY, MEDIUM, HARD
topics          VARCHAR(500)
link            TEXT         -- Problem URL
notes           TEXT         -- User notes (CLOB)
list_id         BIGINT REFERENCES problem_lists(id)
solved_at       TIMESTAMP
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### `problem_lists` Table
```sql
id              BIGSERIAL PRIMARY KEY
name            VARCHAR(255) UNIQUE NOT NULL
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### `goals` Table
```sql
id              BIGSERIAL PRIMARY KEY
title           VARCHAR(255) NOT NULL
completed       BOOLEAN DEFAULT FALSE
due_date        TIMESTAMP
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect Render/Railway to GitHub repo
3. Set environment variables (DB_URL, DB_USERNAME, DB_PASSWORD)
4. Deploy `backend` service → Spring Boot starts on port 8080

### Frontend (Vercel)
1. Push code to GitHub
2. Import frontend folder in Vercel
3. Set environment variables (.env.local values)
4. Deploy → Next.js builds and deploys

---

## ⚙️ Manual Commands

### Local Manual Run (Maven + Next.js)

Backend (Maven only):
```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Local Production Build Checks

Backend:
```bash
cd backend
mvn clean package -DskipTests
```

Frontend:
```bash
cd frontend
npm run build
```

### Manual Docker Build and Run (Backend)

Build image from Dockerfile:
```bash
cd backend
docker build -t devtrack-backend:local .
```

Run container manually:
```bash
docker run -d \
	--name devtrack-backend \
	-p 8080:8080 \
	-e DB_URL="jdbc:postgresql://your-supabase-host:6543/postgres?prepareThreshold=0" \
	-e DB_USERNAME="postgres.your-project-id" \
	-e DB_PASSWORD="your-supabase-password" \
	-e DB_DRIVER="org.postgresql.Driver" \
	--restart unless-stopped \
	devtrack-backend:local
```

### Manual Docker Hub Push (Without GitHub Actions)

```bash
docker login
docker tag devtrack-backend:local <dockerhub-username>/devtrack-backend:latest
docker push <dockerhub-username>/devtrack-backend:latest
```

### Manual EC2 Update Commands

```bash
docker pull <dockerhub-username>/devtrack-backend:latest
docker stop devtrack-backend || true
docker rm devtrack-backend || true
docker run -d \
	--name devtrack-backend \
	-p 8080:8080 \
	-e DB_URL="..." \
	-e DB_USERNAME="..." \
	-e DB_PASSWORD="..." \
	-e DB_DRIVER="org.postgresql.Driver" \
	--restart unless-stopped \
	<dockerhub-username>/devtrack-backend:latest
```

---

## 🐳 Docker

### Backend-only Docker (Frontend stays on Vercel)
Create a root `.env` file with backend environment variables:
```env
DB_URL=jdbc:postgresql://your-supabase-host:6543/postgres?prepareThreshold=0
DB_USERNAME=postgres.your-project-id
DB_PASSWORD=your-supabase-password
```

Run backend service:
```bash
docker compose up --build
```

Services:

- Backend: `http://localhost:8080`

---

## 🤖 GitHub Actions

Docker publish workflow is defined in `.github/workflows/backend-docker.yml`:
- Trigger: push to `main`/`master` when backend changes
- Runs backend tests with `./mvnw -B test`
- Builds backend jar with Maven wrapper
- Builds Docker image from `backend/Dockerfile`
- Pushes to Docker Hub: `<DOCKERHUB_USERNAME>/devtrack-backend:latest` and `:sha-*`

Required GitHub Secrets for Docker publish:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

You can see workflow runs in the GitHub repository Actions tab.

---

## 🚦 Recommended Release Flow

1. Push code to GitHub (`main`/`master`).
2. GitHub Actions `Backend Docker Publish` builds and pushes backend Docker image to Docker Hub.
3. On EC2, pull latest backend image and restart container.
4. Frontend remains deployed on Vercel (no frontend container on EC2).

EC2 update commands are listed above in **Manual EC2 Update Commands**.

---

## 🐛 Troubleshooting

### Backend won't start
- Verify Supabase connection string in `.env`
- Check if PostgreSQL is accessible (ping host)
- Ensure Java 17+ is installed

### Frontend can't reach backend
- Verify backend is running on `:8080`
- Check CORS is enabled (should be by default)
- Ensure `NEXT_PUBLIC_API_URL` in `.env.local` matches

### Database errors
- Run `mvn clean` and rebuild
- Verify `prepareThreshold=0` in DB_URL (disables prepared statements)

### Backend tests fail in CI
- Run `cd backend && mvn test` locally
- The test profile uses H2 in-memory instead of Supabase

---

## 📚 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Auth | NextAuth.js v4 (JWT sessions) |
| Backend | Spring Boot 3.2, Spring Security 6, Spring Data JPA |
| Database | PostgreSQL (Supabase) |
| ORM | Hibernate 7 |
| JWT | JJWT 0.12.3 |

---

## 📝 License

MIT
