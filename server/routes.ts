import express, { type Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./local-storage";
import { db } from "./db";
import { 
  insertProductSchema, 
  insertCollectionSchema, 
  insertPCComponentSchema, 
  insertCustomBuildSchema, 
  insertCompatibilityRuleSchema, 
  insertBlogPostSchema,
  products
} from "@shared/schema";
import { eq } from "drizzle-orm";
import paymentRoutes from './routes/payment-routes';
import componentBackupRoutes from './routes/componentBackup';
import xmlRoutes from './routes/xmlRoutes'; // Import XML routes
import uploadRoutes from './routes/uploads'; // Import upload routes
import imagesRoutes from './routes/images'; // Import image routes
import debugRoutes from './routes/debug'; // Import debug routes
import { setupAuth } from "./auth"; // Keep old auth for backward compatibility
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication system - we'll keep the old one for backwards compatibility
  setupAuth(app);

  // Using local file storage instead of Supabase
  console.log('Using local file storage for data persistence');

  // Setup middleware for XML body parsing
  app.use('/api/xml', express.text({ type: 'application/xml' }));

  // Register component backup routes
  app.use('/api/components', componentBackupRoutes);

  // Supabase component routes removed

  // Register Image migration routes
  app.use('/', imagesRoutes);

  // Register debug routes
  app.use('/api', debugRoutes);

  // Supabase auth routes removed

  // Health check endpoint for Render
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Register XML API routes
  app.use('/', xmlRoutes);

  // Register file upload routes
  app.use('/api/uploads', uploadRoutes);

  // Serve backup files
  app.use('/backups', express.static(path.join(process.cwd(), 'public/backups')));

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

  // Static pages
  app.get("/pages/privacy-policy", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client/public/pages/privacy-policy.html"));
  });

  app.get("/pages/terms-of-service", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client/public/pages/terms-of-service.html"));
  });

  // Products API routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const featuredProducts = await storage.getFeaturedProducts();
      res.json(featuredProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Error fetching featured products" });
    }
  });

  app.get("/api/products/:handle", async (req, res) => {
    try {
      const product = await storage.getProductByHandle(req.params.handle);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      await storage.deleteProduct(productId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Error deleting product" });
    }
  });

  // Product-Collection relationship management
  app.post("/api/product-collections", async (req, res) => {
    try {
      const { productId, collectionId } = req.body;

      if (!productId || !collectionId) {
        return res.status(400).json({ message: "Product ID and Collection ID are required" });
      }

      await storage.addProductToCollection(parseInt(productId), parseInt(collectionId));
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error adding product to collection:", error);
      res.status(500).json({ message: "Error adding product to collection" });
    }
  });

  app.delete("/api/product-collections", async (req, res) => {
    try {
      const { productId, collectionId } = req.body;

      if (!productId || !collectionId) {
        return res.status(400).json({ message: "Product ID and Collection ID are required" });
      }

      await storage.removeProductFromCollection(parseInt(productId), parseInt(collectionId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing product from collection:", error);
      res.status(500).json({ message: "Error removing product from collection" });
    }
  });

  // Collections API routes
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getAllCollections();
      res.json(collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      res.status(500).json({ message: "Error fetching collections" });
    }
  });

  app.get("/api/collections/:handle", async (req, res) => {
    try {
      const collection = await storage.getCollectionByHandle(req.params.handle);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }

      // Fetch products for this collection
      const products = await storage.getProductsByCollectionId(collection.id);

      // Return collection with products
      res.json({
        ...collection,
        products
      });
    } catch (error) {
      console.error("Error fetching collection:", error);
      res.status(500).json({ message: "Error fetching collection" });
    }
  });

  app.post("/api/collections", async (req, res) => {
    try {
      const collectionData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(collectionData);
      res.status(201).json(collection);
    } catch (error) {
      console.error("Error creating collection:", error);
      res.status(400).json({ message: "Invalid collection data" });
    }
  });

  // PC Builder Components API routes
  app.get("/api/components", async (req, res) => {
    try {
      const components = await storage.getAllComponents();
      res.json(components);
    } catch (error) {
      console.error("Error fetching components:", error);
      res.status(500).json({ message: "Error fetching components" });
    }
  });

  app.get("/api/components/types", async (req, res) => {
    try {
      const componentTypes = [
        { id: 1, name: "CPU (Processor)", type: "cpu", icon: "cpu" },
        { id: 2, name: "GPU (Graphics Card)", type: "gpu", icon: "gpu" },
        { id: 3, name: "RAM (Memory)", type: "ram", icon: "ram" },
        { id: 4, name: "Storage", type: "storage", icon: "storage" },
        { id: 5, name: "Motherboard", type: "motherboard", icon: "motherboard" },
        { id: 6, name: "Power Supply", type: "psu", icon: "psu" },
        { id: 7, name: "Case", type: "case", icon: "case" },
        { id: 8, name: "CPU Cooler", type: "cooling", icon: "cooling" },
        { id: 9, name: "Extras", type: "extras", icon: "extras" }
      ];
      res.json(componentTypes);
    } catch (error) {
      console.error("Error fetching component types:", error);
      res.status(500).json({ message: "Error fetching component types" });
    }
  });

  app.get("/api/components/type/:type", async (req, res) => {
    try {
      const components = await storage.getComponentsByType(req.params.type);
      res.json(components);
    } catch (error) {
      console.error("Error fetching components by type:", error);
      res.status(500).json({ message: "Error fetching components by type" });
    }
  });

  app.get("/api/components/:type", async (req, res) => {
    try {
      const components = await storage.getComponentsByType(req.params.type);
      res.json(components);
    } catch (error) {
      console.error("Error fetching components by type:", error);
      res.status(500).json({ message: "Error fetching components by type" });
    }
  });

  // Get a specific component by type and ID
  app.get("/api/components/:type/:id", async (req, res) => {
    try {
      const { type, id } = req.params;
      const components = await storage.getComponentsByType(type);
      const component = components.find(comp => comp.id === parseInt(id));

      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }

      res.json(component);
    } catch (error) {
      console.error("Error fetching component:", error);
      res.status(500).json({ message: "Error fetching component" });
    }
  });

  app.post("/api/components", async (req, res) => {
    try {
      const componentData = insertPCComponentSchema.parse(req.body);
      const component = await storage.createComponent(componentData);
      res.status(201).json(component);
    } catch (error) {
      console.error("Error creating component:", error);
      res.status(400).json({ message: "Invalid component data" });
    }
  });

  // Update component endpoint for stock and other properties
  app.patch("/api/components/:id", async (req, res) => {
    try {
      const componentId = parseInt(req.params.id);
      if (isNaN(componentId)) {
        return res.status(400).json({ message: "Invalid component ID" });
      }

      // Check if the component exists
      const component = await storage.getComponentById(componentId);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }

      // Get the update data
      const updateData = req.body;

      // Update the component in the database
      const updatedComponent = await storage.updateComponent(componentId, updateData);
      if (!updatedComponent) {
        return res.status(500).json({ message: "Failed to update component" });
      }

      res.json({ 
        success: true, 
        message: "Component updated successfully",
        component: updatedComponent
      });
    } catch (error) {
      console.error("Error updating component:", error);
      res.status(500).json({ 
        message: "Error updating component", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Delete component endpoint
  app.delete("/api/components/:id", async (req, res) => {
    try {
      const componentId = parseInt(req.params.id);
      if (isNaN(componentId)) {
        return res.status(400).json({ message: "Invalid component ID" });
      }

      // Check if the component exists
      const component = await storage.getComponentById(componentId);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }

      // Delete the component
      await storage.deleteComponent(componentId);
      res.json({ success: true, message: "Component deleted successfully" });
    } catch (error) {
      console.error("Error deleting component:", error);
      res.status(500).json({ message: "Error deleting component", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Special route for adding Shopify product as a component
  app.post("/api/components-from-product", async (req, res) => {
    try {
      const { productId, componentType } = req.body;

      if (!productId || !componentType) {
        return res.status(400).json({ message: "Product ID and component type are required" });
      }

      // Get the product by ID
      const product = await db.select().from(products).where(eq(products.id, parseInt(productId))).then(rows => rows[0]);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if this product is already a component
      const existingComponent = await storage.getComponentByProductId(parseInt(productId));
      if (existingComponent) {
        return res.status(200).json(existingComponent); // Return existing component
      }

      // Map product data to component data
      const componentData = {
        name: product.title,
        type: componentType,
        specs: product.specs || {},
        price: product.price.toString(),
        imageUrl: product.featuredImageUrl,
        inStock: product.stock > 0,
        productId: product.id,
        brand: (product.specs as any)?.brand || null
      };

      // Create the component
      const component = await storage.createComponent(componentData);
      res.status(201).json(component);
    } catch (error) {
      console.error("Error creating component from product:", error);
      res.status(500).json({ message: "Error creating component from product" });
    }
  });

  // Compatibility Rules API routes
  app.get("/api/compatibility", async (req, res) => {
    try {
      const rules = await storage.getAllCompatibilityRules();
      res.json(rules);
    } catch (error) {
      console.error("Error fetching compatibility rules:", error);
      res.status(500).json({ message: "Error fetching compatibility rules" });
    }
  });

  app.post("/api/compatibility", async (req, res) => {
    try {
      const ruleData = insertCompatibilityRuleSchema.parse(req.body);
      const rule = await storage.createCompatibilityRule(ruleData);
      res.status(201).json(rule);
    } catch (error) {
      console.error("Error creating compatibility rule:", error);
      res.status(400).json({ message: "Invalid compatibility rule data" });
    }
  });

  // Custom Builds API routes
  app.get("/api/builds", async (req, res) => {
    try {
      const builds = await storage.getAllCustomBuilds();
      res.json(builds);
    } catch (error) {
      console.error("Error fetching custom builds:", error);
      res.status(500).json({ message: "Error fetching custom builds" });
    }
  });

  app.post("/api/builds", async (req, res) => {
    try {
      const buildData = insertCustomBuildSchema.parse(req.body);
      const build = await storage.createCustomBuild(buildData);
      res.status(201).json(build);
    } catch (error) {
      console.error("Error creating custom build:", error);
      res.status(400).json({ message: "Invalid custom build data" });
    }
  });

  // Blog Posts API routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });

  app.get("/api/blog/latest", async (req, res) => {
    try {
      const latestPosts = await storage.getLatestBlogPosts(3);
      res.json(latestPosts);
    } catch (error) {
      console.error("Error fetching latest blog posts:", error);
      res.status(500).json({ message: "Error fetching latest blog posts" });
    }
  });

  app.get("/api/blog/:handle", async (req, res) => {
    try {
      const post = await storage.getBlogPostByHandle(req.params.handle);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  // Cart API routes (for simulating cart functionality)
  app.get("/api/cart", async (req, res) => {
    try {
      // Using a generic cartId or user ID if authenticated
      const userId = req.user?.id || undefined;
      const cart = await storage.getCart(userId);
      res.json(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ 
        message: "Error fetching cart",
        cart: {
          id: "",
          items: [],
          totalQuantity: 0,
          totalPrice: "0.00"
        }
      });
    }
  });

  app.post("/api/cart/add", async (req, res) => {
    try {
      // Get the user ID if authenticated, or use a default cart ID
      const userId = req.user?.id || undefined;
      const { productId, quantity = 1, title, price, imageUrl } = req.body;

      if (!productId || !title || !price) {
        return res.status(400).json({ error: "Missing required product information" });
      }

      // Get current cart
      const currentCart = await storage.getCart(userId);

      // Create a new item
      const newItem = {
        id: Date.now(), // Use timestamp as a unique ID
        productId,
        variantId: 1,
        title,
        price,
        quantity: quantity,
        image: {
          id: `img-${productId}`,
          src: imageUrl || "/assets/images/placeholder-product.jpg"
        }
      };

      // Check if item already exists in cart
      const existingItemIndex = currentCart.items.findIndex((item: { productId: number }) => item.productId === productId);
      let updatedItems: any[] = [];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = [...currentCart.items];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        updatedItems = [...currentCart.items, newItem];
      }

      // Calculate totals
      const totalQuantity = updatedItems.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce(
        (total: number, item: { price: string, quantity: number }) => total + (parseFloat(item.price) * item.quantity), 
        0
      ).toFixed(2);

      // Create updated cart
      const updatedCart = {
        id: currentCart.id,
        items: updatedItems,
        totalQuantity,
        totalPrice
      };

      // Save the updated cart
      await storage.updateCart(updatedCart.id, updatedCart);

      res.json(updatedCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  app.post("/api/cart/add-custom-build", async (req, res) => {
    try {
      // Get the user ID if authenticated, or use a default cart ID
      const userId = req.user?.id || undefined;
      const { components, price, name, imageUrl } = req.body;

      if (!components) {
        return res.status(400).json({ error: "No components provided for custom build" });
      }

      // Get current cart
      const currentCart = await storage.getCart(userId);

      // Create a new item for the custom build
      const newItem = {
        id: Date.now(), // Use timestamp as a simple unique ID
        productId: 9999, // Special ID for custom builds
        variantId: 1,
        title: name || "Custom PC Build",
        price: price || "0.00", // Calculate based on components if not provided
        quantity: 1,
        properties: { components: JSON.stringify(components) },
        image: {
          id: "custom-build",
          src: imageUrl || "/assets/images/custom-build.jpg"
        }
      };

      // Add item to cart items
      const updatedItems = [...currentCart.items, newItem];

      // Calculate totals
      const totalQuantity = updatedItems.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce(
        (total: number, item: { price: string, quantity: number }) => total + (parseFloat(item.price) * item.quantity), 
        0
      ).toFixed(2);

      // Create updated cart
      const updatedCart = {
        id: currentCart.id,
        items: updatedItems,
        totalQuantity,
        totalPrice
      };

      // Save the updated cart
      await storage.updateCart(updatedCart.id, updatedCart);

      res.json(updatedCart);
    } catch (error) {
      console.error("Error adding custom build to cart:", error);
      res.status(500).json({ error: "Failed to add custom build to cart" });
    }
  });

  // Update cart item quantity
  app.post("/api/cart/update", async (req, res) => {
    try {
      const userId = req.user?.id || undefined;
      const { itemId, quantity } = req.body;

      if (!itemId || quantity === undefined) {
        return res.status(400).json({ error: "Item ID and quantity are required" });
      }

      // Get current cart
      const currentCart = await storage.getCart(userId);

      // Find the item to update
      const itemIndex = currentCart.items.findIndex((item: { id: number }) => item.id === itemId);

      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found in cart" });
      }

      let updatedItems = [...currentCart.items];

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        updatedItems.splice(itemIndex, 1);
      } else {
        // Update quantity
        updatedItems[itemIndex].quantity = quantity;
      }

      // Calculate totals
      const totalQuantity = updatedItems.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce(
        (total: number, item: { price: string, quantity: number }) => total + (parseFloat(item.price) * item.quantity), 
        0
      ).toFixed(2);

      // Create updated cart
      const updatedCart = {
        id: currentCart.id,
        items: updatedItems,
        totalQuantity,
        totalPrice
      };

      // Save the updated cart
      await storage.updateCart(updatedCart.id, updatedCart);

      res.json(updatedCart);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  // Remove item from cart
  app.post("/api/cart/remove", async (req, res) => {
    try {
      const userId = req.user?.id || undefined;
      const { itemId } = req.body;

      if (!itemId) {
        return res.status(400).json({ error: "Item ID is required" });
      }

      // Get current cart
      const currentCart = await storage.getCart(userId);

      // Remove the item
      const updatedItems = currentCart.items.filter((item: { id: number }) => item.id !== itemId);

      // Calculate totals
      const totalQuantity = updatedItems.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce(
        (total: number, item: { price: string, quantity: number }) => total + (parseFloat(item.price) * item.quantity), 
        0
      ).toFixed(2);

      // Create updated cart
      const updatedCart = {
        id: currentCart.id,
        items: updatedItems,
        totalQuantity,
        totalPrice
      };

      // Save the updated cart
      await storage.updateCart(updatedCart.id, updatedCart);

      res.json(updatedCart);
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  // Clear cart
  app.post("/api/cart/clear", async (req, res) => {
    try {
      const userId = req.user?.id || undefined;

      // Create empty cart
      const emptyCart = {
        id: userId ? `cart-${userId}` : 'default-cart-id',
        items: [],
        totalQuantity: 0,
        totalPrice: "0.00"
      };

      // Save the empty cart
      await storage.updateCart(emptyCart.id, emptyCart);

      res.json(emptyCart);
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Process order completion and reduce stock
  app.post("/api/order/complete", async (req, res) => {
    try {
      const { components } = req.body;

      if (!components || !Array.isArray(components)) {
        return res.status(400).json({ 
          error: "Invalid order data", 
          details: "Components list is required and must be an array" 
        });
      }

      console.log(`[Order] Processing order completion with ${components.length} components`);

      // Return success immediately so we don't block the client
      // We'll process the stock updates asynchronously
      res.status(200).json({ 
        success: true, 
        message: "Order processed successfully" 
      });

      // Process stock reductions asynchronously
      (async () => {
        try {
          for (const component of components) {
            // Each component should have an id and quantity
            if (component.id && component.quantity) {
              // Make a client-side request to update stock
              // This leverages the existing updateComponentStock function
              const url = new URL('/api/internal/update-stock', 'http://localhost:5000');
              const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  componentId: component.id,
                  quantity: component.quantity,
                  // Internal token to verify this is a server-initiated request
                  authToken: process.env.INTERNAL_AUTH_TOKEN || 'server-stock-update'
                })
              });

              if (!response.ok) {
                const error = await response.json();
                console.error(`[Order] Failed to update stock for component ${component.id}:`, error);
              } else {
                console.log(`[Order] Successfully updated stock for component ${component.id}`);
              }
            }
          }

          console.log('[Order] All stock updates processed successfully');
        } catch (error) {
          console.error('[Order] Error processing stock updates:', error);
        }
      })();

    } catch (error) {
      console.error("Error completing order:", error);
      res.status(500).json({ error: "Failed to process order" });
    }
  });

  // Internal endpoint for stock updates
  app.post("/api/internal/update-stock", async (req, res) => {
    try {
      const { componentId, quantity, authToken } = req.body;

      // Verify this is a server-initiated request
      if (!authToken || authToken !== (process.env.INTERNAL_AUTH_TOKEN || 'server-stock-update')) {
        return res.status(403).json({ 
          error: "Unauthorized", 
          details: "Invalid authorization token" 
        });
      }

      if (!componentId || quantity === undefined) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: "Component ID and quantity are required" 
        });
      }

      // Call the client-side script to update stock through browser
      // This will be injected into the page to execute
      const scriptTag = `
        <script>
          (function() {
            try {
              if (typeof window.updateComponentStock === 'function') {
                const result = window.updateComponentStock('${componentId}', ${quantity});
                console.log('Stock update result:', result);
              } else {
                console.error('updateComponentStock function not available');
              }
            } catch (error) {
              console.error('Error updating component stock:', error);
            }
          })();
        </script>
      `;

      // Respond with success and the script to execute
      res.status(200).json({ 
        success: true, 
        message: "Stock update script generated",
        script: scriptTag
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).json({ error: "Failed to update stock" });
    }
  });

  // Register payment routes
  app.use('/api/payment', paymentRoutes);



  // PayPal routes
  app.get("/paypal/setup", async (req, res) => {
    try {
      console.log("[PayPal] Getting client token");
      await loadPaypalDefault(req, res);
    } catch (error) {
      console.error("[PayPal Error] Failed to get client token:", error);
      res.status(500).json({ error: "Failed to initialize PayPal" });
    }
  });

  app.post("/paypal/order", async (req, res) => {
    try {
      // Request body should contain: { intent, amount, currency }
      console.log("[PayPal] Creating order:", req.body);
      await createPaypalOrder(req, res);
    } catch (error) {
      console.error("[PayPal Error] Failed to create order:", error);
      res.status(500).json({ error: "Failed to create PayPal order" });
    }
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    try {
      console.log("[PayPal] Capturing order:", req.params.orderID);
      await capturePaypalOrder(req, res);
    } catch (error) {
      console.error("[PayPal Error] Failed to capture order:", error);
      res.status(500).json({ error: "Failed to capture PayPal order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}