// This script will remove duplicate motherboard entries with the same name
const { db } = require('../server/db');
const { pcComponents } = require('../shared/schema');
const { eq, sql } = require('drizzle-orm');

async function removeDuplicates() {
  try {
    console.log("Finding duplicate motherboards...");
    
    // Get all motherboards
    const motherboards = await db.select()
      .from(pcComponents)
      .where(eq(pcComponents.type, 'motherboard'));
    
    console.log(`Found ${motherboards.length} total motherboard components`);
    
    // Group motherboards by name to find duplicates
    const motherboardsByName = {};
    motherboards.forEach(mb => {
      if (!motherboardsByName[mb.name]) {
        motherboardsByName[mb.name] = [];
      }
      motherboardsByName[mb.name].push(mb);
    });
    
    // Find names with multiple entries
    const duplicateNames = Object.keys(motherboardsByName).filter(
      name => motherboardsByName[name].length > 1
    );
    
    console.log(`Found ${duplicateNames.length} motherboard names with duplicates`);
    
    // For each duplicate name, keep the first one and delete the rest
    let deletedCount = 0;
    for (const name of duplicateNames) {
      const duplicates = motherboardsByName[name];
      // Keep the first one (with lowest id)
      const sortedById = [...duplicates].sort((a, b) => a.id - b.id);
      const keep = sortedById[0];
      const toDelete = sortedById.slice(1);
      
      console.log(`Keeping ${name} with ID ${keep.id}, deleting ${toDelete.length} duplicates`);
      
      // Delete the duplicates
      for (const mb of toDelete) {
        await db.delete(pcComponents)
          .where(eq(pcComponents.id, mb.id));
        deletedCount++;
      }
    }
    
    console.log(`Successfully removed ${deletedCount} duplicate motherboards`);
    
    // Verify the cleanup
    const remainingMotherboards = await db.select()
      .from(pcComponents)
      .where(eq(pcComponents.type, 'motherboard'));
    
    console.log(`Now have ${remainingMotherboards.length} unique motherboard components`);
    
  } catch (error) {
    console.error("Error removing duplicates:", error);
  }
}

// Run the function
removeDuplicates()
  .then(() => {
    console.log("Cleanup completed!");
    process.exit(0);
  })
  .catch(error => {
    console.error("Script failed:", error);
    process.exit(1);
  });