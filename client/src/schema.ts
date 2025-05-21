/**
 * Copy of shared schema types for client-side use
 * This file replaces @shared/schema imports for Vercel deployment compatibility
 */

import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

// Basic user type definition
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  createdAt: z.date()
});

// Create an insert schema for users (for registration)
export const insertUserSchema = createInsertSchema(userSchema).omit({ 
  id: true, 
  createdAt: true 
});

// Types derived from the schemas
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Product schema
export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  handle: z.string(),
  description: z.string(),
  price: z.string(),
  compareAtPrice: z.string().nullable(),
  category: z.string(),
  subcategory: z.string().nullable(),
  featuredImageUrl: z.string(),
  images: z.array(z.string()).nullable(),
  specs: z.unknown(),
  specsHtml: z.string().nullable(),
  createdAt: z.date()
});

export const insertProductSchema = createInsertSchema(productSchema).omit({
  id: true,
  createdAt: true
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Collection schema
export const collectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  handle: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  createdAt: z.date()
});

export const insertCollectionSchema = createInsertSchema(collectionSchema).omit({
  id: true,
  createdAt: true
});

export type Collection = z.infer<typeof collectionSchema>;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

// PC Component schema
export const pcComponentSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  price: z.string(),
  brand: z.string().nullable(),
  specs: z.unknown(),
  specsHtml: z.string().nullable(),
  imageUrl: z.string().nullable(),
  imagesGallery: z.array(z.string()).nullable(),
  inStock: z.boolean(),
  inventoryStatus: z.string().nullable(),
  productId: z.number().nullable(),
  externalId: z.string().nullable()
});

export const insertPCComponentSchema = createInsertSchema(pcComponentSchema).omit({
  id: true
});

export type PCComponent = z.infer<typeof pcComponentSchema>;
export type InsertPCComponent = z.infer<typeof insertPCComponentSchema>;

// Compatibility rule schema
export const compatibilityRuleSchema = z.object({
  id: z.number(),
  componentId: z.number(),
  compatibleWith: z.unknown()
});

export const insertCompatibilityRuleSchema = createInsertSchema(compatibilityRuleSchema).omit({
  id: true
});

export type CompatibilityRule = z.infer<typeof compatibilityRuleSchema>;
export type InsertCompatibilityRule = z.infer<typeof insertCompatibilityRuleSchema>;

// Custom build schema
export const customBuildSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  createdAt: z.date(),
  userId: z.number().nullable(),
  totalPrice: z.string()
});

export const insertCustomBuildSchema = createInsertSchema(customBuildSchema).omit({
  id: true,
  createdAt: true
});

export type CustomBuild = z.infer<typeof customBuildSchema>;
export type InsertCustomBuild = z.infer<typeof insertCustomBuildSchema>;

// Blog post schema
export const blogPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  handle: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  imageUrl: z.string().nullable(),
  author: z.string().nullable(),
  category: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  publishedAt: z.date().nullable(),
  createdAt: z.date()
});

export const insertBlogPostSchema = createInsertSchema(blogPostSchema).omit({
  id: true,
  createdAt: true
});

export type BlogPost = z.infer<typeof blogPostSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
