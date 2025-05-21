/**
 * Local Storage Implementation
 * Complete replacement for database storage that uses local JSON files
 */
import fs from 'fs';
import path from 'path';
import { 
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Collection, type InsertCollection,
  type PCComponent, type InsertPCComponent,
  type CompatibilityRule, type InsertCompatibilityRule,
  type CustomBuild, type InsertCustomBuild,
  type BlogPost, type InsertBlogPost
} from "@shared/schema";
import session from "express-session";

// Setup data directory
const DATA_DIR = path.join(process.cwd(), 'public', 'data');

// File paths for all data
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const COLLECTIONS_FILE = path.join(DATA_DIR, 'collections.json');
const COMPONENTS_FILE = path.join(DATA_DIR, 'components.json');
const RULES_FILE = path.join(DATA_DIR, 'rules.json');
const BUILDS_FILE = path.join(DATA_DIR, 'builds.json');
const BLOG_FILE = path.join(DATA_DIR, 'blog.json');
const PRODUCT_COLLECTIONS_FILE = path.join(DATA_DIR, 'product_collections.json');

// Make sure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('Created data directory:', DATA_DIR);
}

// Initialize files with empty arrays if they don't exist
const files = [
  USERS_FILE, PRODUCTS_FILE, COLLECTIONS_FILE, COMPONENTS_FILE,
  RULES_FILE, BUILDS_FILE, BLOG_FILE, PRODUCT_COLLECTIONS_FILE
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([]));
    console.log(`Created empty data file: ${path.basename(file)}`);
  }
}

