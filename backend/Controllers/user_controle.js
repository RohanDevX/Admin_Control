// src/controllers/users.js
import { query } from '../db/index.js';
import bcrypt from 'bcryptjs';

/* POST /api/v1/users   { name, email, password } */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1) hash the password
    const pwHash = await bcrypt.hash(password, 12);

    // 2) insert & return the new user (excluding hash!)
    const {
      rows: [user],
    } = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, pwHash]
    );

    res.status(201).json(user);
  } catch (err) {
    // duplicate-email guard
    if (err.code === '23505') return res.status(409).json({ error: 'Email exists' });
    next(err);
  }
};

/* GET /api/v1/users */
export const listUsers = async (_req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
