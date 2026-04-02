const router = require('express').Router();
const { calculateSegmentRisk } = require('../services/riskEngine');

router.post('/segment', (req, res) => {
  try {
    const result = calculateSegmentRisk(req.body || {});
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Could not calculate risk' });
  }
});

module.exports = router;