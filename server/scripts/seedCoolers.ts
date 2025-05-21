import { storage } from '../storage';
import { db } from '../db';
import { pcComponents } from '@shared/schema';
import { count, eq } from 'drizzle-orm';

const CPU_COOLERS = [
  {
    name: "Be Quiet! Dark Rock Pro 5",
    price: "86.26",
    brand: "be quiet!",
    description: "Flagship dual-tower CPU cooler designed for maximum performance and silent operation. Features dual Silent Wings fans, advanced noise dampening, and seven heat pipes for extreme cooling capacity while maintaining virtually silent operation at just 23.3 dB(A).",
    image_url: "/static/images/cooling/be-quiet-dark-rock-pro-5.png",
    type: "Air Cooler",
    socket_support: "Intel: 1700 / 1200 / 1150 / 1151 / 1155, AMD: AM5 / AM4",
    fan_size: "120mm x 2",
    fan_speed: "1300 ~ 1500 RPM",
    noise_level: "Up to 23.3 dB(A)",
    cooling_capacity: "250 W"
  },
  {
    name: "Noctua NH-D15 chromax.black",
    price: "109.95",
    brand: "Noctua",
    description: "Premium CPU cooler with dual-tower design and two NF-A15 PWM fans for maximum cooling performance. Features all-black design with anti-vibration pads, SecuFirm2 mounting system, and NT-H1 thermal compound for excellent heat dissipation across multiple CPU sockets.",
    image_url: "/static/images/cooling/noctua-nh-d15-chromax-black.png",
    type: "Air Cooler",
    socket_support: "Intel: LGA1700, LGA1200, LGA115x, LGA2066, LGA2011; AMD: AM5, AM4",
    fan_size: "140mm x 2",
    fan_speed: "300 ~ 1500 RPM",
    noise_level: "Up to 24.6 dB(A)",
    cooling_capacity: "220 W"
  },
  {
    name: "Corsair iCUE H150i ELITE LCD XT",
    price: "259.99",
    brand: "Corsair",
    description: "Premium 360mm AIO liquid CPU cooler with customizable LCD display, powerful cooling performance with three ML RGB ELITE fans, and full integration with iCUE software. Features vibrant IPS screen that displays real-time system information and custom animations.",
    image_url: "/static/images/cooling/corsair-h150i-elite-lcd-xt.png",
    type: "Liquid Cooler",
    socket_support: "Intel: LGA 1700, 1200, 115X, 2066, 2011; AMD: AM5, AM4, sTRX4",
    fan_size: "120mm x 3",
    fan_speed: "450 ~ 2000 RPM",
    noise_level: "10 ~ 37 dB(A)",
    cooling_capacity: "400 W"
  },
  {
    name: "Deepcool LS720",
    price: "119.99",
    brand: "Deepcool",
    description: "High-performance 360mm AIO liquid CPU cooler with three FK120 PWM fans, anti-leak technology, and addressable RGB lighting. Features an optimized pump design for maximum flow rate and pressure, ensuring efficient heat dissipation for high-end CPUs.",
    image_url: "/static/images/cooling/deepcool-ls720.png",
    type: "Liquid Cooler",
    socket_support: "Intel: LGA1700, 1200, 115X, 20XX; AMD: AM5, AM4",
    fan_size: "120mm x 3",
    fan_speed: "500 ~ 1850 RPM",
    noise_level: "Up to 31 dB(A)",
    cooling_capacity: "350 W"
  },
  {
    name: "Arctic Freezer 34 eSports DUO",
    price: "49.99",
    brand: "Arctic",
    description: "Dual fan tower CPU cooler with BioniX P-fans optimized for high static pressure and extremely quiet operation. Features award-winning cooling performance, PWM control, and multi-compatible mounting system for a wide range of Intel and AMD processors.",
    image_url: "/static/images/cooling/arctic-freezer-34-esports-duo.png",
    type: "Air Cooler",
    socket_support: "Intel: 1700, 1200, 115X; AMD: AM5, AM4",
    fan_size: "120mm x 2",
    fan_speed: "200 ~ 2100 RPM",
    noise_level: "Up to 0.5 Sone",
    cooling_capacity: "210 W"
  },
  {
    name: "NZXT Kraken X73 RGB",
    price: "199.99",
    brand: "NZXT",
    description: "Premium 360mm all-in-one liquid CPU cooler with three RGB fans, infinity mirror pump design, and CAM-powered performance modes. Features an RGB infinity mirror design with a larger LED ring for captivating lighting effects and a rotatable pump cap for versatile tube orientation.",
    image_url: "/static/images/cooling/nzxt-kraken-x73-rgb.png",
    type: "Liquid Cooler",
    socket_support: "Intel: LGA1700, 1200, 115X, 2066, 2011(-3); AMD: AM5, AM4, sTRX4, TR4",
    fan_size: "120mm x 3",
    fan_speed: "500 ~ 1800 RPM",
    noise_level: "21 ~ 36 dB(A)",
    cooling_capacity: "380 W"
  },
  {
    name: "Thermalright Peerless Assassin 120 SE",
    price: "39.90",
    brand: "Thermalright",
    description: "Dual tower CPU cooler with six heat pipes and two TL-C12C PWM fans for exceptional cooling at an affordable price. Features an optimized fin stack design for improved airflow and heat dissipation, making it an excellent value for mid to high-end builds.",
    image_url: "/static/images/cooling/thermalright-peerless-assassin-120-se.png",
    type: "Air Cooler",
    socket_support: "Intel: LGA1700, 1200, 115X; AMD: AM5, AM4",
    fan_size: "120mm x 2",
    fan_speed: "500 ~ 1550 RPM",
    noise_level: "Up to 25.6 dB(A)",
    cooling_capacity: "220 W"
  }
];

