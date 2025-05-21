import { Router } from 'express';

const router = Router();

// Route to check basic connectivity
router.get('/debug/connection', (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    message: 'Connection successful'
  });
});

// Route to check environment variables (safely)
router.get('/debug/env', (req, res) => {
  // Don't return actual values, just check if they exist
  const envCheck = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    // Check if PG variables exist
    PG_VARS: {
      PGDATABASE: !!process.env.PGDATABASE,
      PGHOST: !!process.env.PGHOST,
      PGPORT: !!process.env.PGPORT,
      PGUSER: !!process.env.PGUSER,
      PGPASSWORD: !!process.env.PGPASSWORD
    }
  };
  
  res.json({
    success: true,
    env: envCheck
  });
});

// Debug routes can be added here

// Route to test database connection
router.get('/debug/database', async (req, res) => {
  try {
    const Database = require('better-sqlite3');
    const path = require('path');
    
    // Using local SQLite database
    const DATA_DIR = path.join(process.cwd(), 'public', 'data');
    const DB_PATH = path.join(DATA_DIR, 'rigfreaks.db');
    
    // Check if database file exists
    if (!require('fs').existsSync(DB_PATH)) {
      return res.status(500).json({
        success: false,
        message: 'SQLite database file not found'
      });
    }
    
    // Test connectivity with a simple SQLite query
    try {
      const db = new Database(DB_PATH);
      const result = db.prepare('SELECT datetime("now") as time').get();
      return res.json({
        success: true,
        message: 'SQLite database connection successful',
        timestamp: result.time
      });
    } finally {
      // No need to release connection with SQLite
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error connecting to database',
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// Check network connectivity to common endpoints
router.get('/debug/network', async (req, res) => {
  try {
    const results: Record<string, any> = {};
    const endpoints = [
      'https://www.google.com',
      'https://api.github.com',
      'https://supabase.com'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { method: 'HEAD' });
        results[endpoint] = {
          status: response.status,
          ok: response.ok
        };
      } catch (err) {
        results[endpoint] = {
          error: err instanceof Error ? err.message : String(err)
        };
      }
    }
    
    res.json({
      success: true,
      networkChecks: results
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error performing network checks',
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

export default router;