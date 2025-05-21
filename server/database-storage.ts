import {
  products, type Product, type InsertProduct,
  collections, type Collection, type InsertCollection,
  pcComponents, type PCComponent, type InsertPCComponent,
  compatibilityRules, type CompatibilityRule, type InsertCompatibilityRule,
  customBuilds, type CustomBuild, type InsertCustomBuild,
  buildComponents,
  productCollections,
  blogPosts, type BlogPost, type InsertBlogPost,
  users, type User, type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, inArray, and, desc, or, like } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductByHandle(handle: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.handle, handle));
    return product;
  }

  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    // Using direct SQL to avoid type issues with array columns
    const featuredProducts = await db.select().from(products).limit(limit);
    // Filter featured products client-side for now to avoid array column issues
    return featuredProducts.filter(product => 
      product.tags?.some(tag => 
        tag === "Featured" || tag === "featured" || tag === "FEATURED")
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, productUpdate: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productUpdate)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true; // SQLite doesn't return affected rows in the same way as some other databases
  }

  // Collection operations
  async getAllCollections(): Promise<Collection[]> {
    return await db.select().from(collections);
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.id, id));
    return collection;
  }

  async getCollectionByHandle(handle: string): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.handle, handle));
    return collection;
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const [collection] = await db.insert(collections).values(insertCollection).returning();
    return collection;
  }

  async updateCollection(id: number, collectionUpdate: Partial<Collection>): Promise<Collection | undefined> {
    const [updatedCollection] = await db
      .update(collections)
      .set(collectionUpdate)
      .where(eq(collections.id, id))
      .returning();
    return updatedCollection;
  }

  async deleteCollection(id: number): Promise<boolean> {
    await db.delete(collections).where(eq(collections.id, id));
    return true;
  }

  // PC Component operations
  async getAllComponents(): Promise<PCComponent[]> {
    return await db.select().from(pcComponents);
  }

  async getComponent(id: number): Promise<PCComponent | undefined> {
    const [component] = await db.select().from(pcComponents).where(eq(pcComponents.id, id));
    return component;
  }

  async getComponentsByType(type: string): Promise<PCComponent[]> {
    return await db.select().from(pcComponents).where(eq(pcComponents.type, type));
  }

  async getComponentByProductId(productId: number): Promise<PCComponent | undefined> {
    const [component] = await db.select().from(pcComponents).where(eq(pcComponents.productId, productId));
    return component;
  }

  async createComponent(insertComponent: InsertPCComponent): Promise<PCComponent> {
    const [component] = await db.insert(pcComponents).values(insertComponent).returning();
    return component;
  }

  async updateComponent(id: number, componentUpdate: Partial<PCComponent>): Promise<PCComponent | undefined> {
    const [updatedComponent] = await db
      .update(pcComponents)
      .set(componentUpdate)
      .where(eq(pcComponents.id, id))
      .returning();
    return updatedComponent;
  }

  async deleteComponent(id: number): Promise<boolean> {
    await db.delete(pcComponents).where(eq(pcComponents.id, id));
    return true;
  }

  // Compatibility Rules operations
  async getAllCompatibilityRules(): Promise<CompatibilityRule[]> {
    return await db.select().from(compatibilityRules);
  }

  async getCompatibilityRule(id: number): Promise<CompatibilityRule | undefined> {
    const [rule] = await db.select().from(compatibilityRules).where(eq(compatibilityRules.id, id));
    return rule;
  }

  async createCompatibilityRule(insertRule: InsertCompatibilityRule): Promise<CompatibilityRule> {
    const [rule] = await db.insert(compatibilityRules).values(insertRule).returning();
    return rule;
  }

  async updateCompatibilityRule(id: number, ruleUpdate: Partial<CompatibilityRule>): Promise<CompatibilityRule | undefined> {
    const [updatedRule] = await db
      .update(compatibilityRules)
      .set(ruleUpdate)
      .where(eq(compatibilityRules.id, id))
      .returning();
    return updatedRule;
  }

  async deleteCompatibilityRule(id: number): Promise<boolean> {
    await db.delete(compatibilityRules).where(eq(compatibilityRules.id, id));
    return true;
  }

  // Custom Build operations
  async getAllCustomBuilds(): Promise<CustomBuild[]> {
    return await db.select().from(customBuilds);
  }

  async getCustomBuild(id: number): Promise<CustomBuild | undefined> {
    const [build] = await db.select().from(customBuilds).where(eq(customBuilds.id, id));
    return build;
  }

  async getCustomBuildsByUser(userId: number): Promise<CustomBuild[]> {
    return await db.select().from(customBuilds).where(eq(customBuilds.userId, userId));
  }

  async createCustomBuild(insertBuild: InsertCustomBuild): Promise<CustomBuild> {
    const [build] = await db.insert(customBuilds).values(insertBuild).returning();
    return build;
  }

  async updateCustomBuild(id: number, buildUpdate: Partial<CustomBuild>): Promise<CustomBuild | undefined> {
    const [updatedBuild] = await db
      .update(customBuilds)
      .set(buildUpdate)
      .where(eq(customBuilds.id, id))
      .returning();
    return updatedBuild;
  }

  async deleteCustomBuild(id: number): Promise<boolean> {
    await db.delete(customBuilds).where(eq(customBuilds.id, id));
    return true;
  }

  // Blog Post operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostByHandle(handle: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.handle, handle));
    return post;
  }

  async getLatestBlogPosts(limit: number): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: number, postUpdate: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set(postUpdate)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }

  // Cart operations
  async getCart(cartId?: string): Promise<any> {
    // TODO: Implement actual cart storage in database
    return {
      id: cartId || 'cart123',
      items: [],
      totalQuantity: 0,
      totalPrice: "0.00"
    };
  }

  async updateCart(cartId: string, cartData: any): Promise<any> {
    // TODO: Implement actual cart storage in database
    return cartData;
  }
}