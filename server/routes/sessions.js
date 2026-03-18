// ── sessions.js ──────────────────────────────────────────────
const express     = require('express');
const prisma      = require('../prisma/client');
const requireAuth = require('../middleware/auth');
const router      = express.Router();
router.use(requireAuth);

// GET /api/sessions — get all sessions (the weekly schedule template)
router.get('/', async (req, res) => {
  const sessions = await prisma.session.findMany({
    where:   { userId: req.userId },
    include: { subject: true },
    orderBy: [{ dayIndex: 'asc' }]
  });
  res.json(sessions);
});

// POST /api/sessions — add a session to the template
router.post('/', async (req, res) => {
  const { dayIndex, topic, duration, subjectId } = req.body;
  const session = await prisma.session.create({
    data: { dayIndex, topic, duration: duration||45, subjectId, userId: req.userId },
    include: { subject: true }
  });
  res.status(201).json(session);
});

// DELETE /api/sessions/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.session.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: 'Session not found' });
  }
});

module.exports = router;
