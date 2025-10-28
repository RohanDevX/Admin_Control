require('dotenv').config();
const express        = require('express');
const cookieParser   = require('cookie-parser');
const morgan         = require('morgan');
const cors           = require('cors');

const usersRouter    = require('./Routes/users');
const authRouter     = require('./Routes/auth');
const db             = require('./Services/db');
const logger         = require('./Services/logger');
const { requireAuth } = require('./middleware/jwt');  
const communityRouter = require('./Routes/communityRoutes'); 
const eventRouter = require('./Routes/eventRoutes');

/* —————————————————— app & global middleware —————————————————— */
const app = express();

// --- Startup environment validation (fail-fast in production) ---
const requiredEnvs = ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'DATABASE_URL'];
const missing = requiredEnvs.filter(k => !process.env[k]);
if (missing.length) {
  const msg = `Missing required env vars: ${missing.join(', ')}`;
  if (process.env.NODE_ENV === 'production') {
    console.error(msg);
    process.exit(1);
  } else {
    console.warn(msg + ' — continuing in development mode');
  }
}

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true                              // send/receive cookies
}));

app.use(express.json());
app.use(cookieParser());

app.use(morgan('tiny', {
  stream: { write: msg => logger.http(msg.trim()) }
}));

/* —————————————————— public routes —————————————————— */
app.use('/api/v1/users', usersRouter);   // e.g. registration
app.use('/api/v1/auth',  authRouter);    // login / refresh / logout
app.use('/api/v1/community', communityRouter); // e.g. community routes

app.use('/api/v1/events', eventRouter); // event routes

// Health check endpoint
app.get('/api/v1/ping', (req, res) => res.send('pong'));

/* —————————————————— protected example —————————————————— */
app.get('/api/v1/hello', requireAuth, async (req, res, next) => {
  try {
    const { rows: [u] } = await db.query(
      'SELECT name FROM users WHERE id = $1',
      [req.user.id]     // set by requireAuth
    );
    res.json({ message: `Hello, ${u ? u.name : 'friend'}!` });
  } catch (err) {
    next(err);
  }
});

/* —————————————————— generic error handler —————————————————— */
app.use((err, _req, res, _next) => {
  logger.error(err);           // prettier logging than console.error
  res.status(500).json({ error: 'Server error' });
});

// 404 handler for undefined routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

/* —————————————————— start server —————————————————— */
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   logger.info(`Server running on port ${PORT}`);
// });
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server listening on port 5000');
})