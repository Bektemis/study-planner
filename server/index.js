require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes     = require('./routes/auth');
const subjectRoutes  = require('./routes/subjects');
const sessionRoutes  = require('./routes/sessions');
const examRoutes     = require('./routes/exams');
const noteRoutes     = require('./routes/notes');
const weekRoutes     = require('./routes/weeks');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

// ── Serve the frontend HTML file ──
// Put your study_organizer_pro.html in the /client folder
app.use(express.static(path.join(__dirname, '../client')));

// ── API routes ──
app.use('/api/auth',     authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/exams',    examRoutes);
app.use('/api/notes',    noteRoutes);
app.use('/api/weeks',    weekRoutes);

// ── Fallback: serve index.html for any non-API route ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/study_organizer_pro.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
