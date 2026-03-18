const express     = require('express');
const prisma      = require('../prisma/client');
const requireAuth = require('../middleware/auth');
const router      = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const exams = await prisma.exam.findMany({
    where:   { userId: req.userId },
    include: { subject: true },
    orderBy: { date: 'asc' }
  });
  res.json(exams);
});

router.post('/', async (req, res) => {
  const { name, date, preparation, subjectId } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'Name and date required' });
  const exam = await prisma.exam.create({
    data: { name, date, preparation: preparation||0, subjectId, userId: req.userId },
    include: { subject: true }
  });
  res.status(201).json(exam);
});

router.put('/:id', async (req, res) => {
  const { name, date, preparation, subjectId } = req.body;
  try {
    const exam = await prisma.exam.update({
      where: { id: req.params.id },
      data:  { name, date, preparation, subjectId },
      include: { subject: true }
    });
    res.json(exam);
  } catch {
    res.status(404).json({ error: 'Exam not found' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.exam.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: 'Exam not found' });
  }
});

module.exports = router;