async function coolingComponentsExist() {
  // Check if any cooling components already exist
  const coolingComponents = await db.select({ count: count() })
    .from(pcComponents)
    .where(eq(pcComponents.type, 'cooling'));

  return coolingComponents[0].count > 0;
}

async function seedCoolingComponents() {
  try {
    console.log('Checking if CPU coolers need to be imported...');
    
    // Check if cooling components already exist
    const hasExistingCoolers = await coolingComponentsExist();
    if (hasExistingCoolers) {
      console.log('CPU coolers already exist in the database. Skipping import.');
      return;
    }
    
    console.log('Starting to import CPU coolers...');
    
    let addedCount = 0;
    
    for (const cooler of CPU_COOLERS) {
      try {
        // Create specs object from cooler properties
        const specs = {
          type: cooler.type || "Air Cooler",
          socket_support: cooler.socket_support || "",
          fan_size: cooler.fan_size || "",
          fan_speed: cooler.fan_speed || "",
          noise_level: cooler.noise_level || "",
          cooling_capacity: cooler.cooling_capacity || "",
          description: cooler.description || ""
        };
        
        // Convert the CPU cooler data to match our schema
        const componentData = {
          name: cooler.name,
          type: 'cooling',
          price: cooler.price,
          specs: specs,
          brand: cooler.brand || null,
          imageUrl: cooler.image_url || null,
          inStock: true,
          productId: null
        };
        
        // Create the component
        const component = await storage.createComponent(componentData);
        console.log(`Imported CPU cooler: ${component.name}`);
        addedCount++;
      } catch (error) {
        console.error(`Error importing CPU cooler ${cooler.name}:`, error);
      }
    }
    
    console.log(`Successfully added ${addedCount} CPU coolers`);
  } catch (error) {
    console.error('Error seeding CPU coolers:', error);
  }
}

// Export the function to be called from the central seeding utility
export { seedCoolingComponents };

// Only run if this file is executed directly
if (require.main === module) {
  seedCoolingComponents().then(() => {
    console.log('CPU coolers seeding completed.');
    process.exit(0);
  }).catch(error => {
    console.error('Seeding process failed:', error);
    process.exit(1);
  });
}