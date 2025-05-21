// Define inventory status types
export type InventoryStatus = 'in-stock' | 'out-of-stock' | 'pre-order';

// Define PC Component data interface
export interface PCComponentData {
  id: string;
  name: string;
  type: string;
  price: string | number;
  image?: string;
  imagesGallery?: string[];
  brand?: string | null;
  specs: Record<string, any>;
  specsHtml?: string | null;
  inStock: boolean;
  inventoryStatus?: InventoryStatus | 'in_stock' | 'out_of_stock' | 'preorder';
  productId?: number;
}

// Define component selection interface
export interface ComponentSelection {
  id: string;
  name: string;
  price: number;
  image?: string;
  imagesGallery?: string[];
}

// Define upload response interface
export interface UploadResponse {
  success: boolean;
  filePath: string;
  error?: string;
}