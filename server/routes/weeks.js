const express     = require('express');
const prisma      = require('../prisma/client');
const requireAuth = require('../middleware/auth');
const router      = express.Router();
router.use(requireAuth);

// GET /api/weeks — get all weeks for the user (for Statistics page)
router.get('/', async (req, res) => {
  const weeks = await prisma.week.findMany({
    where:   { userId: req.userId },
    orderBy: { weekKey: 'asc' }
  });
  res.json(weeks);
});

// GET /api/weeks/:weekKey — get a specific week (e.g. "2025-03-17")
router.get('/:weekKey', async (req, res) => {
  const week = await prisma.week.findUnique({
    where: { userId_weekKey: { userId: req.userId, weekKey: req.params.weekKey } }
  });
  // Return empty completions if week doesn't exist yet — not an error
  res.json(week || { weekKey: req.params.weekKey, completions: {} });
});

// PUT /api/weeks/:weekKey — upsert (create or update) completions for a week
// Body: { completions: { "sessionId": true, ... } }
router.put('/:weekKey', async (req, res) => {
  const { completions } = req.body;
  const week = await prisma.week.upsert({
    where:  { userId_weekKey: { userId: req.userId, weekKey: req.params.weekKey } },
    create: { weekKey: req.params.weekKey, userId: req.userId, completions },
    update: { completions }
  });
  res.json(week);
});

module.exports = router;
