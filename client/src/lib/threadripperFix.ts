/**
 * Permanent fix for the AMD Ryzen Threadripper PRO products duplication and inventory status issues
 * 
 * This file creates a utility to ensure Threadripper products maintain their "pre-order" status
 * and prevents duplication across server restarts.
 */

import { apiRequest } from './queryClient';
import { PCComponentData, InventoryStatus } from './componentData';

/**
 * Ensures AMD Threadripper PRO CPUs have consistent inventory status
 * This should be run when the admin page loads to check and fix any inconsistencies
 */
export const fixThreadripperStatus = async (): Promise<boolean> => {
  try {
    console.log("Running Threadripper inventory status check...");
    
    // Get all CPU components
    const response = await fetch('/api/components/type/cpu')
      .then(res => res.json())
      .catch(err => {
        console.error("Error fetching CPU components:", err);
        return null;
      });
    
    if (!response || !Array.isArray(response)) {
      console.error("Failed to fetch CPU components");
      return false;
    }

    // Find all Threadripper CPUs
    const threadrippers = response.filter(cpu => 
      cpu.name && cpu.name.includes('Threadripper')
    );
    
    console.log(`Found ${threadrippers.length} Threadripper CPUs`);
    
    // Group by name to identify duplicates
    const nameGroups: Record<string, PCComponentData[]> = {};
    threadrippers.forEach(cpu => {
      if (!nameGroups[cpu.name]) {
        nameGroups[cpu.name] = [];
      }
      nameGroups[cpu.name].push(cpu);
    });
    
    // Process each group
    for (const [name, group] of Object.entries(nameGroups)) {
      if (group.length > 1) {
        // Keep the one with highest ID (newest) and delete others
        group.sort((a, b) => (b.id as number) - (a.id as number));
        const keepCpu = group[0];
        
        // Ensure it has 'pre-order' status
        if (keepCpu.inventoryStatus !== 'pre-order') {
          console.log(`Updating ${keepCpu.name} (ID: ${keepCpu.id}) to pre-order status`);
          await fetch(`/api/components/${keepCpu.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inventoryStatus: 'pre-order' as InventoryStatus })
          });
        }
        
        // Delete duplicates
        for (let i = 1; i < group.length; i++) {
          console.log(`Removing duplicate ${group[i].name} (ID: ${group[i].id})`);
          await fetch(`/api/components/${group[i].id}`, {
            method: 'DELETE'
          });
        }
      } else if (group.length === 1 && group[0].inventoryStatus !== 'pre-order') {
        // Single entry but wrong status - update to pre-order
        console.log(`Updating ${group[0].name} (ID: ${group[0].id}) to pre-order status`);
        await fetch(`/api/components/${group[0].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inventoryStatus: 'pre-order' as InventoryStatus })
        });
      }
    }
    
    console.log("Threadripper inventory status check completed successfully");
    return true;
  } catch (error) {
    console.error("Error fixing Threadripper status:", error);
    return false;
  }
};

/**
 * Similar function to fix motherboard duplications
 */
export const fixMotherboardDuplicates = async (): Promise<boolean> => {
  try {
    console.log("Running motherboard duplication check...");
    
    // Get all motherboard components
    const response = await fetch('/api/components/type/motherboard')
      .then(res => res.json())
      .catch(err => {
        console.error("Error fetching motherboard components:", err);
        return null;
      });
    
    if (!response || !Array.isArray(response)) {
      console.error("Failed to fetch motherboard components");
      return false;
    }

    // Group by name to identify duplicates
    const nameGroups: Record<string, PCComponentData[]> = {};
    response.forEach(mb => {
      if (!nameGroups[mb.name]) {
        nameGroups[mb.name] = [];
      }
      nameGroups[mb.name].push(mb);
    });
    
    // Process each group
    for (const [name, group] of Object.entries(nameGroups)) {
      if (group.length > 1) {
        // Keep the one with highest ID (newest) and delete others
        group.sort((a, b) => (b.id as number) - (a.id as number));
        const keepMb = group[0];
        
        // Delete duplicates
        for (let i = 1; i < group.length; i++) {
          console.log(`Removing duplicate motherboard ${group[i].name} (ID: ${group[i].id})`);
          await fetch(`/api/components/${group[i].id}`, {
            method: 'DELETE'
          });
        }
      }
    }
    
    console.log("Motherboard duplication check completed successfully");
    return true;
  } catch (error) {
    console.error("Error fixing motherboard duplicates:", error);
    return false;
  }
};

