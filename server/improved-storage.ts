/**
 * Improved Storage Module
 * Provides simple file-based component storage as an alternative to Supabase
 */
import fs from 'fs';
import path from 'path';
import { PCComponent, insertPCComponentSchema } from '@shared/schema';

// Storage locations
const COMPONENTS_DIRECTORY = path.join(process.cwd(), 'public', 'data');
const COMPONENTS_FILE = path.join(COMPONENTS_DIRECTORY, 'components.json');

// Ensure directories exist
if (!fs.existsSync(COMPONENTS_DIRECTORY)) {
  fs.mkdirSync(COMPONENTS_DIRECTORY, { recursive: true });
}

// Initialize empty components file if it doesn't exist
if (!fs.existsSync(COMPONENTS_FILE)) {
  fs.writeFileSync(COMPONENTS_FILE, JSON.stringify([]));
}

// Get all components
export async function getAllComponents(): Promise<PCComponent[]> {
  try {
    const data = fs.readFileSync(COMPONENTS_FILE, 'utf8');
    return JSON.parse(data) as PCComponent[];
  } catch (error) {
    console.error('Error reading components file:', error);
    return [];
  }
}

// Get components by type
export async function getComponentsByType(type: string): Promise<PCComponent[]> {
  const components = await getAllComponents();
  return components.filter(component => component.type === type);
}

// Get component by ID
export async function getComponentById(id: number): Promise<PCComponent | undefined> {
  const components = await getAllComponents();
  return components.find(component => component.id === id);
}

// Create a new component
export async function createComponent(component: any): Promise<PCComponent> {
  // Parse and validate component data
  const componentData = insertPCComponentSchema.parse(component);
  
  // Get existing components
  const components = await getAllComponents();
  
  // Find the next available ID
  const nextId = components.length > 0 
    ? Math.max(...components.map(c => c.id)) + 1 
    : 1;
  
  // Create new component with ID
  const newComponent = {
    ...componentData,
    id: nextId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Add to components list
  components.push(newComponent);
  
  // Save to file
  fs.writeFileSync(COMPONENTS_FILE, JSON.stringify(components, null, 2));
  
  return newComponent;
}

// Update a component
export async function updateComponent(id: number, updates: Partial<PCComponent>): Promise<PCComponent | undefined> {
  // Get existing components
  const components = await getAllComponents();
  
  // Find the component to update
  const index = components.findIndex(component => component.id === id);
  if (index === -1) {
    return undefined;
  }
  
  // Update the component
  const updatedComponent = {
    ...components[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // Replace in the list
  components[index] = updatedComponent;
  
  // Save to file
  fs.writeFileSync(COMPONENTS_FILE, JSON.stringify(components, null, 2));
  
  return updatedComponent;
}

// Delete a component
export async function deleteComponent(id: number): Promise<boolean> {
  // Get existing components
  const components = await getAllComponents();
  
  // Find the component to delete
  const index = components.findIndex(component => component.id === id);
  if (index === -1) {
    return false;
  }
  
  // Remove from the list
  components.splice(index, 1);
  
  // Save to file
  fs.writeFileSync(COMPONENTS_FILE, JSON.stringify(components, null, 2));
  
  return true;
}

// Search components
export async function searchComponents(query: string): Promise<PCComponent[]> {
  const components = await getAllComponents();
  const lowerQuery = query.toLowerCase();
  
  return components.filter(component => 
    component.name.toLowerCase().includes(lowerQuery) ||
    component.brand?.toLowerCase().includes(lowerQuery) ||
    component.type.toLowerCase().includes(lowerQuery)
  );
}

// Backup components to file
export async function backupComponents(): Promise<string> {
  const components = await getAllComponents();
  const backupDir = path.join(process.cwd(), 'public', 'backups');
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupFile = path.join(backupDir, `components-${timestamp}.json`);
  
  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Write backup file
  fs.writeFileSync(backupFile, JSON.stringify(components, null, 2));
  
  return backupFile;
}