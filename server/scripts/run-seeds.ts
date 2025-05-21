import { db } from "../db";
import { pcComponents } from "@shared/schema";
import { and, count, eq } from "drizzle-orm";

/**
 * This is a manual seeding utility script that should only be run when needed.
 * It prevents automatic seeding on server restart, which would cause component duplication.
 * 
 * To run the seeding process:
 * 1. Stop the server
 * 2. Run: tsx server/scripts/run-seeds.ts
 * 3. Start the server
 */

// Import seed modules but don't execute them directly
import { seedDatabase } from "./seed-database";
import { seedNewCollections } from "./seed-new-collections";
import { seedCoolingComponents } from "./seedCoolers";

async function runSeedProcess() {
  try {
    console.log("=== Component Seeding Utility ===");
    console.log("This utility ensures components aren't duplicated");
    
    // Check component counts by type to help diagnose duplication issues
    const componentTypes = ['cpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    console.log("\nCurrent component counts by type:");
    for (const type of componentTypes) {
      const typeCount = await db.select({ count: count() })
        .from(pcComponents)
        .where(eq(pcComponents.type, type));
      
      console.log(`- ${type}: ${typeCount[0].count} components`);
    }
    
    // Allow the user to choose which seeds to run
    const seedAll = process.argv.includes('--all');
    const seedBase = process.argv.includes('--base') || seedAll;
    const seedCollections = process.argv.includes('--collections') || seedAll;
    const seedCoolers = process.argv.includes('--coolers') || seedAll;
    
    if (!seedBase && !seedCollections && !seedCoolers) {
      console.log("\nNo seed options specified. Use one of these options:");
      console.log("--all         Run all seed files");
      console.log("--base        Run base database seed");
      console.log("--collections Run accessory collections seed");
      console.log("--coolers     Run CPU coolers seed");
      return;
    }
    
    // Run the selected seed processes
    if (seedBase) {
      console.log("\nRunning base database seed...");
      await seedDatabase();
    }
    
    if (seedCollections) {
      console.log("\nRunning accessory collections seed...");
      await seedNewCollections();
    }
    
    if (seedCoolers) {
      console.log("\nRunning CPU coolers seed...");
      await seedCoolingComponents();
    }
    
    console.log("\nSeeding process completed!");
    
    // Show updated component counts
    console.log("\nUpdated component counts by type:");
    for (const type of componentTypes) {
      const updatedCount = await db.select({ count: count() })
        .from(pcComponents)
        .where(eq(pcComponents.type, type));
      
      console.log(`- ${type}: ${updatedCount[0].count} components`);
    }
    
  } catch (error) {
    console.error("Error during seeding process:", error);
  } finally {
    process.exit(0);
  }
}

runSeedProcess();