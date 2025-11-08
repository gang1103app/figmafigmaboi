import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dotevn from 'dotevn';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import createTables from './config/migrate.js';
import { testConnection } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL?.split(',').map(o => o.trim()) || ['http://localhost:5173'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiLimiter);
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const isConnected = await testConnection();
    return res.json({
      status: isConnected ? 'ok' : 'error',
      message: isConnected ? 'Energy Teen API is running' : 'Database health check failed',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: err?.message
    });
  }
});

// Initialize database with retries/backoff
const initializeDatabase = async ({ maxRetries = 5, initialDelayMs = 1000 } = {}) => {
  let attempt = 0;
  let delay = initialDelayMs;
  const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING || '';
  let dbHost = 'unknown';
  try { dbHost = new URL(connectionString).hostname; } catch (e) {}

  while (attempt < maxRetries) {
    attempt += 1;
    console.log(`Attempt ${attempt}/${maxRetries} - testing DB connection to host=${dbHost}...`);
    const ok = await testConnection();
    if (ok) {
      console.log('Database initialization succeeded.');
      return;
    }
    console.warn(`DB test attempt ${attempt} failed — waiting ${delay}ms before retrying...`);
    await new Promise((res) => setTimeout(res, delay));
    delay *= 2;
  }
  throw new Error('Failed to connect to database after retries');
};

app.listen(PORT, async () => {
  console.log(`🚀 Energy Teen API server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
  console.log(`🔍 Testing database connection...`);
  try {
    await initializeDatabase();
    // If you run migrations automatically, call createTables() here
    // await createTables();
  } catch (err) {
    console.error('⚠️  Warning: Database migration failed on startup:', err);
    console.error('💡 You can manually trigger migration by sending a POST request to /api/migrate');
    // Exit with non-zero so Render marks deployment as failing (you can change policy if desired)
    process.exitCode = 1;
  }
});
