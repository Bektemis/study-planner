const express     = require('express');
const prisma      = require('../prisma/client');
const requireAuth = require('../middleware/auth');
const router      = express.Router();

// All routes below require a valid JWT
router.use(requireAuth);

// GET /api/subjects — get all subjects (with topics) for the logged-in user
router.get('/', async (req, res) => {
  const subjects = await prisma.subject.findMany({
    where:   { userId: req.userId },
    include: { topics: true },
    orderBy: { name: 'asc' }
  });
  res.json(subjects);
});

// POST /api/subjects — create a new subject
router.post('/', async (req, res) => {
  const { name, color, bg } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const subject = await prisma.subject.create({
    data: { name, color: color||'#333', bg: bg||'#eee', userId: req.userId }
  });
  res.status(201).json(subject);
});

// PUT /api/subjects/:id — update a subject
router.put('/:id', async (req, res) => {
  const { name, color, bg } = req.body;
  try {
    const subject = await prisma.subject.update({
      where: { id: req.params.id },
      data:  { name, color, bg }
    });
    res.json(subject);
  } catch {
    res.status(404).json({ error: 'Subject not found' });
  }
});

// DELETE /api/subjects/:id — delete a subject (cascades to topics, sessions, etc.)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.subject.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: 'Subject not found' });
  }
});

// PUT /api/subjects/:id/topics — replace all topics for a subject
router.put('/:id/topics', async (req, res) => {
  const { topics } = req.body; // [{ name, pct }]
  await prisma.topic.deleteMany({ where: { subjectId: req.params.id } });
  const created = await prisma.topic.createMany({
    data: topics.map(t => ({ name: t.name, pct: t.pct||0, subjectId: req.params.id }))
  });
  res.json({ created: created.count });
});

module.exports = router;
