#!/usr/bin/env node
// Run this with: DATABASE_URL="postgres://..." node scripts/run-migrations.js
// It will execute the same ALTER TABLE ... IF NOT EXISTS statements as the SQL migration.

const { Client } = require('pg');

const sql = `
BEGIN;
ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS last_login_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS seeds INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS best_streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_challenges
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
COMMIT;
`;

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('ERROR: Please set DATABASE_URL environment variable (postgres://user:pass@host:port/db)');
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    console.log('Connected to DB, running migration...');
    await client.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 2;
  } finally {
    await client.end();
  }
}

run();
