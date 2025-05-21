import fs from 'fs';
import path from 'path';
import { PCComponentData } from '../../client/src/lib/componentData';

const BACKUP_DIR = './public/backups';
const COMPONENTS_CSV_PATH = path.join(BACKUP_DIR, 'components.csv');
const UPLOADS_DIR = './attached_assets';

/**
 * Ensures the backup directory exists
 */
export const ensureBackupDirectory = (): void => {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`Created backup directory at ${BACKUP_DIR}`);
  }
};

/**
 * Converts component data to CSV format
 * @param components Record of component arrays by category
 * @returns CSV string with headers
 */
export const generateComponentsCsv = (
  components: Record<string, PCComponentData[]>
): string => {
  // Headers for the CSV
  const headers = [
    'Category',
    'ID',
    'Name',
    'Brand',
    'Price',
    'Description',
    'Image URL',
    'Inventory Status',
    'Stock Quantity',
    'Specifications'
  ].join('\t');
  
  // Rows for each component
  const rows: string[] = [];
  
  // Process each category and component
  Object.keys(components).forEach(category => {
    if (!components[category] || !Array.isArray(components[category])) return;
    
    components[category].forEach((component: PCComponentData) => {
      // Handle specifications - strip HTML tags and convert to string
      let specs = '';
      if (component.specsHtml) {
        // Use HTML specs if available
        specs = component.specsHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      } else if (component.specs) {
        // Otherwise convert specs object to string
        specs = Object.entries(component.specs)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ');
      }
      
      // Create row with all fields
      const row = [
        category,
        component.id || '',
        component.name || '',
        component.brand || '',
        component.price?.toString() || '',
        component.description || '',
        component.image || '',
        component.inventoryStatus || 'In Stock', // Default to In Stock
        component.inStock ? 'Yes' : 'No', // Convert boolean to string
        specs
      ].map(field => {
        // Wrap fields with tabs or newlines in quotes
        if (field.includes('\t') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join('\t');
      
      rows.push(row);
    });
  });
  
  // Combine headers and rows
  return [headers, ...rows].join('\n');
};

/**
 * Saves component data to a CSV file in the public directory
 * @param components Record of component arrays by category 
 */
export const saveComponentsToCsv = (
  components: Record<string, PCComponentData[]>
): void => {
  try {
    ensureBackupDirectory();
    
    const csvData = generateComponentsCsv(components);
    fs.writeFileSync(COMPONENTS_CSV_PATH, csvData, 'utf8');
    
    console.log(`Components backed up to ${COMPONENTS_CSV_PATH}`);
    
    // Also create a timestamped backup
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const timestampedPath = path.join(BACKUP_DIR, `components_${timestamp}.csv`);
    fs.writeFileSync(timestampedPath, csvData, 'utf8');
    
    // Keep only the last 5 timestamped backups
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('components_') && file.endsWith('.csv'))
      .sort()
      .reverse();
    
    if (files.length > 5) {
      const filesToDelete = files.slice(5);
      filesToDelete.forEach(file => {
        fs.unlinkSync(path.join(BACKUP_DIR, file));
      });
    }
  } catch (error) {
    console.error('Error saving components to CSV:', error);
  }
};

/**
 * Parses a CSV file and converts it to component data
 * @param filePath Path to the CSV file
 * @returns Record of component arrays by category
 */
export const parseComponentsFromCsv = (
  filePath: string
): Record<string, PCComponentData[]> => {
  try {
    // Try to read with different encodings if UTF-8 fails
    let fileContent;
    try {
      fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      // Try Latin1 (ISO-8859-1) encoding instead
      try {
        console.log('UTF-8 encoding failed, trying Latin1 encoding');
        fileContent = fs.readFileSync(filePath, 'latin1');
      } catch (backupError) {
        // Last resort: read as binary and convert
        try {
          console.log('Latin1 encoding failed, trying binary read');
          const buffer = fs.readFileSync(filePath);
          
          // Try to detect BOM for UTF-16
          if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
            console.log('Detected UTF-16LE BOM');
            // Convert UTF-16LE to UTF-8
            const utf16leString = buffer.toString('utf16le', 2); // Skip BOM
            fileContent = utf16leString;
          } else if (buffer.length >= 2 && buffer[0] === 0xFE && buffer[1] === 0xFF) {
            console.log('Detected UTF-16BE BOM');
            // Convert UTF-16BE to UTF-8
            const utf16beString = buffer.slice(2).swap16().toString('utf16le'); // Skip BOM and swap bytes
            fileContent = utf16beString;
          } else {
            // No BOM detected, just try latin1 as a last resort
            fileContent = buffer.toString('latin1');
          }
        } catch (binaryError) {
          console.error('All encoding methods failed:', binaryError);
          throw new Error('Unable to read file with any supported encoding');
        }
      }
    }
    
    // Handle Excel CSV format which might use \r\n or \r as line breaks
    // Normalize line endings to \n
    fileContent = fileContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Handle potential Excel/UTF-16 BOM (byte order mark)
    if (fileContent.charCodeAt(0) === 65279) {
      fileContent = fileContent.slice(1);
    }
    
    // Detect delimiter (tab or comma)
    const firstLine = fileContent.split('\n')[0];
    const delimiter = firstLine.includes('\t') ? '\t' : ',';
    console.log(`Detected delimiter: ${delimiter === '\t' ? 'tab' : 'comma'}`);
    
    // Parse CSV
    const lines = fileContent.split('\n');
    if (lines.length <= 1) {
      console.error('Invalid CSV file: Not enough lines');
      return {};
    }
    
    // Extract headers (normalize to ensure case-insensitive matching)
    const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
    
    // Find index of each important column (more flexible matching)
    const categoryIndex = headers.findIndex(h => h.includes('category') || h.includes('type'));
    const idIndex = headers.findIndex(h => h === 'id' || h.includes('productid') || h.includes('product id') || h.includes('itemid') || h.includes('item id'));
    const nameIndex = headers.findIndex(h => h === 'name' || h.includes('title') || h.includes('product name'));
    const brandIndex = headers.findIndex(h => h === 'brand' || h.includes('manufacturer') || h.includes('make'));
    const priceIndex = headers.findIndex(h => h === 'price' || h.includes('cost') || h.includes('value'));
    const descriptionIndex = headers.findIndex(h => h === 'description' || h.includes('desc') || h.includes('details'));
    const imageUrlIndex = headers.findIndex(h => h.includes('image') || h.includes('url') || h.includes('picture') || h.includes('photo'));
    const inventoryStatusIndex = headers.findIndex(h => h.includes('inventory') || h.includes('status') || h.includes('stock status'));
    const stockQuantityIndex = headers.findIndex(h => h.includes('stock') || h.includes('quantity') || h.includes('count'));
    const inStockIndex = headers.findIndex(h => h.includes('in stock') || h.includes('available'));
    const specificationsIndex = headers.findIndex(h => h.includes('specifications') || h.includes('specs') || h.includes('spec') || h.includes('features'));
    
    // Initialize result
    const result: Record<string, PCComponentData[]> = {};
    
    // Process data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle quoted fields with delimiters inside them
      const fields: string[] = [];
      let field = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          if (inQuotes && j + 1 < line.length && line[j + 1] === '"') {
            // Escaped quote inside quotes
            field += '"';
            j++; // Skip the next quote
          } else {
            // Toggle quote mode
            inQuotes = !inQuotes;
          }
        } else if (char === delimiter && !inQuotes) {
          // End of field
          fields.push(field);
          field = '';
        } else {
          field += char;
        }
      }
      
      // Add the last field
      fields.push(field);
      
      // Extract fields
      let category = categoryIndex >= 0 ? fields[categoryIndex] : '';
      const id = idIndex >= 0 ? fields[idIndex] : `comp-${i}`;
      const name = nameIndex >= 0 ? fields[nameIndex] : '';
      const brand = brandIndex >= 0 ? fields[brandIndex] : '';
      const priceStr = priceIndex >= 0 ? fields[priceIndex] : '0';
      const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      const description = descriptionIndex >= 0 ? fields[descriptionIndex] : '';
      const image = imageUrlIndex >= 0 ? fields[imageUrlIndex] : '';
      const inventoryStatus = inventoryStatusIndex >= 0 ? fields[inventoryStatusIndex] : 'in-stock';
      const inStockValue = inStockIndex >= 0 ? fields[inStockIndex].toLowerCase() : 'yes';
      const inStock = inStockValue === 'yes' || inStockValue === 'true' || inStockValue === '1' || inStockValue === 'in stock';
      const specifications = specificationsIndex >= 0 ? fields[specificationsIndex] : '';
      
      // Skip rows without name
      if (!name) continue;
      
      // Auto-detect category if none is provided
      if (!category) {
        // Try to detect from name
        const nameLower = name.toLowerCase();
        
        if (nameLower.includes('cpu') || 
            nameLower.includes('processor') || 
            nameLower.includes('ryzen') || 
            nameLower.includes('intel') ||
            nameLower.includes('core i') ||
            nameLower.includes('core ultra')) {
          category = 'cpu';
        } else if (nameLower.includes('gpu') || 
                 nameLower.includes('graphics') || 
                 nameLower.includes('video card') || 
                 nameLower.includes('geforce') ||
                 nameLower.includes('rtx') ||
                 nameLower.includes('radeon')) {
          category = 'gpu';
        } else if (nameLower.includes('ram') || 
                 nameLower.includes('memory') || 
                 nameLower.includes('ddr')) {
          category = 'memory';
        } else if (nameLower.includes('ssd') || 
                 nameLower.includes('hdd') || 
                 nameLower.includes('storage') ||
                 nameLower.includes('drive')) {
          category = 'storage';
        } else if (nameLower.includes('motherboard') || 
                 nameLower.includes('mainboard')) {
          category = 'motherboard';
        } else if (nameLower.includes('case') ||
                 nameLower.includes('chassis')) {
          category = 'case';
        } else if (nameLower.includes('psu') || 
                 nameLower.includes('power supply')) {
          category = 'power';
        } else if (nameLower.includes('cooler') || 
                 nameLower.includes('cooling') || 
                 nameLower.includes('fan')) {
          category = 'cooling';
        } else {
          // Default to cpu if we can't detect
          category = 'cpu';
          console.log(`Could not detect category for "${name}", defaulting to cpu`);
        }
      }
      
      // Skip rows that still don't have a category
      if (!category) continue;
      
      // Create component data
      const component: PCComponentData = {
        id: id,
        name,
        description,
        price,
        brand,
        image,
        inStock: inStock || inventoryStatus.toLowerCase().includes('in stock'),
        inventoryStatus: (inventoryStatus.toLowerCase().includes('pre') ? 'pre-order' : 
                         (inStock || inventoryStatus.toLowerCase().includes('in stock')) ? 'in-stock' : 'out-of-stock') as any,
        category,
      };
      
      // Parse specifications - handle various formats
      if (specifications) {
        component.specs = {};
        
        // Detect format: semicolon with colons (key: value; key: value)
        if (specifications.includes(':') && specifications.includes(';')) {
          const specPairs = specifications.split(';');
          specPairs.forEach(pair => {
            const colonIndex = pair.indexOf(':');
            if (colonIndex > 0) {
              const key = pair.substring(0, colonIndex).trim();
              const value = pair.substring(colonIndex + 1).trim();
              if (key && value) {
                component.specs[key] = value;
              }
            }
          });
        } 
        // Detect format: comma separated with equals (key=value, key=value)
        else if (specifications.includes('=') && specifications.includes(',')) {
          const specPairs = specifications.split(',');
          specPairs.forEach(pair => {
            const equalsIndex = pair.indexOf('=');
            if (equalsIndex > 0) {
              const key = pair.substring(0, equalsIndex).trim();
              const value = pair.substring(equalsIndex + 1).trim();
              if (key && value) {
                component.specs[key] = value;
              }
            }
          });
        }
        // Just treat as plain text otherwise
        else {
          component.specs.description = specifications;
        }
        
        // Create HTML representation
        if (Object.keys(component.specs).length > 0) {
          component.specsHtml = '<ul>' + 
            Object.entries(component.specs)
              .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
              .join('') + 
            '</ul>';
        } else {
          component.specsHtml = `<p>${specifications}</p>`;
        }
      }
      
      // Add to result
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(component);
    }
    
    return result;
  } catch (error) {
    console.error('Error parsing components from CSV:', error);
    return {};
  }
};

