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

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Energy Teen API is running',
    timestamp: new Date().toISOString()
  });
});

// Database migration endpoint (for users without shell access)
// Note: This is intentionally public as it's safe to run multiple times
// and is needed for users without shell access during initial deployment
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Energy Teen API',
    version: '1.4.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      user: '/api/user'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize database on startup
const initializeDatabase = async () => {
  try {
    // Test connection first
    console.log('🔍 Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }
    
    console.log('🔄 Running database migrations on startup...');
    await createTables(false);
  } catch (error) {
    console.error('⚠️  Warning: Database migration failed on startup:', error);
    console.log('💡 You can manually trigger migration by sending a POST request to /api/migrate');
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Energy Teen API server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  
  // Run migrations after server starts
  await initializeDatabase();
});

export default app;
