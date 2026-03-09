# CAP Business Pro Digital Platform

Centralized digital learning platform for Nigerian painters and contractors — powered by the CAP Business Pro Workshop ecosystem.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript (Vite) |
| Styling | Tailwind CSS v4 |
| Backend | Node.js + Express (TypeScript) |
| Database & Auth | Supabase |
| Payments | Monnify |
| Notifications | Nodemailer |

## Project Structure

```
├── frontend/                  # Vite + React + TypeScript
│   └── src/
│       ├── components/        # Reusable UI components
│       │   └── navigation/    # Sidebar, Header, AdminSidebar
│       ├── hooks/             # Custom React hooks (useAuth, etc.)
│       ├── layouts/           # AuthLayout, DashboardLayout, AdminLayout
│       ├── lib/               # Supabase client, Axios instance
│       ├── pages/
│       │   ├── admin/         # Admin dashboard pages
│       │   ├── auth/          # Login, Register, ForgotPassword
│       │   └── dashboard/     # User dashboard pages
│       ├── services/          # API service modules
│       ├── types/             # TypeScript type definitions
│       └── utils/             # Formatters, constants
│
├── backend/                   # Node.js + Express (TypeScript)
│   └── src/
│       ├── config/            # Supabase, app config
│       ├── controllers/       # Business logic handlers
│       ├── middleware/        # Auth, upload middleware
│       ├── routes/            # API route definitions
│       └── utils/             # Email utility
│
├── .env.example               # Environment variable template
└── .gitignore
```

## Getting Started

### 1. Clone & Install
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in your Supabase, Monnify, and email credentials
```

### 3. Run Development Servers
```bash
# Frontend (port 3000)
cd frontend && npm run dev

# Backend (port 5000)
cd backend && npm run dev
```

## Subscription Tiers

| Tier | Access |
|------|--------|
| **PRO** | Standard workshop video content |
| **ELITE** | Premium training + advanced content |
