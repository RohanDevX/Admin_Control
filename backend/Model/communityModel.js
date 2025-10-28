// models/communityModel.js
const db = require('../Services/db');

/* ───────── helpers ───────────────────────── */

const COLUMNS = `
  id, name, category, contact, address, email,
  social_links, logo, description, created_at,
  sub_category, image, in_charge
`;

/* ───────── CRUD ──────────────────────────── */

exports.findAll = async () => {
  const { rows } = await db.query(`SELECT ${COLUMNS} FROM community ORDER BY created_at DESC`);
  return rows;
};

exports.findById = async (id) => {
  const { rows: [row] } = await db.query(`SELECT ${COLUMNS} FROM community WHERE id = $1`, [id]);
  return row;
};

exports.create = async (payload) => {
  const {
    name, category, contact, address, email,
    social_links, logo, description, sub_category,
    image, in_charge
  } = payload;

  const { rows: [row] } = await db.query(
    `INSERT INTO community
       (name, category, contact, address, email,
        social_links, logo, description,
        sub_category, image, in_charge)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING ${COLUMNS}`,
    [
      name, category, contact, address, email,
      social_links, logo, description, sub_category,
      image, in_charge
    ]
  );

  return row;
};

exports.update = async (id, payload) => {
  const {
    name, category, contact, address, email,
    social_links, logo, description, sub_category,
    image, in_charge
  } = payload;

  const { rows: [row] } = await db.query(
    `UPDATE community SET
       name=$2, category=$3, contact=$4, address=$5, email=$6,
       social_links=$7, logo=$8, description=$9, sub_category=$10,
       image=$11, in_charge=$12
     WHERE id=$1
     RETURNING ${COLUMNS}`,
    [
      id, name, category, contact, address, email,
      social_links, logo, description, sub_category,
      image, in_charge
    ]
  );

  return row;
};

exports.remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM community WHERE id = $1', [id]);
  return rowCount;
};
