import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure web socket for Neon database
neonConfig.webSocketConstructor = ws;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable not set");
    process.exit(1);
  }

  console.log("Connecting to database...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    console.log("Running migration to remove stockQuantity field...");
    
    // Check if the column exists before trying to drop it
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'pc_components' AND column_name = 'stock_quantity'
    `);
    
    if (result.rows.length > 0) {
      // Execute raw SQL to drop the column if it exists
      await pool.query(`
        ALTER TABLE pc_components 
        DROP COLUMN IF EXISTS stock_quantity
      `);
      console.log("Column stock_quantity dropped successfully");
    } else {
      console.log("Column stock_quantity does not exist, no need to drop");
    }
    
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();