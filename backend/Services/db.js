// services/db.js
const { Pool } = require('pg');
require('dotenv').config();               // ← loads DATABASE_URL from .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false }   // keep OFF locally, ON in prod clouds
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
