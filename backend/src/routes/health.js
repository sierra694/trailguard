const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ ok: true, service: 'trailguard-backend' });
});

module.exports = router;