// Helper to read data from a file
function readData<T>(filePath: string): T[] {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Helper to write data to a file
function writeData<T>(filePath: string, data: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

// Helper to get the next ID for a collection
function getNextId<T extends { id: number }>(items: T[]): number {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// Storage interface implementation
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductByHandle(handle: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  getProductsByCollectionId(collectionId: number): Promise<Product[]>;
  addProductToCollection(productId: number, collectionId: number): Promise<void>;
  removeProductFromCollection(productId: number, collectionId: number): Promise<void>;
  
  // Collections
  getAllCollections(): Promise<Collection[]>;
  getCollectionByHandle(handle: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  
  // PC Components
  getAllComponents(): Promise<PCComponent[]>;
  getComponentsByType(type: string): Promise<PCComponent[]>;
  getComponentById(id: number): Promise<PCComponent | undefined>;
  getComponentByProductId(productId: number): Promise<PCComponent | undefined>;
  createComponent(component: InsertPCComponent): Promise<PCComponent>;
  updateComponent(id: number, component: Partial<PCComponent>): Promise<PCComponent | undefined>;
  deleteComponent(id: number): Promise<void>;
  
  // Compatibility Rules
  getAllCompatibilityRules(): Promise<CompatibilityRule[]>;
  createCompatibilityRule(rule: InsertCompatibilityRule): Promise<CompatibilityRule>;
  
  // Custom Builds
  getAllCustomBuilds(): Promise<CustomBuild[]>;
  createCustomBuild(build: InsertCustomBuild): Promise<CustomBuild>;
  
  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getLatestBlogPosts(limit?: number): Promise<BlogPost[]>;
  getBlogPostByHandle(handle: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Cart
  getCart(userId?: number): Promise<any>;
  updateCart(cartId: string, cartData: any): Promise<any>;
  
  // Session store
  sessionStore: session.Store;
}

export class LocalStorage implements IStorage {
  sessionStore: session.Store;
  private carts: Map<string, any> = new Map();
  
  constructor() {
    this.sessionStore = new session.MemoryStore();
    console.log('Using in-memory session store');
  }
  
  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    const users = readData<User>(USERS_FILE);
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = readData<User>(USERS_FILE);
    return users.find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = readData<User>(USERS_FILE);
    return users.find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = readData<User>(USERS_FILE);
    const id = getNextId(users);
    
    const user: User = {
      id,
      ...insertUser,
      createdAt: new Date()
    };
    
    users.push(user);
    writeData(USERS_FILE, users);
    return user;
  }
  
  // PRODUCT METHODS
  async getAllProducts(): Promise<Product[]> {
    return readData<Product>(PRODUCTS_FILE);
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    const products = readData<Product>(PRODUCTS_FILE);
    // Just return up to 8 products for now
    return products.slice(0, 8);
  }
  
  async getProductByHandle(handle: string): Promise<Product | undefined> {
    const products = readData<Product>(PRODUCTS_FILE);
    return products.find(product => product.handle === handle);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const products = readData<Product>(PRODUCTS_FILE);
    const id = getNextId(products);
    
    const newProduct: Product = {
      id,
      ...product,
      createdAt: new Date()
    };
    
    products.push(newProduct);
    writeData(PRODUCTS_FILE, products);
    return newProduct;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const products = readData<Product>(PRODUCTS_FILE);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return undefined;
    
    const updatedProduct = {
      ...products[index],
      ...productUpdate
    };
    
    products[index] = updatedProduct;
    writeData(PRODUCTS_FILE, products);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<void> {
    // First delete from product collections
    const productCollections = readData<{ productId: number, collectionId: number }>(PRODUCT_COLLECTIONS_FILE);
    const filteredProductCollections = productCollections.filter(pc => pc.productId !== id);
    writeData(PRODUCT_COLLECTIONS_FILE, filteredProductCollections);
    
    // Then delete the product
    const products = readData<Product>(PRODUCTS_FILE);
    const filteredProducts = products.filter(p => p.id !== id);
    writeData(PRODUCTS_FILE, filteredProducts);
  }
  
  async addProductToCollection(productId: number, collectionId: number): Promise<void> {
    const productCollections = readData<{ productId: number, collectionId: number }>(PRODUCT_COLLECTIONS_FILE);
    
    // Check if it already exists
    const exists = productCollections.some(
      pc => pc.productId === productId && pc.collectionId === collectionId
    );
    
    if (!exists) {
      productCollections.push({ productId, collectionId });
      writeData(PRODUCT_COLLECTIONS_FILE, productCollections);
    }
  }
  
  async removeProductFromCollection(productId: number, collectionId: number): Promise<void> {
    const productCollections = readData<{ productId: number, collectionId: number }>(PRODUCT_COLLECTIONS_FILE);
    const filtered = productCollections.filter(
      pc => !(pc.productId === productId && pc.collectionId === collectionId)
    );
    writeData(PRODUCT_COLLECTIONS_FILE, filtered);
  }
  
  async getProductsByCollectionId(collectionId: number): Promise<Product[]> {
    const productCollections = readData<{ productId: number, collectionId: number }>(PRODUCT_COLLECTIONS_FILE);
    const products = readData<Product>(PRODUCTS_FILE);
    
    // Get product IDs that belong to this collection
    const productIds = productCollections
      .filter(pc => pc.collectionId === collectionId)
      .map(pc => pc.productId);
    
    // Return the products that match these IDs
    return products.filter(p => productIds.includes(p.id));
  }
  
  // COLLECTION METHODS
  async getAllCollections(): Promise<Collection[]> {
    return readData<Collection>(COLLECTIONS_FILE);
  }
  
  async getCollectionByHandle(handle: string): Promise<Collection | undefined> {
    const collections = readData<Collection>(COLLECTIONS_FILE);
    return collections.find(c => c.handle === handle);
  }
  
  async createCollection(collection: InsertCollection): Promise<Collection> {
    const collections = readData<Collection>(COLLECTIONS_FILE);
    const id = getNextId(collections);
    
    const newCollection: Collection = {
      id,
      ...collection,
      createdAt: new Date()
    };
    
    collections.push(newCollection);
    writeData(COLLECTIONS_FILE, collections);
    return newCollection;
  }
  
  // PC COMPONENT METHODS
  async getAllComponents(): Promise<PCComponent[]> {
    return readData<PCComponent>(COMPONENTS_FILE);
  }
  
  async getComponentsByType(type: string): Promise<PCComponent[]> {
    const components = readData<PCComponent>(COMPONENTS_FILE);
    return components.filter(c => c.type === type);
  }
  
  async getComponentById(id: number): Promise<PCComponent | undefined> {
    const components = readData<PCComponent>(COMPONENTS_FILE);
    return components.find(c => c.id === id);
  }
  
  async getComponentByProductId(productId: number): Promise<PCComponent | undefined> {
    const components = readData<PCComponent>(COMPONENTS_FILE);
    return components.find(c => c.productId === productId);
  }
  
  async createComponent(component: InsertPCComponent): Promise<PCComponent> {
    const components = readData<PCComponent>(COMPONENTS_FILE);
    const id = getNextId(components);
    
    // Set defaults for optional fields
    const newComponent: PCComponent = {
      id,
      ...component,
      inStock: component.inStock ?? true,
      brand: component.brand ?? null,
      specsHtml: component.specsHtml ?? null,
      imageUrl: component.imageUrl ?? null,
      imagesGallery: component.imagesGallery ?? null,
      inventoryStatus: component.inventoryStatus ?? "in-stock",
      productId: component.productId ?? null,
      externalId: component.externalId ?? null
    };
    
    components.push(newComponent);
    writeData(COMPONENTS_FILE, components);
    return newComponent;
  }
  
  async updateComponent(id: number, componentUpdate: Partial<PCComponent>): Promise<PCComponent | undefined> {
    const components = readData<PCComponent>(COMPONENTS_FILE);
    const index = components.findIndex(c => c.id === id);
    
    if (index === -1) return undefined;
    
    // Create a sanitized update object
    const sanitizedUpdate: Record<string, any> = {};
    
    // Copy over all fields except those that need special handling
    for (const key in componentUpdate) {
      if (key !== 'image' && key !== 'imageUrl' && key !== 'imagesGallery' && key !== 'inventoryStatus') {
        sanitizedUpdate[key] = (componentUpdate as any)[key];
      }
    }
    
    // Handle image field if present
    if ('image' in componentUpdate) {
      const imageValue = (componentUpdate as any).image;
      if (!imageValue || imageValue === 'null' || imageValue === 'undefined' || 
          (typeof imageValue === 'string' && imageValue.startsWith('blob:'))) {
        sanitizedUpdate.imageUrl = `/default-${(componentUpdate as any).type || 'component'}.jpg`;
      } else {
        sanitizedUpdate.imageUrl = imageValue;
      }
    } else if (componentUpdate.imageUrl) {
      if (componentUpdate.imageUrl === 'null' || componentUpdate.imageUrl === 'undefined' || 
          (typeof componentUpdate.imageUrl === 'string' && componentUpdate.imageUrl.startsWith('blob:'))) {
        sanitizedUpdate.imageUrl = `/default-${componentUpdate.type || 'component'}.jpg`;
      } else {
        sanitizedUpdate.imageUrl = componentUpdate.imageUrl;
      }
    }
    
    // Handle gallery images if present
    if (componentUpdate.imagesGallery && Array.isArray(componentUpdate.imagesGallery)) {
      sanitizedUpdate.imagesGallery = componentUpdate.imagesGallery.filter(img => 
        img && typeof img === 'string' && !img.startsWith('blob:') && img.includes('/')
      );
    }
    
    // Handle inventory status if present
    if (componentUpdate.inventoryStatus) {
      // Make sure it's a valid value
      const validStatuses = ['in-stock', 'out-of-stock', 'pre-order'];
      sanitizedUpdate.inventoryStatus = validStatuses.includes(componentUpdate.inventoryStatus as string) 
        ? componentUpdate.inventoryStatus 
        : 'in-stock';
    }
    
    // Update the component
    const updatedComponent = {
      ...components[index],
      ...sanitizedUpdate
    };
    
    components[index] = updatedComponent;
    writeData(COMPONENTS_FILE, components);
    return updatedComponent;
  }
  
  async deleteComponent(id: number): Promise<void> {
    const components = readData<PCComponent>(COMPONENTS_FILE);
    const filteredComponents = components.filter(c => c.id !== id);
    writeData(COMPONENTS_FILE, filteredComponents);
  }
  
  // COMPATIBILITY RULE METHODS
  async getAllCompatibilityRules(): Promise<CompatibilityRule[]> {
    return readData<CompatibilityRule>(RULES_FILE);
  }
  
  async createCompatibilityRule(rule: InsertCompatibilityRule): Promise<CompatibilityRule> {
    const rules = readData<CompatibilityRule>(RULES_FILE);
    const id = getNextId(rules);
    
    const newRule: CompatibilityRule = {
      id,
      ...rule,
      createdAt: new Date()
    };
    
    rules.push(newRule);
    writeData(RULES_FILE, rules);
    return newRule;
  }
  
  // CUSTOM BUILD METHODS
  async getAllCustomBuilds(): Promise<CustomBuild[]> {
    const builds = readData<CustomBuild>(BUILDS_FILE);
    // Sort by creation date, newest first
    return builds.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async createCustomBuild(build: InsertCustomBuild): Promise<CustomBuild> {
    const builds = readData<CustomBuild>(BUILDS_FILE);
    const id = getNextId(builds);
    
    const newBuild: CustomBuild = {
      id,
      ...build,
      createdAt: new Date()
    };
    
    builds.push(newBuild);
    writeData(BUILDS_FILE, builds);
    return newBuild;
  }
  
  // BLOG POST METHODS
  async getAllBlogPosts(): Promise<BlogPost[]> {
    const posts = readData<BlogPost>(BLOG_FILE);
    // Sort by publish date, newest first
    return posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
  
  async getLatestBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    const posts = await this.getAllBlogPosts();
    return posts.slice(0, limit);
  }
  
  async getBlogPostByHandle(handle: string): Promise<BlogPost | undefined> {
    const posts = readData<BlogPost>(BLOG_FILE);
    return posts.find(p => p.handle === handle);
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const posts = readData<BlogPost>(BLOG_FILE);
    const id = getNextId(posts);
    
    const newPost: BlogPost = {
      id,
      ...post,
      createdAt: new Date()
    };
    
    posts.push(newPost);
    writeData(BLOG_FILE, posts);
    return newPost;
  }
  
  // CART METHODS
  async getCart(userId?: number): Promise<any> {
    const cartId = userId ? `cart-${userId}` : 'default-cart-id';
    
    // Check if cart exists in memory
    if (this.carts.has(cartId)) {
      return this.carts.get(cartId);
    }
    
    // Create new empty cart
    const newCart = {
      id: cartId,
      items: [],
      totalQuantity: 0,
      totalPrice: "0.00"
    };
    
    // Store and return the new cart
    this.carts.set(cartId, newCart);
    return newCart;
  }
  
  async updateCart(cartId: string, cartData: any): Promise<any> {
    // Store updated cart data
    this.carts.set(cartId, cartData);
    return cartData;
  }
}

// Export the storage instance
export const storage = new LocalStorage();