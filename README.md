# DevTrack Lite

DevTrack Lite is a full-stack academic project for tracking DSA problems, custom lists, and learning goals in one place. The project combines application development with DevOps workflow using Spring Boot, Maven, Docker, GitHub Actions, and Docker Hub.

## Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.9+ or Maven Wrapper
- Docker and Docker Compose
- Supabase account for PostgreSQL

## Project Summary

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Spring Boot, Java 17, Maven
- Database: PostgreSQL via Supabase
- Authentication: NextAuth with Google OAuth and JWT-backed API access
- DevOps: Docker, GitHub Actions, Docker Hub

## Core Features

- Problem tracking with title, difficulty, link, and notes
- Custom problem list creation and organization
- Goal tracking with due dates and completion status
- Dashboard view for problems and goals
- Google login with protected create/delete operations
- Backend containerization with Docker
- CI/CD workflow for backend build and Docker image publishing

## Selected Tool Combination

`Docker + Maven + GitHub Actions + Docker Hub`

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Spring Boot, Spring Security, Spring Data JPA, Maven |
| Database | PostgreSQL, Supabase |
| Auth | NextAuth, Google OAuth, JWT |
| DevOps | Docker, Docker Compose, GitHub Actions, Docker Hub |

## Project Structure

```text
DevTrack/
├── .github/
│   └── workflows/
│       └── backend-docker.yml
├── backend/
│   ├── src/main/java/backend/
│   ├── src/main/resources/
│   ├── src/test/
│   ├── Dockerfile
│   └── pom.xml
├── docs/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── screenshot/
├── docker-compose.yml
└── README.md
```

## Modules

### Authentication Module

Google OAuth login is handled through NextAuth. Protected backend operations rely on JWT-bearing requests.

### DSA Problem Tracker Module

Users can add and manage coding problems with difficulty, notes, links, and list assignment.

### Problem List Management Module

Problems can be grouped into custom lists for better organization and filtering.

### Goal Tracker Module

Users can create learning goals, assign due dates, and mark them as completed.

### Dashboard Module

The dashboard acts as the central workspace for viewing problems, lists, and goals together.

### DevOps Module

Maven handles backend build/test automation, Docker handles backend containerization, and GitHub Actions automates Docker image publishing.

## System Architecture

```text
User
  |
  v
Next.js Frontend
  |
  v
Spring Boot Backend
  |
  v
PostgreSQL / Supabase
```

## CI/CD Workflow

The repository includes a backend CI/CD workflow in `.github/workflows/backend-docker.yml`.

```text
Developer Push
      |
      v
GitHub Actions Workflow
      |
      v
Maven Test
      |
      v
Maven Package
      |
      v
Docker Image Build
      |
      v
Push to Docker Hub
```

Current workflow behavior:

- triggers on push to `main` or `master`
- runs backend tests with Maven
- packages the backend JAR
- builds the backend Docker image
- pushes image tags to Docker Hub

## Authentication Flow

1. User signs in with Google OAuth through NextAuth.
2. NextAuth creates a session and stores the Google ID token.
3. Frontend API requests send the token as a bearer token.
4. Spring Boot validates the token through the JWT filter.
5. Protected create/delete operations require authentication.

## Environment Configuration

### Backend

Create `backend/.env`:

```env
DB_URL=jdbc:postgresql://your-supabase-host:6543/postgres?prepareThreshold=0
DB_USERNAME=postgres.your-project-id
DB_PASSWORD=your-supabase-password
DB_DRIVER=org.postgresql.Driver
```

You can use [backend/.env.example](/home/anuj308/Desktop/study/DevTrack/backend/.env.example) as a reference.

### Frontend

Create `frontend/.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Run Locally

### Backend

```bash
cd backend
./mvnw test
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Docker Usage

Create a root `.env` file:

```env
DB_URL=jdbc:postgresql://your-supabase-host:6543/postgres?prepareThreshold=0
DB_USERNAME=postgres.your-project-id
DB_PASSWORD=your-supabase-password
```

Run the backend container:

```bash
docker compose up --build
```

### Manual Docker Build and Run

Build the backend image manually:

```bash
cd backend
docker build -t devtrack-backend:local .
```

Run the backend container manually:

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

### Manual Docker Hub Push

```bash
docker login
docker tag devtrack-backend:local <dockerhub-username>/devtrack-backend:latest
docker push <dockerhub-username>/devtrack-backend:latest
```

## Build and Verification Commands

### Backend

```bash
cd backend
./mvnw test
./mvnw clean package -DskipTests
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

### Manual Docker Build

```bash
cd backend
docker build -t devtrack-backend:local .
```

## Deployment Notes

### Backend

- Build and publish the backend image through GitHub Actions
- Pull the latest image from Docker Hub on the target machine
- Run the backend container with the required database environment variables

### Frontend

- Frontend can be deployed separately on Vercel
- Set `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, Google OAuth credentials, and `NEXT_PUBLIC_API_URL`

## API Overview

### Problems

- `GET /api/problems`
- `POST /api/problems`
- `GET /api/problems/{id}`
- `DELETE /api/problems/{id}`

### Lists

- `GET /api/lists`
- `POST /api/lists`
- `GET /api/lists/{id}`

### Goals

- `GET /api/goals`
- `POST /api/goals`
- `GET /api/goals/{id}`
- `DELETE /api/goals/{id}`
- `PATCH /api/goals/{id}/complete`

## Database Schema

### problems

```sql
id              BIGSERIAL PRIMARY KEY
title           VARCHAR(255) NOT NULL
difficulty      VARCHAR(50)
topics          VARCHAR(500)
link            TEXT
notes           TEXT
list_id         BIGINT REFERENCES problem_lists(id)
solved_at       TIMESTAMP
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### problem_lists

```sql
id              BIGSERIAL PRIMARY KEY
name            VARCHAR(255) UNIQUE NOT NULL
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### goals

```sql
id              BIGSERIAL PRIMARY KEY
title           VARCHAR(255) NOT NULL
completed       BOOLEAN DEFAULT FALSE
due_date        TIMESTAMP
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## Screenshots

Project screenshots are stored in the [`screenshot/`](/home/anuj308/Desktop/study/DevTrack/screenshot) folder, including:

- login page
- add problem screen
- add goal screen
- list creation
- backend structure
- Maven output
- Docker build and container output
- GitHub Actions success
- Docker Hub push result
- architecture and CI/CD diagrams

## Troubleshooting

### Backend does not start

- verify `backend/.env`
- check database host, username, and password
- make sure Java 17 is installed

### Frontend cannot reach backend

- confirm backend is running on port `8080`
- verify `NEXT_PUBLIC_API_URL`
- check CORS and auth environment values

### Docker issues

- confirm Docker daemon is running
- rebuild image with `docker compose up --build`
- verify database environment variables are passed correctly

## Repository Notes

This repository is organized to support both application development and academic evaluation:

- source code for frontend and backend
- Docker and CI/CD configuration
- README-based setup instructions
- `screenshot/` assets for report and implementation evidence

## Author

- Name: Anuj Kumar Sharma
- Registration No.: 12305174
- Section: 20M60 - INT332
