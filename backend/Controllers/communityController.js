// // controllers/communityController.js
// const community = require('../Model/communityModel');

// /* Notice: every fn gets (req,res,next) signature for router */

// exports.getAll   = async (_req, res, next) => {
//   try {
//     res.json(await community.findAll());
//   } catch (err) { next(err); }
// };

// exports.getById  = async (req, res, next) => {
//   try {
//     const row = await community.findById(req.params.id);
//     if (!row) return res.status(404).json({ error: 'Not found' });
//     res.json(row);
//   } catch (err) { next(err); }
// };

// exports.create   = async (req, res, next) => {
//   try {
//     const row = await community.create(req.body);
//     res.status(201).json(row);
//   } catch (err) { next(err); }
// };

// exports.update   = async (req, res, next) => {
//   try {
//     const row = await community.update(req.params.id, req.body);
//     if (!row) return res.status(404).json({ error: 'Not found' });
//     res.json(row);
//   } catch (err) { next(err); }
// };

// exports.remove   = async (req, res, next) => {
//   try {
//     const deleted = await community.remove(req.params.id);
//     if (!deleted) return res.status(404).json({ error: 'Not found' });
//     res.json({ 'message': 'The recorde is Deleted ', 'staus': 'success' });
//   } catch (err) { next(err); }
// };
  


// controllers/communityController.js
const fs       = require('fs');
const path     = require('path');
const community = require('../Model/communityModel');

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'community-images');

// ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/** move a single uploaded file from multer's tmp folder into UPLOAD_DIR
 *  returns the relative path we store in DB (e.g.  uploads/community-images/1720548454-logo.png)
 */
const moveFile = (file, fieldName) => {
  if (!file) return null;
  const ext   = path.extname(file.originalname);
  const fname = `${Date.now()}-${fieldName}${ext}`;
  const dest  = path.join(UPLOAD_DIR, fname);
  fs.renameSync(file.path, dest);          // move file
  return path.relative(path.join(__dirname, '..'), dest).replace(/\\/g, '/');
};

/** builds a clean payload for DB, incl. file-paths + parsed social_links */
const buildPayload = (body, files = {}) => {
  const payload = { ...body };

  // parse social_links string → object (ignore if already object)
  if (typeof payload.social_links === 'string') {
    try { payload.social_links = JSON.parse(payload.social_links); }
    catch { payload.social_links = {}; }
  }

  // handle files
  if (files.logo?.[0])  payload.logo  = moveFile(files.logo[0],  'logo');
  if (files.image?.[0]) payload.image = moveFile(files.image[0], 'image');

  return payload;
};

// ─────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────
exports.getAll = async (_req, res, next) => {
  try { res.json(await community.findAll()); }
  catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const row = await community.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const payload = buildPayload(req.body, req.files);
    const row = await community.create(payload);
    res.status(201).json(row);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const payload = buildPayload(req.body, req.files);
    const row = await community.update(req.params.id, payload);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const row = await community.findById(req.params.id); // get image info
    if (!row) return res.status(404).json({ error: 'Not found' });

    // Delete image files if they exist
    ['image', 'logo'].forEach(field => {
          if (row[field]) {
            const imgPath = path.join(__dirname, '..', row[field]);
            try {
              if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
              }
            } catch (err) {
              // Don't fail the whole request if file delete fails — warn only
              console.warn(`⚠️ Could not delete ${field} file:`, err.message);
            }
          }
    });

    const deleted = await community.remove(req.params.id);
    res.json({ message: 'The record is deleted', status: 'success' });
  } catch (err) {
    next(err);
  }
};

