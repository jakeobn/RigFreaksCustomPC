import { pgTable, text, serial, integer, boolean, jsonb, timestamp, decimal, varchar, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  handle: text("handle").notNull().unique(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  featuredImageUrl: text("featured_image_url").notNull(),
  imagesUrls: text("images_urls").array(),
  tags: text("tags").array(),
  specs: jsonb("specs").notNull(),
  specsHtml: text("specs_html"),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ many }) => ({
  productCollections: many(productCollections),
}));

// Collection schema
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  handle: text("handle").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  productCollections: many(productCollections),
}));

// Join table for many-to-many relationship between products and collections
export const productCollections = pgTable("product_collections", {
  productId: integer("product_id").notNull().references(() => products.id),
  collectionId: integer("collection_id").notNull().references(() => collections.id),
}, (t) => ({
  pk: primaryKey(t.productId, t.collectionId),
}));

export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  product: one(products, {
    fields: [productCollections.productId],
    references: [products.id],
  }),
  collection: one(collections, {
    fields: [productCollections.collectionId],
    references: [collections.id],
  }),
}));

// PC Builder Component Categories
export const pcComponents = pgTable("pc_components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // CPU, GPU, RAM, etc.
  specs: jsonb("specs").notNull(),
  specsHtml: text("specs_html"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  imagesGallery: text("images_gallery").array(),
  inStock: boolean("in_stock").notNull().default(true),
  inventoryStatus: text("inventory_status").default('in-stock'),
  productId: integer("product_id").references(() => products.id), // Reference to Shopify product
  brand: text("brand"),
  externalId: text("external_id"), // To store the original component ID during migration
});

export const pcComponentsRelations = relations(pcComponents, ({ many, one }) => ({
  compatibilityRules: many(compatibilityRules),
  buildComponents: many(buildComponents),
  product: one(products, {
    fields: [pcComponents.productId],
    references: [products.id],
  }),
}));

// Build Compatibility Rules
export const compatibilityRules = pgTable("compatibility_rules", {
  id: serial("id").primaryKey(),
  componentId: integer("component_id").notNull().references(() => pcComponents.id),
  compatibleWith: jsonb("compatible_with").notNull(), // { type: [compatible_ids] }
});

export const compatibilityRulesRelations = relations(compatibilityRules, ({ one }) => ({
  component: one(pcComponents, {
    fields: [compatibilityRules.componentId],
    references: [pcComponents.id],
  }),
}));

// Custom Build
export const customBuilds = pgTable("custom_builds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const customBuildsRelations = relations(customBuilds, ({ one, many }) => ({
  user: one(users, {
    fields: [customBuilds.userId],
    references: [users.id],
  }),
  buildComponents: many(buildComponents),
}));

// Join table for components in a build
export const buildComponents = pgTable("build_components", {
  buildId: integer("build_id").notNull().references(() => customBuilds.id),
  componentId: integer("component_id").notNull().references(() => pcComponents.id),
  componentType: text("component_type").notNull(),
}, (t) => ({
  pk: primaryKey(t.buildId, t.componentId),
}));

export const buildComponentsRelations = relations(buildComponents, ({ one }) => ({
  build: one(customBuilds, {
    fields: [buildComponents.buildId],
    references: [customBuilds.id],
  }),
  component: one(pcComponents, {
    fields: [buildComponents.componentId],
    references: [pcComponents.id],
  }),
}));

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  handle: text("handle").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  author: text("author").notNull(),
  imageUrl: text("image_url"),
  tags: text("tags").array(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User Account
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  customBuilds: many(customBuilds),
}));

// Insert Schemas
export const insertProductSchema = createInsertSchema(products, {
  price: z.string(),
  compareAtPrice: z.string().optional(),
}).omit({ id: true, createdAt: true });

export const insertCollectionSchema = createInsertSchema(collections).omit({ id: true, createdAt: true });

export const insertPCComponentSchema = createInsertSchema(pcComponents, {
  price: z.string(),
}).omit({ id: true });

export const insertCompatibilityRuleSchema = createInsertSchema(compatibilityRules).omit({ id: true });

export const insertCustomBuildSchema = createInsertSchema(customBuilds, {
  totalPrice: z.string(),
}).omit({ id: true, createdAt: true });

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true });

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export type PCComponent = typeof pcComponents.$inferSelect;
export type InsertPCComponent = z.infer<typeof insertPCComponentSchema>;

export type CompatibilityRule = typeof compatibilityRules.$inferSelect;
export type InsertCompatibilityRule = z.infer<typeof insertCompatibilityRuleSchema>;

export type CustomBuild = typeof customBuilds.$inferSelect;
export type InsertCustomBuild = z.infer<typeof insertCustomBuildSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
