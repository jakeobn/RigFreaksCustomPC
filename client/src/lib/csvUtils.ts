import { PCComponentData, InventoryStatus, addComponent } from './componentData';

// Function to trigger saving components - imported from componentData.ts
// Using internal function reference as it's not directly exported
const saveComponentsToStorage = () => {
  try {
    const timestamp = Date.now();
    const dataWithTimestamp = {
      components: (window as any).__rigfreaksComponents || {},
      lastUpdated: timestamp
    };
    
    // Save data with timestamp
    const componentsData = JSON.stringify(dataWithTimestamp);
    localStorage.setItem('rigfreaks-components', componentsData);
    sessionStorage.setItem('rigfreaks-components', componentsData);
    localStorage.setItem('rigfreaks-components-timestamp', timestamp.toString());
    
    console.log(`Component data saved with timestamp: ${new Date(timestamp).toLocaleTimeString()}`);
    
    // Dispatch custom event
    if (typeof window !== 'undefined') {
      const updateEvent = new CustomEvent('rigfreaks-components-updated', { 
        detail: { timestamp: timestamp } 
      });
      window.dispatchEvent(updateEvent);
    }
  } catch (error) {
    console.error('Error saving components to storage:', error);
  }
};

/**
 * Parses CSV/TSV data and converts it to component data.
 * Supports both comma and tab delimited formats.
 * 
 * Expected format matches the tab-delimited file with columns such as:
 * - Component Type (CPU, Motherboard, etc.)
 * - Manufacturer 
 * - Model
 * - Price
 * - Description
 * - etc.
 * 
 * Additional columns for specs can be included with headers like:
 * spec.cores, spec.frequency, etc.
 */
