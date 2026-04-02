const router = require('express').Router();
const { pool } = require('../db/client');

router.get('/latest', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, raster_name, layer_type, srid, path, width, height, stats, created_at
      FROM terrain_layers
      ORDER BY created_at DESC
      LIMIT 50
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not fetch terrain layers' });
  }
});

module.exports = router;