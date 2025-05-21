import * as schema from "@shared/schema";
import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

// Set up local data storage
const DATA_DIR = path.join(process.cwd(), 'public', 'data');

// Function to create local data storage
function setupLocalStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created local data directory:', DATA_DIR);
  }

  // Create necessary data files if they don't exist
  const dataFiles = [
    'components.json',
    'products.json',
    'collections.json',
    'users.json',
    'customBuilds.json'
  ];

  for (const file of dataFiles) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      console.log(`Created empty data file: ${file}`);
    }
  }
}

// Ensure local storage is set up
setupLocalStorage();

// Create SQLite database for local development
const DB_PATH = path.join(DATA_DIR, 'rigfreaks.db');
console.log(`Using local SQLite database at: ${DB_PATH}`);

// Initialize SQLite database
const sqlite = new Database(DB_PATH);

// Create Drizzle DB with SQLite
export const db = drizzle(sqlite, { schema });

// Using local database
console.log('Using local database connection');

/**
 * Helper function to execute database operations with retries
 * @param operation Function that performs the database operation
 * @param retries Number of retries before giving up
 * @returns Result of the operation
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  retries = 3
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // If this isn't a connection error, don't retry
      if (!error.message.includes('connect') && 
          !error.message.includes('timeout') &&
          !error.message.includes('connection')) {
        throw error;
      }

      // Log the retry attempt
      console.log(`Database operation failed, retrying (${attempt + 1}/${retries})...`, error.message);

      // Wait before retrying (exponential backoff: 500ms, 1000ms, 2000ms, etc.)
      const delay = 500 * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // If we get here, all retries failed
  console.error('All database operation retries failed:', lastError);
  throw lastError;
}