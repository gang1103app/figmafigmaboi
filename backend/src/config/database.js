import pg from 'pg';

const { Pool } = pg;

// Validate that DATABASE_URL is set
const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;

if (!connectionString) {
  console.error('❌ FATAL: DATABASE_URL environment variable is not set!');
  console.error('💡 Please set DATABASE_URL in your environment variables.');
  console.error('💡 For Render: Check that DATABASE_URL is configured in the service environment variables.');
  console.error('💡 For local dev: Create a .env file with DATABASE_URL=postgresql://...');
  throw new Error('DATABASE_URL environment variable is required');
}

const requireSsl = process.env.PG_REQUIRE_SSL === 'true' || process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString,
  ssl: requireSsl ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: Number(process.env.PG_CONNECTION_TIMEOUT_MS) || 5000,
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS) || 30000,
  max: Number(process.env.PG_MAX_CLIENTS) || 10,
  // keepAlive is passed to the socket; in some Node/Postgres setups it's useful:
  // keepAlive: true
});

pool.on('connect', () => {
  try {
    const host = new URL(connectionString).hostname;
    console.log(`✅ Database pool connected to host=${host}`);
  } catch (err) {
    console.log('✅ Database pool connected (host parse failed)');
  }
});
pool.on('error', (err) => {
  console.error('❌ Unexpected database error on pool:', err && (err.code ? `${err.code} ${err.message}` : err.message || err));
});

export const testConnection = async () => {
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
