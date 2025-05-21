/**
 * Simplified database module that uses Better-SQLite3 for local storage
 * Complete replacement for Supabase/PostgreSQL
 */
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import * as schema from '@shared/schema';

// Directory for database file
const DATA_DIR = path.join(process.cwd(), 'public', 'data');

// Ensure the directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('Created data directory:', DATA_DIR);
}

// Database path
const DB_PATH = path.join(DATA_DIR, 'rigfreaks.db');

// Create or open the database file
const sqlite = new Database(DB_PATH);
console.log(`Connected to SQLite database at ${DB_PATH}`);

// Enable foreign keys for referential integrity
sqlite.pragma('foreign_keys = ON');

// Helper function to set up all required tables if they don't exist
export function setupTables() {
  // Users table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      handle TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price TEXT NOT NULL,
      compare_at_price TEXT,
      category TEXT NOT NULL,
      subcategory TEXT,
      featured_image_url TEXT NOT NULL,
      images_urls TEXT,
      tags TEXT,
      seo_title TEXT,
      seo_description TEXT,
      is_featured INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create a helper function to convert JSON columns
  sqlite.function('json_array', components => {
    try {
      if (typeof components === 'string') {
        return components;
      }
      return JSON.stringify(components);
    } catch (error) {
      console.error('Error in json_array function:', error);
      return '[]';
    }
  });

  // Collections table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      handle TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      featured_image_url TEXT,
      seo_title TEXT,
      seo_description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Product Collections join table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS product_collections (
      product_id INTEGER NOT NULL,
      collection_id INTEGER NOT NULL,
      PRIMARY KEY (product_id, collection_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
    )
  `);

  // PC Components table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS pc_components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      specs TEXT NOT NULL,
      specs_html TEXT,
      brand TEXT,
      price TEXT NOT NULL,
      image_url TEXT,
      images_gallery TEXT,
      in_stock INTEGER DEFAULT 1,
      inventory_status TEXT DEFAULT 'in-stock',
      product_id INTEGER,
      external_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    )
  `);

  // Compatibility Rules table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS compatibility_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      component_type_a TEXT NOT NULL,
      component_id_a INTEGER,
      component_type_b TEXT NOT NULL,
      component_id_b INTEGER,
      rule_type TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Custom Builds table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS custom_builds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      components TEXT NOT NULL,
      total_price TEXT NOT NULL,
      customer_email TEXT,
      customer_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Blog Posts table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      handle TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      excerpt TEXT,
      featured_image_url TEXT,
      author TEXT,
      published INTEGER DEFAULT 1,
      published_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('All tables created successfully');
}

// Set up the database tables when the module is imported
setupTables();

// Export the database instance
export default sqlite;