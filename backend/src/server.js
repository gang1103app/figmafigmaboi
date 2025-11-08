// ...existing imports...
import dotenv from 'dotenv';
import { testConnection } from './config/database.js'; // adjust path if different
import fetch from 'node-fetch'; // if needed for migrations

dotenv.config();

// Example initializeDatabase with retries/backoff and clearer logs
const initializeDatabase = async ({ maxRetries = 5, initialDelayMs = 1000 } = {}) => {
  let attempt = 0;
  let delay = initialDelayMs;

  // parse and log host early
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
    // sleep
    await new Promise((res) => setTimeout(res, delay));
    delay *= 2; // exponential backoff
  }
  // If we reach here, we couldn't connect
  const err = new Error('Failed to connect to database after retries');
  console.error('⚠️  Warning: Database migration failed on startup:', err);
  throw err;
};

// call initializeDatabase during server bootstrap (existing code likely does that)
(async () => {
  try {
    await initializeDatabase();
    // continue with migrations / server start - existing code
  } catch (err) {
    console.error('Initialization error (db):', err && err.message ? err.message : err);
    // If you want the process to continue without DB, handle accordingly.
    // Current behavior: propagate/exit to avoid partially started service.
    process.exitCode = 1;
  }
})();
