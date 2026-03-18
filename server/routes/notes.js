const express     = require('express');
const prisma      = require('../prisma/client');
const requireAuth = require('../middleware/auth');
const router      = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const notes = await prisma.note.findMany({
    where:   { userId: req.userId },
    include: { subject: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(notes);
});

router.post('/', async (req, res) => {
  const { text, subjectId } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const note = await prisma.note.create({
    data: { text, subjectId, userId: req.userId },
    include: { subject: true }
  });
  res.status(201).json(note);
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.note.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: 'Note not found' });
  }
});

module.exports = router;
