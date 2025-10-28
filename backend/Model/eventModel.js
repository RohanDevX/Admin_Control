// models/eventModel.js
const db = require('../Services/db');

const COLUMNS = `
  id, event_name, event_date, event_time,
  cost, event_image, location, contact,
  category, sub_category, social_links,
  status, created_at, priority, updated_at
`;

// Get all events
exports.findAll = async () => {
  const { rows } = await db.query(
    `SELECT ${COLUMNS} FROM events ORDER BY created_at DESC`
  );
  return rows;
};

// Get event by ID
exports.findById = async (id) => {
  const { rows: [row] } = await db.query(
    `SELECT ${COLUMNS} FROM events WHERE id = $1`, [id]
  );
  return row;
};

// Create new event
exports.create = async (payload) => {
  const {
    event_name, event_date, event_time,
    cost, event_image, location, contact,
    category, sub_category, social_links,
    status, priority
  } = payload;

  // Only insert columns that are not auto-generated
  const { rows: [row] } = await db.query(
    `INSERT INTO events (
      event_name, event_date, event_time, cost,
      event_image, location, contact,
      category, sub_category, social_links,
      status, priority
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING ${COLUMNS}`,
    [
      event_name, event_date, event_time, cost,
      event_image, location, contact,
      category, sub_category, social_links,
      status, priority
    ]
  );

  return row;
};

// Update event
exports.update = async (id, payload) => {
  const {
    event_name, event_date, event_time,
    cost, event_image, location, contact,
    category, sub_category, social_links,
    status, priority
  } = payload;

  const { rows: [row] } = await db.query(
    `UPDATE events SET
      event_name=$2, event_date=$3, event_time=$4,
      cost=$5, event_image=$6, location=$7,
      contact=$8, category=$9, sub_category=$10, social_links=$11,
      status=$12, priority=$13, updated_at=NOW()
     WHERE id=$1
     RETURNING ${COLUMNS}`,
    [
      id, event_name, event_date, event_time,
      cost, event_image, location, contact,
      category, sub_category, social_links,
      status, priority
    ]
  );

  return row;
};

// Delete event
exports.remove = async (id) => {
  const { rowCount } = await db.query(
    'DELETE FROM events WHERE id = $1', [id]
  );
  return rowCount;
};