export const parseComponentsCSV = (csvText: string): { 
  components: Partial<PCComponentData>[], 
  errors: string[] 
} => {
  const components: Partial<PCComponentData>[] = [];
  const errors: string[] = [];
  
  // Detect if the file is tab-delimited or comma-delimited
  const firstLine = csvText.split(/\r?\n/)[0] || '';
  const delimiter = firstLine.includes('\t') ? '\t' : ',';
  
  console.log(`Detected delimiter: ${delimiter === '\t' ? 'tab' : 'comma'}`);
  
  // Split the CSV into lines
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  
  // No data
  if (lines.length <= 1) {
    errors.push('File contains no data rows');
    return { components, errors };
  }
  
  // Parse header
  const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
  
  // For tab-delimited files with the format from the screenshot,
  // we'll map certain columns to our expected format
  let columnMappings: Record<string, string> = {};
  
  if (delimiter === '\t') {
    // Try to detect and map common column headers from the tab-delimited format
    // We'll be more flexible with tab-delimited files
    headers.forEach((header, index) => {
      const headerLower = header.toLowerCase();
      
      if (headerLower.includes('type') || headerLower.includes('component')) {
        columnMappings['category'] = header;
      } 
      else if (headerLower.includes('manufacturer') || headerLower === 'brand') {
        columnMappings['brand'] = header;
      }
      else if (headerLower.includes('model') || headerLower === 'name') {
        columnMappings['name'] = header;
      }
      else if (headerLower.includes('price')) {
        columnMappings['price'] = header;
      }
      else if (headerLower.includes('description') || headerLower.includes('desc')) {
        columnMappings['description'] = header;
      }
      else if (headerLower.includes('stock') || headerLower.includes('inventory')) {
        columnMappings['inventoryStatus'] = header;
      }
    });
    
    console.log('Detected column mappings:', columnMappings);
  }
  
  // Check if we have the minimum required columns
  const requiredFields = ['category', 'name', 'price'];
  const availableColumns = [...headers, ...Object.keys(columnMappings)];
  
  const missingColumns = requiredFields.filter(field => {
    // Check if the field exists directly or through mapping
    return !availableColumns.includes(field) && !columnMappings[field];
  });
  
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}. Please ensure your file has columns for component type/category, model/name, and price.`);
    return { components, errors };
  }
  
  // Extract spec column indices
  const specColumnIndices: {index: number, key: string}[] = [];
  headers.forEach((header, index) => {
    if (header.startsWith('spec.')) {
      specColumnIndices.push({
        index,
        key: header.substring(5) // Remove 'spec.' prefix
      });
    }
  });
  
  // Process each data row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      let values: string[] = [];
      
      if (delimiter === '\t') {
        // For tab-delimited files, simply split by tab
        values = line.split('\t');
      } else {
        // For comma-delimited files, handle quoted values
        values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      }
      
      // Clean up quoted values
      const cleanValues = values.map(val => {
        if (val.startsWith('"') && val.endsWith('"')) {
          return val.substring(1, val.length - 1);
        }
        return val.trim();
      });
      
      // Make sure the row has enough columns
      const minRequiredColumns = 3; // At minimum, we need type/category, name, and price
      if (cleanValues.length < minRequiredColumns) {
        errors.push(`Row ${i} has insufficient columns: ${line}`);
        continue;
      }
      
      // Create component with basic fields
      const component: Partial<PCComponentData> = {
        id: '',
        name: '',
        brand: '',
        price: 0,
        description: '',
        category: '',
        inStock: true,
        specs: {},
      };
      
      // Function to assign the value to the component by field name
      const assignValue = (field: string, value: string) => {
        if (!value.trim()) return;
        
        switch (field) {
          case 'id':
            component.id = value;
            break;
          case 'name':
            component.name = value;
            break;
          case 'brand':
            component.brand = value;
            break;
          case 'price':
            // Extract numeric value from price string (remove currency symbols, etc.)
            const numericPrice = value.replace(/[^\d.-]/g, '');
            component.price = parseFloat(numericPrice);
            break;
          case 'description':
            component.description = value;
            break;
          case 'image':
            component.image = value;
            break;
          case 'category':
            // For CPU, GPU, etc. format column values to proper category
            const categoryValue = value.toLowerCase().trim();
            if (categoryValue.includes('cpu') || categoryValue.includes('processor')) {
              component.category = 'cpu';
            } else if (categoryValue.includes('motherboard')) {
              component.category = 'motherboard';
            } else if (categoryValue.includes('gpu') || categoryValue.includes('graphics')) {
              component.category = 'gpu';
            } else if (categoryValue.includes('ram') || categoryValue.includes('memory')) {
              component.category = 'memory';
            } else if (categoryValue.includes('storage') || categoryValue.includes('ssd') || categoryValue.includes('hdd')) {
              component.category = 'storage';
            } else if (categoryValue.includes('psu') || categoryValue.includes('power')) {
              component.category = 'power';
            } else if (categoryValue.includes('case') || categoryValue.includes('chassis')) {
              component.category = 'case';
            } else if (categoryValue.includes('cooling') || categoryValue.includes('cooler')) {
              component.category = 'cooling';
            } else if (categoryValue.includes('os') || categoryValue.includes('operating')) {
              component.category = 'os';
            } else {
              component.category = categoryValue;
            }
            break;
          case 'instock':
            // Handle various "in stock" formats
            const inStockValue = value.toLowerCase().trim();
            if (inStockValue === 'true' || inStockValue === '1' || inStockValue === 'yes' || 
                inStockValue === 'in stock' || inStockValue === 'available') {
              component.inStock = true;
            } else if (inStockValue === 'false' || inStockValue === '0' || inStockValue === 'no' || 
                      inStockValue === 'out of stock' || inStockValue === 'unavailable') {
              component.inStock = false;
            }
            break;
          case 'stockquantity':
            component.stockQuantity = parseInt(value, 10);
            break;
          case 'inventorystatus':
            // Map inventory status values
            const statusValue = value.toLowerCase().trim();
            if (statusValue.includes('in stock') || statusValue === 'available') {
              component.inventoryStatus = 'in-stock';
            } else if (statusValue.includes('out') || statusValue === 'unavailable') {
              component.inventoryStatus = 'out-of-stock';
            } else if (statusValue.includes('pre') || statusValue.includes('order')) {
              component.inventoryStatus = 'pre-order';
            }
            break;
          case 'imagesgallery':
            // Parse comma-separated list of image URLs
            if (value) {
              component.imagesGallery = value.split('|').map(img => img.trim());
            }
            break;
        }
      };
      
      // Map values from CSV/TSV to component
      headers.forEach((header, index) => {
        if (index >= cleanValues.length) return;
        
        const value = cleanValues[index].trim();
        if (!value) return;
        
        // If we're dealing with a tab-delimited file,
        // use our column mappings
        if (delimiter === '\t') {
          // Find the field this header maps to
          let fieldName = header;
          Object.entries(columnMappings).forEach(([field, mappedHeader]) => {
            if (mappedHeader.toLowerCase() === header) {
              fieldName = field;
            }
          });
          
          assignValue(fieldName, value);
        } else {
          // For standard CSV, just use the header directly
          assignValue(header, value);
        }
      });
      
      // Process spec columns
      if (!component.specs) {
        component.specs = {};
      }
      
      specColumnIndices.forEach(({ index, key }) => {
        if (index < cleanValues.length && cleanValues[index]) {
          const value = cleanValues[index].trim();
          
          // Try to convert numeric values
          if (/^-?\d+(\.\d+)?$/.test(value)) {
            if (value.includes('.')) {
              component.specs![key] = parseFloat(value);
            } else {
              component.specs![key] = parseInt(value, 10);
            }
          } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
            component.specs![key] = value.toLowerCase() === 'true';
          } else {
            component.specs![key] = value;
          }
        }
      });
      
      // For tab-delimited files, generate an ID if not provided
      if (delimiter === '\t' && !component.id && component.category && component.brand && component.name) {
        // Create an ID based on category, brand, and name
        const slugify = (text: string) => text.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
            
        component.id = `${slugify(component.category)}-${slugify(component.brand)}-${slugify(component.name)}`;
        console.log(`Generated ID for component: ${component.id}`);
      }
      
      // Check for required fields
      if (!component.name || !component.category) {
        errors.push(`Row ${i} is missing required fields: ${JSON.stringify(component)}`);
        continue;
      }
      
      // Set default values for missing required fields
      if (!component.brand && component.name) {
        // Try to extract brand from name
        const nameParts = component.name.split(' ');
        if (nameParts.length > 0) {
          component.brand = nameParts[0];
        } else {
          component.brand = "Unknown";
        }
      }
      
      components.push(component);
    } catch (error) {
      errors.push(`Error parsing row ${i}: ${error}`);
    }
  }
  
  return { components, errors };
};

/**
 * Import components from CSV data
 */
export const importComponentsFromCSV = (csvText: string): { 
  success: boolean,
  imported: number,
  errors: string[]
} => {
  const { components, errors } = parseComponentsCSV(csvText);
  
  // If there are any parsing errors, return them
  if (errors.length > 0) {
    return { success: false, imported: 0, errors };
  }
  
  // Process components
  try {
    let importedCount = 0;
    
    for (const component of components) {
      if (component.id && component.name && component.category && component.price !== undefined) {
        // Ensure the component has required fields and is properly typed
        const validComponent = component as PCComponentData;
        
        // Add component to storage
        addComponent(validComponent);
        importedCount++;
      }
    }
    
    // Save components to storage
    saveComponentsToStorage();
    
    return { 
      success: true, 
      imported: importedCount,
      errors: importedCount < components.length 
        ? [`${components.length - importedCount} components could not be imported due to validation errors`] 
        : []
    };
  } catch (error) {
    return { 
      success: false, 
      imported: 0, 
      errors: [`Error importing components: ${error}`] 
    };
  }
};