# Study Planner — Full Stack Web App

ICT & Internet Engineering study planner with a Node.js/Express backend,
PostgreSQL database, and JWT authentication.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | HTML + CSS + Vanilla JS             |
| Backend  | Node.js + Express                   |
| Database | PostgreSQL via Prisma ORM           |
| Auth     | JWT (JSON Web Tokens) + bcrypt      |
| Hosting  | Vercel (frontend) + Railway (backend)|

---

## Project Structure

```
study-planner/
├── client/
│   └── study_organizer_pro.html   ← your frontend file goes here
├── server/
│   ├── index.js                   ← Express app entry point
│   ├── middleware/
│   │   └── auth.js                ← JWT verification
│   ├── prisma/
│   │   ├── schema.prisma          ← database schema
│   │   └── client.js              ← Prisma singleton
│   └── routes/
│       ├── auth.js                ← POST /api/auth/register & /login
│       ├── subjects.js            ← CRUD /api/subjects
│       ├── sessions.js            ← CRUD /api/sessions
│       ├── exams.js               ← CRUD /api/exams
│       ├── notes.js               ← CRUD /api/notes
│       └── weeks.js               ← GET/PUT /api/weeks/:weekKey
├── .env.example
├── .gitignore
└── package.json
```

---

## Local Setup — Step by Step

### 1. Install Node.js
Download from https://nodejs.org — install the LTS version.
Verify: open a terminal and run `node -v` and `npm -v`.

### 2. Get a free PostgreSQL database
Go to https://railway.app → sign up → New Project → PostgreSQL.
Once created, click the database → "Connect" tab → copy the
**DATABASE_URL** (it looks like `postgresql://postgres:...@...railway.app:PORT/railway`).

### 3. Clone / open the project in VS Code
If you haven't already, open the `study-planner` folder in VS Code.

### 4. Install dependencies
Open the VS Code terminal (Ctrl+`) and run:
```bash
npm install
```

### 5. Set up your environment variables
```bash
cp .env.example .env
```
Then open `.env` and fill in:
- `DATABASE_URL` — paste the Railway URL from step 2
- `JWT_SECRET` — generate one by running:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
  Copy the output and paste it as the value.

### 6. Run the database migration
This creates all the tables in your PostgreSQL database:
```bash
npm run db:migrate
```
When prompted for a migration name, type something like `init`.

### 7. Move your HTML file
Copy `study_organizer_pro.html` into the `client/` folder.

### 8. Start the development server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

---

## Connecting the Frontend to the Backend

Right now the HTML file still uses localStorage. To connect it to the API:

1. Add a login/register form to the HTML
2. On login, call `POST /api/auth/login` and store the returned `token`
   in `localStorage` (just the token, not all the data)
3. Replace every `localStorage` read/write with `fetch()` calls to the API,
   adding the header: `Authorization: Bearer <token>`

Example — loading subjects:
```js
const token = localStorage.getItem('token');
const res   = await fetch('/api/subjects', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const subjects = await res.json();
```

Example — saving a note:
```js
await fetch('/api/notes', {
  method:  'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body:    JSON.stringify({ text: 'Today I studied...', subjectId: 'abc123' })
});
```

---

## API Reference

### Auth
| Method | Endpoint             | Body                    | Returns          |
|--------|----------------------|-------------------------|------------------|
| POST   | /api/auth/register   | { email, password }     | { token, userId }|
| POST   | /api/auth/login      | { email, password }     | { token, userId }|

### Subjects
| Method | Endpoint                    | Body / Notes              |
|--------|-----------------------------|---------------------------|
| GET    | /api/subjects               | Returns all with topics   |
| POST   | /api/subjects               | { name, color, bg }       |
| PUT    | /api/subjects/:id           | { name, color, bg }       |
| DELETE | /api/subjects/:id           | Cascades to topics etc.   |
| PUT    | /api/subjects/:id/topics    | { topics: [{name, pct}] } |

### Sessions (weekly schedule template)
| Method | Endpoint          | Body                                    |
|--------|-------------------|-----------------------------------------|
| GET    | /api/sessions     | Returns all sessions with subject info  |
| POST   | /api/sessions     | { dayIndex, topic, duration, subjectId }|
| DELETE | /api/sessions/:id |                                         |

### Exams
| Method | Endpoint       | Body                                       |
|--------|----------------|--------------------------------------------|
| GET    | /api/exams     |                                            |
| POST   | /api/exams     | { name, date, preparation, subjectId }     |
| PUT    | /api/exams/:id | { name, date, preparation, subjectId }     |
| DELETE | /api/exams/:id |                                            |

### Notes
| Method | Endpoint        | Body                   |
|--------|-----------------|------------------------|
| GET    | /api/notes      |                        |
| POST   | /api/notes      | { text, subjectId }    |
| DELETE | /api/notes/:id  |                        |

### Weeks (completion tracking)
| Method | Endpoint              | Body / Notes                              |
|--------|-----------------------|-------------------------------------------|
| GET    | /api/weeks            | All weeks (for Statistics page)           |
| GET    | /api/weeks/:weekKey   | Single week, e.g. /api/weeks/2025-03-17  |
| PUT    | /api/weeks/:weekKey   | { completions: { sessionId: true, ... } } |

All routes except `/api/auth/*` require the header:
`Authorization: Bearer <your_token>`

---

## Deploying Online (free)

### Backend → Railway
1. Push your code to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Select your repo → Railway auto-detects Node.js
4. Add your environment variables in the Railway dashboard
5. Railway gives you a public URL like `https://study-planner.up.railway.app`

### Frontend → Vercel
1. Go to https://vercel.com → New Project → import your GitHub repo
2. Set the output directory to `client`
3. Vercel gives you a public URL like `https://study-planner.vercel.app`
4. Update `CLIENT_URL` in your Railway environment variables to this URL

---

## Useful Commands

```bash
npm run dev          # Start dev server with auto-reload
npm run db:migrate   # Apply schema changes to the database
npm run db:studio    # Open Prisma Studio (visual database browser)
```
