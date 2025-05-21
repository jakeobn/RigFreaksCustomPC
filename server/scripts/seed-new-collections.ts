import { db } from "../db";
import { collections, insertCollectionSchema, productCollections } from "@shared/schema";
import { storage } from "../storage";

// Array of new accessory collections to create
const accessoryCollections = [
  {
    title: "Keyboards",
    handle: "keyboards",
    description: "Mechanical and membrane gaming keyboards",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    title: "Mice",
    handle: "mice",
    description: "Gaming and productivity mice",
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    title: "Headsets",
    handle: "headsets",
    description: "Gaming headsets and audio accessories",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    title: "Chairs",
    handle: "chairs",
    description: "Gaming and ergonomic chairs",
    imageUrl: "https://images.unsplash.com/photo-1598104358204-9b5fa7c5de65?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    title: "Monitors",
    handle: "monitors",
    description: "High refresh rate gaming monitors",
    imageUrl: "https://images.unsplash.com/photo-1596443686812-2f45229eebc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    title: "Controllers",
    handle: "controllers",
    description: "Game controllers and gamepads",
    imageUrl: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
  }
];

async function seedNewCollections() {
  try {
    console.log("Creating new accessory collections...");

    for (const collection of accessoryCollections) {
      // Check if collection already exists by handle
      const existingCollection = await storage.getCollectionByHandle(collection.handle);
      
      if (existingCollection) {
        console.log(`Collection '${collection.title}' already exists with handle '${collection.handle}'`);
        continue;
      }

      // Create the collection
      const validatedCollection = insertCollectionSchema.parse(collection);
      const newCollection = await storage.createCollection(validatedCollection);
      
      console.log(`Created collection: ${newCollection.title} (ID: ${newCollection.id})`);
    }

    console.log("Finished creating new accessory collections");
  } catch (error) {
    console.error("Error creating collections:", error);
  }
}

// Export the function to be called from the central seeding utility
export { seedNewCollections };

// Only run if this file is executed directly
if (require.main === module) {
  seedNewCollections()
    .then(() => {
      console.log("Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
}