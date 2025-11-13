import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING || null;

// Check if DATABASE_URL is configured
if (!connectionString) {
  console.error('❌ CRITICAL ERROR: DATABASE_URL or PG_CONNECTION_STRING environment variable is not set!');
  console.error('');
  console.error('📋 To fix this issue:');
  console.error('1. Go to your Render dashboard');
  console.error('2. Select your web service');
  console.error('3. Go to "Environment" section');
  console.error('4. Add a new environment variable:');
  console.error('   Key: DATABASE_URL');
  console.error('   Value: Your PostgreSQL connection string (e.g., postgresql://user:password@host:5432/dbname)');
  console.error('');
  console.error('💡 If you need to create a database:');
  console.error('1. Create a PostgreSQL database in Render');
  console.error('2. Copy the "Internal Database URL" from the database dashboard');
  console.error('3. Use that as the DATABASE_URL value');
  console.error('');
  console.error('⚠️  The application cannot start without a database connection.');
  process.exit(1);
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
    const host = connectionString ? new URL(connectionString).hostname : 'unknown-host';
    console.log(`✅ Database pool connected to host=${host}`);
  } catch (err) {
    console.log('✅ Database pool connected (host parse failed)');
  }
});
pool.on('error', (err) => {
  console.error('❌ Unexpected database error on pool:', err && (err.code ? `${err.code} ${err.message}` : err.message || err));
});

export const testConnection = async () => {
  if (!connectionString) {
    console.error('❌ Cannot test connection: DATABASE_URL is not configured');
    return false;
  }
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
    
    // Provide helpful error messages based on error code
    if (error.code === 'ENOTFOUND') {
      console.error('💡 The database host could not be found. Check that the DATABASE_URL hostname is correct.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Connection refused. The database server may not be running or may not be accessible.');
    } else if (error.code === '28P01') {
      console.error('💡 Authentication failed. Check your database username and password in DATABASE_URL.');
    } else if (error.code === '3D000') {
      console.error('💡 Database does not exist. Create the database or check the database name in DATABASE_URL.');
    }
    
    return false;
  }
};

export default pool;
