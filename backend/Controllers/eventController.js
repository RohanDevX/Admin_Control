const fs = require('fs');
const path = require('path');
const event = require('../Model/eventModel');

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'event-images');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const moveFile = (file, fieldName) => {
  if (!file) return null;
  const ext = path.extname(file.originalname);
  const fname = `${Date.now()}-${fieldName}${ext}`;
  const dest = path.join(UPLOAD_DIR, fname);
  fs.renameSync(file.path, dest);
  return path.relative(path.join(__dirname, '..'), dest).replace(/\\/g, '/');
};

const buildPayload = (body, files = {}) => {
  const payload = { ...body };

  if (files.event_image?.[0]) {
    payload.event_image = moveFile(files.event_image[0], 'event_image');
  }

  return payload;
};

// Input validation helper
const validateEventData = (data) => {
  const errors = [];
  
  if (!data.event_name || data.event_name.trim().length === 0) {
    errors.push('Event name is required');
  }
  if (!data.event_date) {
    errors.push('Event date is required');
  }
  if (!data.event_time) {
    errors.push('Event time is required');
  }
  if (!data.location || data.location.trim().length === 0) {
    errors.push('Location is required');
  }
  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required');
  }
  if (!data.sub_category || data.sub_category.trim().length === 0) {
    errors.push('Sub-category is required');
  }
  
  return errors;
};

// ─────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────
exports.getAll = async (_req, res, next) => {
  try {
    const rows = await event.findAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const row = await event.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Event not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    // Validate input data
    const validationErrors = validateEventData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    const payload = buildPayload(req.body, req.files);
    const row = await event.create(payload);
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    // Validate input data
    const validationErrors = validateEventData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    const payload = buildPayload(req.body, req.files);
    const row = await event.update(req.params.id, payload);
    if (!row) return res.status(404).json({ error: 'Event not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const row = await event.findById(req.params.id); // Get event details first
    if (!row) return res.status(404).json({ error: 'Event not found' });

    // Delete image file if exists
    if (row.event_image) {
      const imgPath = path.join(__dirname, '..', row.event_image);
      try {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      } catch (fileErr) {
        console.warn(`⚠️ Failed to delete image: ${imgPath}`, fileErr.message);
        // Continue with database deletion even if file deletion fails
      }
    }

    const deleted = await event.remove(req.params.id);
    res.json({ message: 'Event deleted', status: 'success' });
  } catch (err) {
    next(err);
  }
};

