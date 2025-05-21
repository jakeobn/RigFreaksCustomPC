import { db } from "../db";
import {
  products,
  collections,
  pcComponents,
  compatibilityRules,
  blogPosts,
  users,
  productCollections
} from "@shared/schema";
import { count, eq } from "drizzle-orm";

async function databaseIsEmpty() {
  // Check if any products exist
  const productCount = await db.select({ count: count() }).from(products);
  if (productCount[0].count > 0) {
    return false;
  }
  
  // Check if any collections exist
  const collectionCount = await db.select({ count: count() }).from(collections);
  if (collectionCount[0].count > 0) {
    return false;
  }
  
  // Check if any components exist
  const componentCount = await db.select({ count: count() }).from(pcComponents);
  if (componentCount[0].count > 0) {
    return false;
  }
  
  // If we get here, the database is empty
  return true;
}

async function seedDatabase() {
  console.log("Checking if database needs seeding...");
  
  // Only seed if the database is empty
  const needsSeeding = await databaseIsEmpty();
  if (!needsSeeding) {
    console.log("Database already contains data. Skipping seed process.");
    return;
  }
  
  console.log("Database is empty. Starting database seeding...");

  try {
    // Insert featured products
    console.log("Seeding products...");
    const [vortexProduct] = await db.insert(products).values({
      title: "Vortex Pro X",
      handle: "vortex-pro-x",
      description: "Ultimate 4K Gaming Experience with top-tier components for competitive gaming.",
      price: "3499.99",
      compareAtPrice: "3699.99",
      category: "vortex",
      featuredImageUrl: "https://pixabay.com/get/g27530805296928ef179c4da247aaa59fa30395477b410fd37a141243234f103f2410e55593b81f6a4e14001f79cc7301e996856c6b8e1e671366a38b96cdf87e_1280.jpg",
      imagesUrls: [
        "https://pixabay.com/get/g27530805296928ef179c4da247aaa59fa30395477b410fd37a141243234f103f2410e55593b81f6a4e14001f79cc7301e996856c6b8e1e671366a38b96cdf87e_1280.jpg",
        "https://images.unsplash.com/photo-1587202372616-b43abea06c2a",
        "https://images.unsplash.com/photo-1591488320449-011701bb6704"
      ],
      tags: ["Featured", "Best Seller", "Gaming"],
      specs: {
        CPU: "Intel Core i9-13900K",
        GPU: "NVIDIA RTX 4090 24GB",
        RAM: "64GB DDR5-6000MHz",
        Storage: "2TB NVMe SSD + 4TB HDD",
        Motherboard: "ASUS ROG Maximus Z790",
        PSU: "1200W 80+ Platinum",
        Cooling: "360mm AIO Liquid Cooler",
        Case: "Lian Li PC-O11 Dynamic XL"
      },
      stock: 10
    }).returning();
    
    const [novaElite] = await db.insert(products).values({
      title: "Nova Elite",
      handle: "nova-elite",
      description: "The perfect balance of performance and value for 1440p gaming.",
      price: "1899.99",
      category: "nova",
      featuredImageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704",
      imagesUrls: [
        "https://images.unsplash.com/photo-1591488320449-011701bb6704",
        "https://images.unsplash.com/photo-1587202372616-b43abea06c2a"
      ],
      tags: ["Gaming", "Mid-Range"],
      specs: {
        CPU: "Intel Core i5-13600K",
        GPU: "NVIDIA RTX 3070 Ti 8GB",
        RAM: "32GB DDR4-3600MHz",
        Storage: "1TB NVMe SSD + 2TB HDD",
        Motherboard: "MSI MAG Z690 Tomahawk",
        PSU: "850W 80+ Gold",
        Cooling: "240mm AIO Liquid Cooler",
        Case: "Corsair 4000D Airflow"
      },
      stock: 15
    }).returning();
    
    const [pulseCreator] = await db.insert(products).values({
      title: "Pulse Creator Pro",
      handle: "pulse-creator-pro",
      description: "Designed for content creators, video editing, and 3D rendering workflows.",
      price: "2999.99",
      category: "pulse",
      featuredImageUrl: "https://images.unsplash.com/photo-1625842268584-8f3296236761",
      imagesUrls: [
        "https://images.unsplash.com/photo-1625842268584-8f3296236761",
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5"
      ],
      tags: ["Creator", "Workstation", "Featured"],
      specs: {
        CPU: "AMD Ryzen 9 7950X",
        GPU: "NVIDIA RTX 4080 16GB",
        RAM: "64GB DDR5-5600MHz",
        Storage: "2TB NVMe SSD + 4TB HDD",
        Motherboard: "ASUS ProArt X670E-Creator",
        PSU: "1000W 80+ Platinum",
        Cooling: "360mm AIO Liquid Cooler",
        Case: "Fractal Design Meshify 2"
      },
      stock: 8
    }).returning();
    
    const [novaStarter] = await db.insert(products).values({
      title: "Nova Starter",
      handle: "nova-starter",
      description: "Entry-level gaming excellence for 1080p high refresh rate gaming.",
      price: "1199.99",
      category: "nova",
      featuredImageUrl: "https://pixabay.com/get/g67976d9300c68b57aa70577209882272393fff5871ac05beec8f59ae63d46259587a95b61a5cfb77eefd8a6b4b86b08dcc0bb57eb2359f253b183e135a6bcec0_1280.jpg",
      imagesUrls: [
        "https://pixabay.com/get/g67976d9300c68b57aa70577209882272393fff5871ac05beec8f59ae63d46259587a95b61a5cfb77eefd8a6b4b86b08dcc0bb57eb2359f253b183e135a6bcec0_1280.jpg"
      ],
      tags: ["Budget", "Gaming", "Best Value"],
      specs: {
        CPU: "Intel Core i5-12400F",
        GPU: "NVIDIA RTX 3060 12GB",
        RAM: "16GB DDR4-3200MHz",
        Storage: "1TB NVMe SSD",
        Motherboard: "MSI B660M-A",
        PSU: "650W 80+ Bronze",
        Cooling: "Air Cooler",
        Case: "NZXT H510 Flow"
      },
      stock: 20
    }).returning();

    // Insert collections
    console.log("Seeding collections...");
    const [allCollection] = await db.insert(collections).values({
      title: "All Gaming PCs",
      handle: "all",
      description: "Browse our complete selection of custom gaming PCs and workstations."
    }).returning();
    
    const [vortexCollection] = await db.insert(collections).values({
      title: "Vortex Gaming PCs",
      handle: "vortex",
      description: "Ultimate 4K gaming experience with framerates up to 120fps."
    }).returning();
    
    const [novaCollection] = await db.insert(collections).values({
      title: "Nova Gaming PCs",
      handle: "nova",
      description: "Perfect for 1080p/1440p gaming with smooth framerates."
    }).returning();
    
    const [pulseCollection] = await db.insert(collections).values({
      title: "Pulse Creator PCs",
      handle: "pulse",
      description: "Designed for content creators, video editing, and 3D rendering."
    }).returning();

    // Create product-collection relationships
    console.log("Setting up product-collection relationships...");
    await db.insert(productCollections).values([
      { productId: vortexProduct.id, collectionId: allCollection.id },
      { productId: novaElite.id, collectionId: allCollection.id },
      { productId: pulseCreator.id, collectionId: allCollection.id },
      { productId: novaStarter.id, collectionId: allCollection.id },
      { productId: vortexProduct.id, collectionId: vortexCollection.id },
      { productId: novaElite.id, collectionId: novaCollection.id },
      { productId: novaStarter.id, collectionId: novaCollection.id },
      { productId: pulseCreator.id, collectionId: pulseCollection.id }
    ]);

    // Insert PC components
    console.log("Seeding PC components...");
    await db.insert(pcComponents).values([
      {
        name: "Intel Core i9-13900K",
        type: "cpu",
        specs: {
          cores: "24 (8P+16E)",
          frequency: "5.8GHz Max",
          socket: "LGA1700",
          tdp: "125W",
          cache: "36MB L3"
        },
        price: "599.99",
        imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
        brand: "Intel",
        inStock: true
      },
      {
        name: "AMD Ryzen 9 7950X",
        type: "cpu",
        specs: {
          cores: "16",
          frequency: "5.7GHz Max",
          socket: "AM5",
          tdp: "170W",
          cache: "64MB L3"
        },
        price: "579.99",
        imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
        brand: "AMD",
        inStock: true
      },
      {
        name: "NVIDIA GeForce RTX 4090",
        type: "gpu",
        specs: {
          memory: "24GB GDDR6X",
          boost_clock: "2.52 GHz",
          cuda_cores: "16384",
          tdp: "450W",
          bus: "PCIe 4.0 x16"
        },
        price: "1599.99",
        imageUrl: "https://images.unsplash.com/photo-1555618565-5309f2a20ba4",
        brand: "NVIDIA",
        inStock: true
      },
      {
        name: "Corsair Vengeance RGB DDR5",
        type: "ram",
        specs: {
          capacity: "64GB (2x32GB)",
          speed: "6000MHz",
          cas_latency: "CL36",
          voltage: "1.35V"
        },
        price: "299.99",
        imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186",
        brand: "Corsair",
        inStock: true
      },
      {
        name: "Samsung 980 PRO",
        type: "storage",
        specs: {
          capacity: "2TB",
          interface: "PCIe 4.0 NVMe",
          read_speed: "7000 MB/s",
          write_speed: "5100 MB/s",
          form_factor: "M.2 2280"
        },
        price: "199.99",
        imageUrl: "https://images.unsplash.com/photo-1597838816902-d841408cf2c3",
        brand: "Samsung",
        inStock: true
      }
    ]);

    // Insert blog posts
    console.log("Seeding blog posts...");
    await db.insert(blogPosts).values([
      {
        title: "Next-Gen GPUs: What to Expect",
        handle: "next-gen-gpus",
        content: "The next generation of graphics cards promises to deliver unprecedented performance...",
        excerpt: "A look at the upcoming GPU releases and what they mean for gamers and content creators.",
        author: "Alex Morgan",
        imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704",
        tags: ["Hardware", "GPUs", "Gaming"],
        publishedAt: new Date()
      },
      {
        title: "Building Your First Gaming PC: A Beginner's Guide",
        handle: "beginners-guide-pc-building",
        content: "Building your first PC can be intimidating, but with our step-by-step guide...",
        excerpt: "Everything you need to know to build your first gaming PC from scratch.",
        author: "Sarah Chen",
        imageUrl: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a",
        tags: ["Guides", "PC Building", "Beginners"],
        publishedAt: new Date()
      }
    ]);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Export the function to be called from the central seeding utility
export { seedDatabase };

// Only run if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log("Database seeding executed directly.");
    process.exit(0);
  }).catch(err => {
    console.error("Error in direct execution:", err);
    process.exit(1);
  });
}