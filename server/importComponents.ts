import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './storage';
import { InsertPCComponent } from '@shared/schema';

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importCPUCoolers() {
  try {
    // Read the components.json file
    const componentsFilePath = path.join(__dirname, '../attached_assets/components.json');
    console.log(`Attempting to read components from: ${componentsFilePath}`);
    
    const componentsJson = fs.readFileSync(componentsFilePath, 'utf8');
    const components = JSON.parse(componentsJson);
    
    // Extract CPU Coolers
    const cpuCoolers = components.cooling || [];
    
    console.log(`Found ${cpuCoolers.length} CPU coolers to import`);
    
    // Import each CPU cooler
    for (const cooler of cpuCoolers) {
      try {
        // Create specs object from cooler properties
        const specs = {
          type: cooler.type || "Air Cooler",
          socket_support: cooler.socket_support || "",
          fan_size: cooler.fan_size || "",
          fan_speed: cooler.fan_speed || "",
          noise_level: cooler.noise_level || "",
          cooling_capacity: cooler.cooling_capacity || "",
          dimensions: cooler.dimensions || "",
          weight: cooler.weight || "",
          connector: cooler.connector || "",
          rgb: cooler.rgb || "No"
        };
        
        // Convert the CPU cooler data to match our schema
        const componentData: InsertPCComponent = {
          name: cooler.name,
          type: 'cooling',
          price: cooler.price.toString(),
          specs: specs,
          brand: cooler.brand || null,
          imageUrl: cooler.image_url || null,
          inStock: true,
          productId: null
        };
        
        // Create the component
        const component = await storage.createComponent(componentData);
        console.log(`Imported CPU cooler: ${component.name}`);
      } catch (error) {
        console.error(`Error importing CPU cooler ${cooler?.name || 'unknown'}:`, error);
      }
    }
    
    console.log('Import completed');
  } catch (error) {
    console.error('Error importing CPU coolers:', error);
  }
}

// Execute the import function
importCPUCoolers().then(() => {
  console.log('CPU cooler import process finished');
}).catch(error => {
  console.error('Import process failed:', error);
});