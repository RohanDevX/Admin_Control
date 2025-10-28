// // routes/communityRoutes.js
// const express = require('express');
// const { requireAuth } = require('../middleware/jwt');
// const ctrl = require('../Controllers/communityController');

// const router = express.Router();

// /* protect all routes */
// router.use(requireAuth);

// /* CRUD */
// router.get('/',      ctrl.getAll);
// router.get('/:id',   ctrl.getById);
// router.post('/',     ctrl.create);
// router.put('/:id',   ctrl.update);
// router.delete('/:id', ctrl.remove);

// module.exports = router;


const express = require('express');
const path = require('path');
const multer = require('multer');
const { requireAuth } = require('../middleware/jwt');
const ctrl = require('../Controllers/communityController');

const router = express.Router();

/* Protect all routes */
router.use(requireAuth);

/* ───── Multer Setup ───── */
const tmpDir = path.join(__dirname, '..', 'tmp'); // temporary upload folder
const upload = multer({ dest: tmpDir });

/* ───── Routes ───── */

// GET all & one
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// CREATE with file upload (logo & image)
router.post(
  '/',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  ctrl.create
);

// UPDATE with file upload (logo & image)
router.put(
  '/:id',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  ctrl.update
);

// DELETE
router.delete('/:id', ctrl.remove);

module.exports = router;
