import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  collections, type Collection, type InsertCollection,
  pcComponents, type PCComponent, type InsertPCComponent,
  compatibilityRules, type CompatibilityRule, type InsertCompatibilityRule,
  customBuilds, type CustomBuild, type InsertCustomBuild,
  blogPosts, type BlogPost, type InsertBlogPost,
  productCollections
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray, asc } from "drizzle-orm";
import session from "express-session";
import fs from "fs";
import path from "path";

// Local storage interface
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

// Database implementation of storage interface
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Use in-memory session store for simplicity
    this.sessionStore = new session.MemoryStore();
    console.log('Using in-memory session store');
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.title);
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    // For now, just return up to 8 products
    return await db.select().from(products).limit(8);
  }
  
  async getProductByHandle(handle: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.handle, handle));
    return product;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<void> {
    // First delete related product collections
    await db
      .delete(productCollections)
      .where(eq(productCollections.productId, id));
    
    // Then delete the product
    await db
      .delete(products)
      .where(eq(products.id, id));
  }
  
  async addProductToCollection(productId: number, collectionId: number): Promise<void> {
    // Check if the relationship already exists
    const existing = await db
      .select()
      .from(productCollections)
      .where(
        and(
          eq(productCollections.productId, productId),
          eq(productCollections.collectionId, collectionId)
        )
      );
    
    // Only insert if it doesn't exist
    if (existing.length === 0) {
      await db.insert(productCollections).values({
        productId,
        collectionId
      });
    }
  }
  
  async removeProductFromCollection(productId: number, collectionId: number): Promise<void> {
    await db
      .delete(productCollections)
      .where(
        and(
          eq(productCollections.productId, productId),
          eq(productCollections.collectionId, collectionId)
        )
      );
  }

  async getProductsByCollectionId(collectionId: number): Promise<Product[]> {
    const result = await db.select({
        id: products.id,
        title: products.title,
        handle: products.handle,
        description: products.description,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        category: products.category,
        subcategory: products.subcategory,
        featuredImageUrl: products.featuredImageUrl,
        imagesUrls: products.imagesUrls,
        tags: products.tags,
        specs: products.specs,
        stock: products.stock,
        createdAt: products.createdAt
      })
      .from(products)
      .innerJoin(productCollections, eq(products.id, productCollections.productId))
      .where(eq(productCollections.collectionId, collectionId))
      .orderBy(products.title);
    
    return result;
  }
  
  // Collection methods
  async getAllCollections(): Promise<Collection[]> {
    return await db.select().from(collections).orderBy(collections.title);
  }
  
  async getCollectionByHandle(handle: string): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.handle, handle));
    return collection;
  }
  
  async createCollection(collection: InsertCollection): Promise<Collection> {
    const [newCollection] = await db.insert(collections).values(collection).returning();
    return newCollection;
  }
  
  // PC Component methods
  async getAllComponents(): Promise<PCComponent[]> {
    return await db.select().from(pcComponents);
  }
  
  async getComponentsByType(type: string): Promise<PCComponent[]> {
    return await db.select().from(pcComponents).where(eq(pcComponents.type, type));
  }
  
  async getComponentById(id: number): Promise<PCComponent | undefined> {
    const [component] = await db.select().from(pcComponents).where(eq(pcComponents.id, id));
    return component || undefined;
  }
  
  async updateComponent(id: number, componentUpdate: Partial<PCComponent>): Promise<PCComponent | undefined> {
    try {
      // Create a sanitized update object
      const sanitizedUpdate: Record<string, any> = {};
      
      // Copy over all fields except those that need special handling
      for (const key in componentUpdate) {
        if (key !== 'image' && key !== 'imageUrl' && key !== 'imagesGallery' && key !== 'inventoryStatus') {
          sanitizedUpdate[key] = (componentUpdate as any)[key];
        }
      }
      
      // Handle image field if present (client might use 'image' while DB uses 'imageUrl')
      if ('image' in componentUpdate) {
        const imageValue = (componentUpdate as any).image;
        if (!imageValue || imageValue === 'null' || imageValue === 'undefined' || (typeof imageValue === 'string' && imageValue.startsWith('blob:'))) {
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
      
      // Only update if we have sanitized fields
      if (Object.keys(sanitizedUpdate).length === 0) {
        console.warn('No valid fields to update for component', id);
        // Return the current component as is
        return await this.getComponentById(id);
      }
      
      console.log('Updating component with sanitized data:', sanitizedUpdate);
      
      const [updatedComponent] = await db
        .update(pcComponents)
        .set(sanitizedUpdate)
        .where(eq(pcComponents.id, id))
        .returning();
      return updatedComponent;
    } catch (error) {
      console.error('Error updating component in database:', error);
      throw error;
    }
  }
  
  async deleteComponent(id: number): Promise<void> {
    await db.delete(pcComponents).where(eq(pcComponents.id, id));
  }
  
  async getComponentByProductId(productId: number): Promise<PCComponent | undefined> {
    const [component] = await db.select().from(pcComponents).where(eq(pcComponents.productId, productId));
    return component;
  }
  
  async createComponent(component: InsertPCComponent): Promise<PCComponent> {
    const [newComponent] = await db.insert(pcComponents).values(component).returning();
    return newComponent;
  }
  
  // Compatibility Rule methods
  async getAllCompatibilityRules(): Promise<CompatibilityRule[]> {
    return await db.select().from(compatibilityRules);
  }
  
  async createCompatibilityRule(rule: InsertCompatibilityRule): Promise<CompatibilityRule> {
    const [newRule] = await db.insert(compatibilityRules).values(rule).returning();
    return newRule;
  }
  
  // Custom Build methods
  async getAllCustomBuilds(): Promise<CustomBuild[]> {
    return await db.select().from(customBuilds).orderBy(desc(customBuilds.createdAt));
  }
  
  async createCustomBuild(build: InsertCustomBuild): Promise<CustomBuild> {
    const [newBuild] = await db.insert(customBuilds).values(build).returning();
    return newBuild;
  }
  
  // Blog Post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }
  
  async getLatestBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
  }
  
  async getBlogPostByHandle(handle: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.handle, handle));
    return post;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }
  
  // Cart methods - temporary implementation using in-memory storage
  // In a production app, this would use the database
  private carts: Map<string, any> = new Map();
  
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

export const storage = new DatabaseStorage();