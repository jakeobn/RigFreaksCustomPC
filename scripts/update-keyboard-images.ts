import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";

async function updateKeyboardImages() {
  try {
    console.log("Updating Asus ROG STRIX SCOPE II 96 Wireless keyboard images...");

    // Update the keyboard product
    const [updatedProduct] = await db.update(products)
      .set({
        featuredImageUrl: "/assets/1.png",
        imagesUrls: [
          "/assets/1.png",
          "/assets/2.png",
          "/assets/3.png"
        ]
      })
      .where(eq(products.handle, "asus-rog-strix-scope-ii-96-wireless"))
      .returning();
    
    if (!updatedProduct) {
      console.log("Keyboard product not found!");
      return;
    }
    
    console.log(`Updated product images: ${updatedProduct.title} (ID: ${updatedProduct.id})`);
    console.log("Done!");
  } catch (error) {
    console.error("Error updating keyboard images:", error);
  } finally {
    process.exit();
  }
}

// Run the function
updateKeyboardImages();