/**
 * Restores components from a CSV file and saves them to the database
 * @param filePath Path to the CSV file
 * @param saveToDb Whether to save the imported components to the database
 * @returns Record of component arrays by category
 */
export const restoreComponentsFromCsv = async (
  filePath: string,
  saveToDb: boolean = true
): Promise<{
  success: boolean;
  message: string;
  components?: Record<string, PCComponentData[]>;
}> => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        message: `File not found: ${filePath}`
      };
    }
    
    // Parse components from CSV
    const components = parseComponentsFromCsv(filePath);
    
    // Count total components
    let totalComponents = 0;
    Object.values(components).forEach(categoryComponents => {
      totalComponents += categoryComponents.length;
    });
    
    if (totalComponents === 0) {
      return {
        success: false,
        message: 'No valid components found in the CSV file'
      };
    }
    
    // Save to database if requested
    if (saveToDb) {
      let savedCount = 0;
      
      // Process each component and save to the database
      for (const category of Object.keys(components)) {
        for (const component of components[category]) {
          try {
            // Prepare component data for API
            const apiComponent = {
              id: null, // New component
              name: component.name,
              type: category,
              specs: component.specs || {},
              specsHtml: component.specsHtml || '',
              price: component.price.toString(),
              imageUrl: component.image || '',
              inStock: component.inStock || true,
              inventoryStatus: component.inventoryStatus || 'in-stock',
              brand: component.brand || ''
            };
            
            // Send to API endpoint
            const response = await fetch('http://localhost:5000/api/components', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(apiComponent),
            });
            
            if (response.ok) {
              savedCount++;
            }
          } catch (saveError) {
            console.error(`Error saving component ${component.name} to database:`, saveError);
          }
        }
      }
      
      return {
        success: true,
        message: `Successfully restored ${savedCount} out of ${totalComponents} components`,
        components
      };
    }
    
    return {
      success: true,
      message: `Successfully parsed ${totalComponents} components from CSV`,
      components
    };
  } catch (error) {
    console.error('Error restoring components from CSV:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
};