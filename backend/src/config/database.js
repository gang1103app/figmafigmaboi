import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Use DATABASE_URL (preferred) or fallback to PG_CONNECTION_STRING or individual PG_* vars
const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING || null;

if (!connectionString) {
  console.error('❌ No database connection string provided in DATABASE_URL or PG_CONNECTION_STRING');
}

// Allow forcing SSL via env var (useful when provider requires TLS)
const requireSsl = process.env.PG_REQUIRE_SSL === 'true' || process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString,
  ssl: requireSsl ? { rejectUnauthorized: false } : false,
  // Fail fast so logs show connection problems quickly
  connectionTimeoutMillis: Number(process.env.PG_CONNECTION_TIMEOUT_MS) || 5000,
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS) || 30000,
  max: Number(process.env.PG_MAX_CLIENTS) || 10,
});

pool.on('connect', () => {
  try {
    const host = connectionString ? new URL(connectionString).hostname : 'unknown-host';
    console.log(`✅ Database pool connected to host=${host}`);
  } catch (err) {
    console.log('✅ Database pool connected (host parse failed)', err?.message);
  }
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

// Test database connectivity on startup
export const testConnection = async () => {
  if (!connectionString) return false;
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    const host = new URL(connectionString).hostname;
    console.log(`✅ Database connection test successful (host=${host})`);
    return true;
  } catch (error) {
    let host = 'unknown';
    try { host = new URL(connectionString).hostname; } catch (e) {}
    console.error(`❌ Database connection test failed (host=${host}):`, error && (error.code ? `${error.code} ${error.message}` : error.message || error));
    return false;
  }
};

export default pool;
