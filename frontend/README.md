# DevTrack Frontend

A modern Next.js frontend for the DevTrack problem-tracking application featuring a LeetCode-style interface, JWT authentication via Google OAuth, and dark/light mode support.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Backend running on `http://localhost:8080`

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-32-hex

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── auth/[...nextauth]/  # NextAuth configuration
│   ├── dashboard/
│   │   └── page.tsx              # Main LeetCode-style dashboard
│   ├── layout.tsx                # Root layout with NextAuth provider
│   ├── page.tsx                  # Home/login page
│   ├── globals.css               # Global styles
│   └── favicon.ico
│
├── components/
│   ├── Sidebar.tsx               # Collapsible GitHub-style sidebar
│   ├── ProblemDetail.tsx         # Problem modal with solve button
│   └── GoalDetail.tsx            # Goal modal
│
├── lib/
│   └── api.ts                    # Centralized API client with JWT injection
│
├── public/                        # Static assets
│
├── .env.local                     # Environment variables (not in git)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

## ✨ Features

### 🔐 Authentication
- **Google OAuth Integration** via NextAuth.js
- **JWT Sessions** — 24-hour expiration with secure cookies
- **Auto Redirect** — Unauthenticated users redirected to login

### 📋 Problem Management (Dashboard)
- **LeetCode-Style List View** — Problems displayed as rows with sortable columns
- **Problem Fields**:
  - Title
  - Difficulty (EASY / MEDIUM / HARD)
  - Topics (comma-separated tags)
  - Link (problem URL)
  - Notes (markdown-style)
  - List assignment
- **Quick Actions**:
  - ✅ Solve → Opens problem link in new tab
  - 📖 Open → Shows full details in modal
  - 🗑️ Delete → Remove problem

### 📚 List Management
- **Custom Lists** — Create, organize, and delete problem collections
- **Searchable Dropdown** — Find or create lists inline
- **Auto-Create** — Confirmation dialog to create non-existent lists
- **All Problems View** — Filter to see all problems across lists

### 🎯 Goal Tracking
- **Goal Creation** — Set learning goals with due dates
- **Status Tracking** — Mark goals as done/undone
- **Date Display** — Shows days remaining or completion date

### 🌙 Dark Mode
- **Theme Toggle** — Switch between light and dark modes
- **Persistent State** — Theme preference saved in localStorage
- **Tailwind CSS** — Fully themed components with dark: classes

### 📱 Responsive UI
- **Collapsible Sidebar** — Toggle between expanded (w-64) and compact (w-16) modes
- **Mobile Friendly** — Responsive grid and modal layouts
- **Tab Interface** — Switch between Problems and Goals tabs

---

## 🛠️ Development

### Build

```bash
npm run build
```

### Type Checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

---

## 🔌 API Integration

All API calls go through `lib/api.ts` which:
- Injects JWT token from session
- Handles authentication failures
- Formats requests/responses consistently

### Available API Methods

```typescript
// Problems
problemsApi.getAll()
problemsApi.create({ title, difficulty, topics, link, notes, listId })
problemsApi.delete(id)

// Lists
listsApi.getAll()
listsApi.create({ name })
listsApi.delete(id)

// Goals
goalsApi.getAll()
goalsApi.create({ title, dueDate })
goalsApi.delete(id)
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `next` | React framework |
| `react` | UI library |
| `typescript` | Type safety |
| `tailwindcss` | Styling |
| `next-auth` | Authentication |
| `next-auth/react` | NextAuth hooks |

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables
4. Deploy

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔐 Security

- **HTTP-Only Cookies** — JWT tokens stored securely
- **CORS** — Backend configured for frontend origin only
- **Environment Variables** — Sensitive data never committed
- **NextAuth Callbacks** — Custom authorization logic

---

## 🐛 Troubleshooting

### "Cannot reach backend"
- Verify backend is running on `:8080`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### "Authentication fails"
- Ensure Google OAuth credentials are correct
- Verify `NEXTAUTH_SECRET` is set and consistent
- Check NEXTAUTH_URL matches your domain

### "Data not loading"
- Check browser Network tab for failed requests
- Verify JWT token in cookies
- Check backend logs for errors

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
