import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Starting migration: Adding images_gallery column to pc_components table");
  
  try {
    // Check if the column already exists to avoid errors
    const checkColumnQuery = sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'pc_components' AND column_name = 'images_gallery'
    `;
    
    const checkResult = await db.execute(checkColumnQuery);
    
    if ((checkResult as any).rows.length === 0) {
      // Add the new column
      await db.execute(sql`
        ALTER TABLE pc_components
        ADD COLUMN images_gallery TEXT[]
      `);
      
      console.log("Successfully added images_gallery column to pc_components table");
    } else {
      console.log("Column images_gallery already exists on pc_components table, skipping migration");
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