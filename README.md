# Study Planner

A full-stack web application for organising university study sessions. Track subjects, schedule weekly sessions, set exam countdowns, write notes, and view your progress over time.

**Live:** https://study-planner-production-fe91.up.railway.app

---

## Features

- **Authentication** — register and log in; all data is private per user
- **Daily Planner** — schedule study sessions per day, tick them as done, built-in Pomodoro timer
- **Weekly reset** — sessions reset automatically every Monday; past weeks are saved forever
- **Subjects & Topics** — add subjects with custom colours, track progress per topic
- **Exam countdowns** — colour-coded by urgency (red < 7 days, amber < 21, green otherwise)
- **Statistics** — week-by-week completion chart with expandable day breakdown
- **Study notes** — write and save notes per subject after each session

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Deployment | Railway |

---

## Running Locally

**Prerequisites:** Node.js (LTS) and a PostgreSQL database — [Supabase](https://supabase.com) free tier works.

```bash
# Clone and install
git clone https://github.com/Bektemis/study-planner.git
cd study-planner
npm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, DIRECT_URL, and JWT_SECRET in .env

# Create database tables
npm run db:migrate

# Start the server
npm run dev
```

Open http://localhost:3000

To generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Project Structure

```
study-planner/
├── client/
│   └── study_organizer_pro.html   # frontend — HTML, CSS, JS
├── server/
│   ├── index.js                   # Express entry point
│   ├── middleware/auth.js          # JWT verification
│   ├── prisma/schema.prisma        # database schema
│   └── routes/                    # auth, subjects, sessions, exams, notes, weeks
├── .env.example
└── package.json
```

---

## Useful Commands

```bash
npm run dev          # development server with auto-reload
npm run db:migrate   # apply schema changes to the database
npm run db:studio    # open Prisma Studio (visual database browser)
```