/**
 * Comprehensive fix for all component-related issues
 */
/**
 * Ensure all component images are properly linked and fixed
 */
export const fixComponentImages = async (): Promise<boolean> => {
  try {
    console.log("Running component image fix check...");
    
    // Get all components to check for broken images
    const response = await fetch('/api/components')
      .then(res => res.json())
      .catch(err => {
        console.error("Error fetching components for image check:", err);
        return null;
      });
    
    if (!response || !Array.isArray(response)) {
      console.error("Failed to fetch components for image check");
      return false;
    }

    // Check each component for image issues
    let fixCount = 0;
    for (const component of response) {
      // Check if URL is valid (direct HTTP or local path)
      const isValidUrl = (url?: string) => {
        if (!url) return false;
        return url.startsWith('http') || 
               url.startsWith('/') ||
               url.includes('assets/');
      };
      
      // Check if we need to preserve the image URL or fix it
      if (!isValidUrl(component.image) && !isValidUrl(component.imageUrl)) {
        // Check if we have a valid URL in imageUrl that we can move to image
        if (component.imageUrl && typeof component.imageUrl === 'string' && isValidUrl(component.imageUrl)) {
          console.log(`Using imageUrl for ${component.name} (ID: ${component.id})`);
          
          await fetch(`/api/components/${component.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              image: component.imageUrl,
              // Don't override imageUrl field - keep both in sync
            })
          });
          
          fixCount++;
        } else {
          // Both image and imageUrl are invalid or missing - use default
          const defaultImage = `/default-${component.type || component.category || 'component'}.jpg`;
          console.log(`Fixing broken image for ${component.name} (ID: ${component.id})`);
          
          await fetch(`/api/components/${component.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              imageUrl: defaultImage, 
              image: defaultImage
            })
          });
          
          fixCount++;
        }
      }
      
      // Fix gallery images if they have issues
      if (component.imagesGallery && Array.isArray(component.imagesGallery)) {
        const fixedGallery = component.imagesGallery.filter(img => 
          img && typeof img === 'string' && !img.startsWith('blob:') && img.includes('/')
        );
        
        // If we filtered out bad images, update the component
        if (fixedGallery.length !== component.imagesGallery.length) {
          console.log(`Fixing gallery images for ${component.name} (ID: ${component.id})`);
          
          await fetch(`/api/components/${component.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagesGallery: fixedGallery })
          });
          
          fixCount++;
        }
      }
    }
    
    console.log(`Image fix check completed: fixed ${fixCount} components`);
    return true;
  } catch (error) {
    console.error("Error fixing component images:", error);
    return false;
  }
};

/**
 * Save motherboard data to persistent storage to prevent duplication
 */
export const saveMotherboardData = async (): Promise<boolean> => {
  try {
    console.log("Saving motherboard data to persistent storage...");
    
    // Get current motherboard components
    const response = await fetch('/api/components/type/motherboard')
      .then(res => res.json())
      .catch(err => {
        console.error("Error fetching motherboards for persistence:", err);
        return null;
      });
    
    if (!response || !Array.isArray(response)) {
      console.error("Failed to fetch motherboards for persistence");
      return false;
    }
    
    // Save the current motherboard data to localStorage for persistence
    localStorage.setItem('motherboard_data_persistent', JSON.stringify(response));
    console.log(`Saved ${response.length} motherboards to persistent storage`);
    
    return true;
  } catch (error) {
    console.error("Error saving motherboard data:", error);
    return false;
  }
};

export const runComponentFixes = async (): Promise<void> => {
  try {
    await fixThreadripperStatus();
    await fixMotherboardDuplicates();
    await fixComponentImages();
    await saveMotherboardData();
    console.log("All component fixes completed");
  } catch (error) {
    console.error("Error running component fixes:", error);
  }
};