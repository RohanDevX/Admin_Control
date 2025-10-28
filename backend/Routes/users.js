// routes/users.js
const express  = require('express');
const bcrypt   = require('bcryptjs');
const db       = require('../Services/db');
const router   = express.Router();

// POST /api/v1/users
router.post('/', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const { rows:[u] } = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1,$2,$3) RETURNING id, name, email, created_at`,
      [name, email, hash]
    );
    res.status(201).json(u);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error:'Email exists' });
    next(e);
  }
});

module.exports = router;
