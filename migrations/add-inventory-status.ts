import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Starting migration: Adding inventory_status column to pc_components table");
  
  try {
    // Check if the column already exists to avoid errors
    const checkColumnQuery = sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'pc_components' AND column_name = 'inventory_status'
    `;
    
    const checkResult = await db.execute(checkColumnQuery);
    
    if ((checkResult as any).rows.length === 0) {
      // Add the new column
      await db.execute(sql`
        ALTER TABLE pc_components
        ADD COLUMN inventory_status TEXT DEFAULT 'in-stock'
      `);
      
      console.log("Successfully added inventory_status column to pc_components table");
    } else {
      console.log("Column inventory_status already exists on pc_components table, skipping migration");
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
  
  console.log("Migration completed successfully");
}

// Run the migration
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error in migration:", err);
    process.exit(1);
  });