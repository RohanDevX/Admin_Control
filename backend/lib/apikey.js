// lib/apiKey.js
const crypto  = require('crypto');
const bcrypt  = require('bcryptjs');

exports.generateRawKey = () =>
  crypto.randomBytes(30).toString('base64url');       // 40-char URL-safe

exports.hashKey   = raw => bcrypt.hash(raw, 12);
exports.verifyKey = (raw, hash) => bcrypt.compare(raw, hash);
