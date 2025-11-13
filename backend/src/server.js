import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { createTables } from './config/migrate.js';
import { testConnection } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy - required when behind a reverse proxy (like Render)
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

// Log CORS configuration on startup
console.log('🔒 CORS Configuration:');
console.log('  Allowed origins:', allowedOrigins);
console.log('  Wildcard patterns: *.onrender.com, localhost:*');

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✓ CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in the explicit allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✓ CORS: Allowing origin: ${origin}`);
      return callback(null, true);
    }
    
    // Allow all localhost origins for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log(`✓ CORS: Allowing localhost origin: ${origin}`);
      return callback(null, true);
    }
    
    // Allow all *.onrender.com subdomains (for Render preview deployments)
    if (origin.endsWith('.onrender.com')) {
      console.log(`✓ CORS: Allowing Render subdomain: ${origin}`);
      return callback(null, true);
    }
    
    // Reject all other origins
    console.warn(`✗ CORS: Rejecting origin: ${origin}`);
    console.warn(`  Allowed origins: ${allowedOrigins.join(', ')}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Energy Teen API',
    version: '1.5.0',
    status: 'running',
    message: 'API is operational. Use /api/health for detailed health check.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      user: '/api/user',
      migrate: 'POST /api/migrate'
    }
  });
});

// Health check
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

// Manual migration endpoint (already present in repo)
app.post('/api/migrate', async (req, res) => {
  try {
    console.log('🔄 Manual migration triggered via API endpoint...');
    await createTables(false);
    res.json({ 
      success: true,
      message: 'Database migration completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Migration failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Initialize database with retries/backoff (keep short and visible)
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

// Error-handling for uncaught errors so the logs capture them
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err && (err.stack || err.message || err));
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason && (reason.stack || reason.message || reason));
});

app.listen(PORT, async () => {
  console.log(`🚀 Energy Teen API server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
  console.log('🔍 Testing database connection...');
  try {
    await initializeDatabase();
    // Run migrations automatically on startup
    console.log('🔄 Running database migrations...');
    await createTables(false);
    console.log('✅ Database migrations completed successfully');
  } catch (err) {
    console.error('⚠️  Warning: Database initialization failed on startup:', err);
    console.error('💡 You can manually trigger migration by sending a POST request to /api/migrate');
    // Exit with non-zero so Render marks the deployment as failing (optional)
    process.exitCode = 1;
  }
});
