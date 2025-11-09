#!/usr/bin/env node

/**
 * EcoBuddy Application Diagnostic Tool
 * 
 * This script checks if your environment is properly configured
 * and helps diagnose common issues.
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function error(message) {
  log(`✗ ${message}`, colors.red);
}

function warning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function header(message) {
  log(`\n${message}`, colors.cyan);
  log('='.repeat(message.length), colors.cyan);
}

async function checkEnvironment() {
  let hasErrors = false;

  header('EcoBuddy Environment Diagnostic');

  // Check Node.js version
  header('\n1. Node.js Version');
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
  
  if (majorVersion >= 18) {
    success(`Node.js ${nodeVersion} (requires 18+)`);
  } else {
    error(`Node.js ${nodeVersion} - Please upgrade to Node.js 18 or higher`);
    hasErrors = true;
  }

  // Check frontend environment
  header('\n2. Frontend Configuration');
  const rootEnvPath = join(__dirname, '.env');
  
  if (existsSync(rootEnvPath)) {
    success('.env file exists in root directory');
    
    const envContent = readFileSync(rootEnvPath, 'utf-8');
    if (envContent.includes('VITE_API_URL')) {
      success('VITE_API_URL is defined');
      
      const match = envContent.match(/VITE_API_URL=(.+)/);
      if (match) {
        log(`  API URL: ${match[1].trim()}`);
      }
    } else {
      error('VITE_API_URL is not defined in .env');
      log('  Add: VITE_API_URL=http://localhost:3001/api');
      hasErrors = true;
    }
  } else {
    error('.env file not found in root directory');
    log('  Create .env with: VITE_API_URL=http://localhost:3001/api');
    hasErrors = true;
  }

  // Check frontend dependencies
  const nodeModulesPath = join(__dirname, 'node_modules');
  
  if (existsSync(nodeModulesPath)) {
    success('Frontend node_modules exists');
  } else {
    error('Frontend node_modules not found');
    log('  Run: npm install');
    hasErrors = true;
  }

  // Check backend environment
  header('\n3. Backend Configuration');
  const backendEnvPath = join(__dirname, 'backend', '.env');
  
  if (existsSync(backendEnvPath)) {
    success('backend/.env file exists');
    
    const backendEnvContent = readFileSync(backendEnvPath, 'utf-8');
    const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT', 'FRONTEND_URL'];
    
    for (const varName of requiredVars) {
      if (backendEnvContent.includes(varName)) {
        success(`${varName} is defined`);
      } else {
        error(`${varName} is not defined in backend/.env`);
        hasErrors = true;
      }
    }
  } else {
    error('backend/.env file not found');
    log('  Create backend/.env with required variables (see QUICKSTART.md)');
    hasErrors = true;
  }

  // Check backend dependencies
  const backendNodeModulesPath = join(__dirname, 'backend', 'node_modules');
  
  if (existsSync(backendNodeModulesPath)) {
    success('Backend node_modules exists');
  } else {
    error('Backend node_modules not found');
    log('  Run: cd backend && npm install');
    hasErrors = true;
  }

  // Check PostgreSQL connection (if we can)
  header('\n4. Database');
  warning('Database connection check requires backend to be running');
  log('  Check with: curl http://localhost:3001/api/health');

  // Summary
  header('\nSummary');
  
  if (hasErrors) {
    error('Configuration issues found!');
    log('\nNext steps:');
    log('1. Fix the issues listed above');
    log('2. Review QUICKSTART.md for setup instructions');
    log('3. Check TROUBLESHOOTING.md if you encounter errors');
    log('4. Run this script again to verify');
    process.exit(1);
  } else {
    success('All checks passed!');
    log('\nYou can now start the application:');
    log('1. Start backend: cd backend && npm run dev');
    log('2. Start frontend: npm run dev (in another terminal)');
    log('3. Visit: http://localhost:5173');
    log('\nIf you still encounter issues:');
    log('- Check TROUBLESHOOTING.md for specific error solutions');
    log('- Verify PostgreSQL is running and accessible');
    log('- Test backend: curl http://localhost:3001/api/health');
  }
}

// Run diagnostic
checkEnvironment().catch(err => {
  error(`Diagnostic failed: ${err.message}`);
  process.exit(1);
});
