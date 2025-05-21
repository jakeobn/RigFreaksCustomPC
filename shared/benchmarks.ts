// Performance benchmark data for hardware components
import { 
  cpuUserBenchmarks, 
  gpuUserBenchmarks,
  ssdUserBenchmarks,
  hddUserBenchmarks,
  ramUserBenchmarks,
  getCpuUserBenchmark,
  getGpuUserBenchmark,
  getStorageUserBenchmark,
  getRamUserBenchmark
} from './userBenchmarks';

// Re-export UserBenchmark helper functions
export { 
  getCpuUserBenchmark,
  getGpuUserBenchmark,
  getStorageUserBenchmark,
  getRamUserBenchmark
};

// CPU Benchmark Scores (now using UserBenchmark data, higher is better)
export const cpuBenchmarks = {
  // Intel - 14th gen
  "i9-14900KS": { score: 13300, cores: 24, threads: 32 },
  "i9-14900KF": { score: 13100, cores: 24, threads: 32 },
  "i9-14900K": { score: 13100, cores: 24, threads: 32 },
  "i7-14700KF": { score: 13000, cores: 20, threads: 28 },
  "i7-14700K": { score: 13000, cores: 20, threads: 28 },
  "i9-14900": { score: 12400, cores: 24, threads: 32 },
  "i9-14900F": { score: 12400, cores: 24, threads: 32 },
  "i5-14600KF": { score: 12400, cores: 14, threads: 20 },
  "i5-14600K": { score: 12400, cores: 14, threads: 20 },
  "i7-14700F": { score: 12100, cores: 20, threads: 28 },
  "i7-14700": { score: 12100, cores: 20, threads: 28 },
  "i5-14600": { score: 11600, cores: 14, threads: 20 },
  "i5-14500": { score: 11400, cores: 14, threads: 20 },
  "i5-14400F": { score: 10700, cores: 10, threads: 16 },
  "i5-14400": { score: 10700, cores: 10, threads: 16 },

  // Intel - 13th gen
  "i9-13900KS": { score: 13100, cores: 24, threads: 32 },
  "i9-13900KF": { score: 12900, cores: 24, threads: 32 },
  "i9-13900K": { score: 12900, cores: 24, threads: 32 },
  "i7-13700KF": { score: 12600, cores: 16, threads: 24 },
  "i7-13700K": { score: 12600, cores: 16, threads: 24 },
  "i9-13900F": { score: 12400, cores: 24, threads: 32 },
  "i9-13900": { score: 12300, cores: 24, threads: 32 },
  "i7-13700F": { score: 12100, cores: 16, threads: 24 },
  "i7-13700": { score: 12100, cores: 16, threads: 24 },
  "i5-13600K": { score: 12200, cores: 14, threads: 20 },
  "i5-13600KF": { score: 12200, cores: 14, threads: 20 },
  "i5-13600": { score: 11700, cores: 14, threads: 20 },
  "i5-13500": { score: 11300, cores: 14, threads: 20 },
  "i5-13400F": { score: 10600, cores: 10, threads: 16 },
  "i5-13400": { score: 10600, cores: 10, threads: 16 },

  // Intel - 12th gen
  "i9-12900KS": { score: 11900, cores: 16, threads: 24 },
  "i9-12900K": { score: 11700, cores: 16, threads: 24 },
  "i9-12900KF": { score: 11700, cores: 16, threads: 24 },
  "i9-12900F": { score: 11300, cores: 16, threads: 24 },
  "i9-12900": { score: 11100, cores: 16, threads: 24 },
  "i7-12700K": { score: 11400, cores: 12, threads: 20 },
  "i7-12700KF": { score: 11400, cores: 12, threads: 20 },
  "i7-12700F": { score: 10900, cores: 12, threads: 20 },
  "i7-12700": { score: 10800, cores: 12, threads: 20 },
  "i5-12600K": { score: 10900, cores: 10, threads: 16 },
  "i5-12600KF": { score: 10900, cores: 10, threads: 16 },
  "i5-12600": { score: 10200, cores: 6, threads: 12 },
  "i5-12500": { score: 9920, cores: 6, threads: 12 },
  "i5-12400F": { score: 9710, cores: 6, threads: 12 },
  "i5-12400": { score: 9710, cores: 6, threads: 12 },

  // Intel - Core Ultra
  "Core Ultra 9 285K": { score: 12100, cores: 16, threads: 24 },
  "Core Ultra 7 265K": { score: 11900, cores: 14, threads: 20 },
  "Core Ultra 5 245K": { score: 11700, cores: 14, threads: 20 },

  // AMD - Ryzen 9000 series
  "Ryzen 7 9800X3D": { score: 12200, cores: 8, threads: 16 },
  "Ryzen 9 9950X3D": { score: 12000, cores: 16, threads: 32 },
  "Ryzen 9 9900X3D": { score: 11900, cores: 12, threads: 24 },
  "Ryzen 9 9950X": { score: 11800, cores: 16, threads: 32 },
  "Ryzen 9 9900X": { score: 11700, cores: 12, threads: 24 },
  "Ryzen 7 9700X": { score: 11600, cores: 8, threads: 16 },
  "Ryzen 5 9600X": { score: 11400, cores: 6, threads: 12 },

  // AMD - Ryzen 7000 series
  "Ryzen 7 7800X3D": { score: 11700, cores: 8, threads: 16 },
  "Ryzen 9 7950X3D": { score: 11600, cores: 16, threads: 32 },
  "Ryzen 9 7900X3D": { score: 11500, cores: 12, threads: 24 },
  "Ryzen 9 7950X": { score: 11400, cores: 16, threads: 32 },
  "Ryzen 9 7900X": { score: 11300, cores: 12, threads: 24 },
  "Ryzen 7 7700X": { score: 11200, cores: 8, threads: 16 },
  "Ryzen 5 7600X": { score: 11000, cores: 6, threads: 12 },
  "Ryzen 7 7700": { score: 10900, cores: 8, threads: 16 },
  "Ryzen 9 7900": { score: 10900, cores: 12, threads: 24 },
  "Ryzen 5 7600X3D": { score: 10600, cores: 6, threads: 12 },
  "Ryzen 5 7600": { score: 10600, cores: 6, threads: 12 },
  "Ryzen 5 7500F": { score: 10300, cores: 6, threads: 12 },

  // AMD - Ryzen 5000 series
  "Ryzen 7 5800X3D": { score: 10400, cores: 8, threads: 16 },
  "Ryzen 9 5950X": { score: 10000, cores: 16, threads: 32 },
  "Ryzen 5 5600X3D": { score: 10000, cores: 6, threads: 12 },
  "Ryzen 7 5800XT": { score: 9900, cores: 8, threads: 16 },
  "Ryzen 9 5900X": { score: 9900, cores: 12, threads: 24 },
  "Ryzen 7 5800X": { score: 9600, cores: 8, threads: 16 },
  "Ryzen 7 5700X": { score: 9200, cores: 8, threads: 16 },
  "Ryzen 5 5600X": { score: 8800, cores: 6, threads: 12 },
  "Ryzen 5 5600": { score: 8600, cores: 6, threads: 12 },
  "Ryzen 5 5600G": { score: 8300, cores: 6, threads: 12 },
  "Ryzen 5 5500": { score: 8000, cores: 6, threads: 12 },

  // AMD - Ryzen 3000 series
  "Ryzen 9 3950X": { score: 8700, cores: 16, threads: 32 },
  "Ryzen 9 3900XT": { score: 8300, cores: 12, threads: 24 },
  "Ryzen 9 3900X": { score: 8200, cores: 12, threads: 24 },
  "Ryzen 7 3800XT": { score: 7600, cores: 8, threads: 16 },
  "Ryzen 7 3800X": { score: 7500, cores: 8, threads: 16 },
  "Ryzen 7 3700X": { score: 7300, cores: 8, threads: 16 },
  "Ryzen 5 3600XT": { score: 7100, cores: 6, threads: 12 },
  "Ryzen 5 3600X": { score: 6900, cores: 6, threads: 12 },
  "Ryzen 5 3600": { score: 6800, cores: 6, threads: 12 },
  "Ryzen 3 3300X": { score: 6200, cores: 4, threads: 8 },
  "Ryzen 3 3100": { score: 5800, cores: 4, threads: 8 },
};

// GPU Benchmark Scores (now using UserBenchmark data, higher is better)
export const gpuBenchmarks = {
  // NVIDIA - RTX 50 series
  "RTX 5090": { score: 18300, vram: 32 },
  "RTX 5080": { score: 13900, vram: 24 },
  "RTX 5070 Ti": { score: 12000, vram: 16 },
  "RTX 5070": { score: 9900, vram: 16 },

  // NVIDIA - RTX 40 series
  "RTX 4090": { score: 15500, vram: 24 },
  "RTX 4080 Super": { score: 12600, vram: 16 },
  "RTX 4080": { score: 12200, vram: 16 },
  "RTX 4070 Ti Super": { score: 10500, vram: 16 },
  "RTX 4070 Ti": { score: 10100, vram: 12 },
  "RTX 4070 Super": { score: 9100, vram: 12 },
  "RTX 4070": { score: 8000, vram: 12 },
  "RTX 4060 Ti 16GB": { score: 7260, vram: 16 },
  "RTX 4060 Ti": { score: 6830, vram: 8 },
  "RTX 4060": { score: 5790, vram: 8 },

  // NVIDIA - RTX 30 series
  "RTX 3090 Ti": { score: 9730, vram: 24 },
  "RTX 3090": { score: 8740, vram: 24 },
  "RTX 3080 Ti": { score: 8630, vram: 12 },
  "RTX 3080 12GB": { score: 7150, vram: 12 },
  "RTX 3080": { score: 6920, vram: 10 },
  "RTX 3070 Ti": { score: 6600, vram: 8 },
  "RTX 3070": { score: 6240, vram: 8 },
  "RTX 3060 Ti": { score: 5690, vram: 8 },
  "RTX 3060": { score: 4390, vram: 12 },
  "RTX 3050": { score: 3830, vram: 8 },

  // NVIDIA - RTX 20 series
  "RTX 2080 Ti": { score: 5970, vram: 11 },
  "RTX 2080 Super": { score: 5150, vram: 8 },
  "RTX 2080": { score: 4960, vram: 8 },
  "RTX 2070 Super": { score: 4810, vram: 8 },
  "RTX 2070": { score: 4370, vram: 8 },
  "RTX 2060 Super": { score: 4140, vram: 8 },
  "RTX 2060": { score: 3730, vram: 6 },

  // NVIDIA - GTX 16 series
  "GTX 1660 Ti": { score: 3090, vram: 6 },
  "GTX 1660 Super": { score: 3010, vram: 6 },
  "GTX 1660": { score: 2750, vram: 6 },
  "GTX 1650 Super": { score: 2640, vram: 4 },
  "GTX 1650": { score: 2170, vram: 4 },

  // AMD - RX 9000 series
  "RX 9070 XT": { score: 9770, vram: 16 },
  "RX 9070": { score: 8850, vram: 16 },

  // AMD - RX 7000 series
  "RX 7900 XTX": { score: 10800, vram: 24 },
  "RX 7900 XT": { score: 9280, vram: 20 },
  "RX 7900 GRE": { score: 8170, vram: 16 },
  "RX 7800 XT": { score: 7650, vram: 16 },
  "RX 7700 XT": { score: 6310, vram: 12 },
  "RX 7600": { score: 4800, vram: 8 },

  // AMD - RX 6000 series
  "RX 6950 XT": { score: 8420, vram: 16 },
  "RX 6900 XT": { score: 8170, vram: 16 },
  "RX 6800 XT": { score: 7020, vram: 16 },
  "RX 6800": { score: 6620, vram: 16 },
  "RX 6750 XT": { score: 5740, vram: 12 },
  "RX 6700 XT": { score: 5570, vram: 12 },
  "RX 6650 XT": { score: 4760, vram: 8 },
  "RX 6600 XT": { score: 4510, vram: 8 },
  "RX 6600": { score: 4070, vram: 8 },

  // AMD - RX 5000 series
  "RX 5700 XT": { score: 3870, vram: 8 },
  "RX 5700": { score: 3630, vram: 8 },
  "RX 5600 XT": { score: 3340, vram: 6 },
  "RX 5500 XT": { score: 2650, vram: 8 },

  // AMD - RX 500 series
  "RX 580": { score: 2110, vram: 8 },
  "RX 570": { score: 1910, vram: 4 },
  "RX 560": { score: 1260, vram: 4 },
  "RX 550": { score: 885, vram: 4 },

  // Intel - Arc
  "Arc A770": { score: 4520, vram: 16 },
  "Arc A750": { score: 4080, vram: 8 },
  "Arc A580": { score: 3410, vram: 8 },
  "Arc A380": { score: 1920, vram: 6 },

  // Integrated Graphics
  "Intel UHD 770": { score: 950, vram: 0 },
  "Intel UHD 750": { score: 850, vram: 0 },
  "Intel UHD 730": { score: 750, vram: 0 },
  "AMD Radeon 680M": { score: 1780, vram: 0 },
  "AMD Vega 11": { score: 1450, vram: 0 },
  "AMD Vega 8": { score: 1280, vram: 0 },
};

// RAM Speed Impact (multiplier)
export const ramSpeedMultipliers = {
  "2133": 0.85,
  "2400": 0.90,
  "2666": 0.93,
  "2933": 0.96,
  "3000": 0.97,
  "3200": 1.0,  // baseline
  "3600": 1.04,
  "4000": 1.08,
  "4400": 1.11,
  "4800": 1.13,
  "5200": 1.15,
  "5600": 1.17,
  "6000": 1.19
};

// RAM Capacity Impact (multiplier)
export const ramCapacityMultipliers = {
  "4": 0.75,
  "8": 0.85,
  "16": 1.0,  // baseline
  "32": 1.05,
  "64": 1.07,
  "128": 1.08
};

// Storage Type Impact (multiplier)
export const storageTypeMultipliers = {
  "HDD": 0.65,
  "SATA SSD": 0.85,
  "NVMe Gen3": 1.0,  // baseline
  "NVMe Gen4": 1.05,
  "NVMe Gen5": 1.08
};

// Popular Games with their CPU/GPU sensitivity (higher means more dependent on that component)
export const games = {
  "Cyberpunk 2077": {
    name: "Cyberpunk 2077",
    cpuDependency: 0.4,
    gpuDependency: 0.6,
    baseline: {
      "1080p": 85,  // baseline FPS at 1080p with RTX 3070 + i7-12700K
      "1440p": 65,  // baseline FPS at 1440p with RTX 3070 + i7-12700K
      "4K": 35      // baseline FPS at 4K with RTX 3070 + i7-12700K
    }
  },
  "Call of Duty: Warzone": {
    name: "Call of Duty: Warzone",
    cpuDependency: 0.45,
    gpuDependency: 0.55,
    baseline: {
      "1080p": 140,
      "1440p": 110,
      "4K": 65
    }
  },
  "Fortnite": {
    name: "Fortnite",
    cpuDependency: 0.55,
    gpuDependency: 0.45,
    baseline: {
      "1080p": 200,
      "1440p": 144,
      "4K": 85
    }
  },
  "Red Dead Redemption 2": {
    name: "Red Dead Redemption 2",
    cpuDependency: 0.35,
    gpuDependency: 0.65,
    baseline: {
      "1080p": 95,
      "1440p": 75,
      "4K": 42
    }
  },
  "Elden Ring": {
    name: "Elden Ring",
    cpuDependency: 0.4,
    gpuDependency: 0.6,
    baseline: {
      "1080p": 100,
      "1440p": 85,
      "4K": 50
    }
  },
  "Valorant": {
    name: "Valorant",
    cpuDependency: 0.7,
    gpuDependency: 0.3,
    baseline: {
      "1080p": 400,
      "1440p": 280,
      "4K": 160
    }
  },
  "Minecraft": {
    name: "Minecraft",
    cpuDependency: 0.8,
    gpuDependency: 0.2,
    baseline: {
      "1080p": 220,
      "1440p": 180,
      "4K": 120
    }
  },
  "Counter-Strike 2": {
    name: "Counter-Strike 2",
    cpuDependency: 0.65,
    gpuDependency: 0.35,
    baseline: {
      "1080p": 360,
      "1440p": 240,
      "4K": 140
    }
  },
  "Apex Legends": {
    name: "Apex Legends",
    cpuDependency: 0.5,
    gpuDependency: 0.5,
    baseline: {
      "1080p": 170,
      "1440p": 130,
      "4K": 75
    }
  },
  "The Witcher 3": {
    name: "The Witcher 3",
    cpuDependency: 0.35,
    gpuDependency: 0.65,
    baseline: {
      "1080p": 120,
      "1440p": 90,
      "4K": 55
    }
  },
  "League of Legends": {
    name: "League of Legends",
    cpuDependency: 0.6,
    gpuDependency: 0.4,
    baseline: {
      "1080p": 280,
      "1440p": 200,
      "4K": 140
    }
  },
  "Assassin's Creed Valhalla": {
    name: "Assassin's Creed Valhalla",
    cpuDependency: 0.45,
    gpuDependency: 0.55,
    baseline: {
      "1080p": 90,
      "1440p": 72,
      "4K": 45
    }
  },
  "Baldur's Gate 3": {
    name: "Baldur's Gate 3",
    cpuDependency: 0.4,
    gpuDependency: 0.6,
    baseline: {
      "1080p": 85,
      "1440p": 65,
      "4K": 38
    }
  },
  "Grand Theft Auto V": {
    name: "Grand Theft Auto V",
    cpuDependency: 0.5,
    gpuDependency: 0.5,
    baseline: {
      "1080p": 150,
      "1440p": 110,
      "4K": 70
    }
  },
  "Rainbow Six Siege": {
    name: "Rainbow Six Siege",
    cpuDependency: 0.45,
    gpuDependency: 0.55,
    baseline: {
      "1080p": 280,
      "1440p": 190,
      "4K": 110
    }
  }
};

// Performance use cases with weights for different components
export const performanceUseCase = {
  "Gaming": {
    name: "Gaming",
    cpuWeight: 0.4,
    gpuWeight: 0.5,
    ramWeight: 0.05,
    storageWeight: 0.05
  },
  "Content Creation": {
    name: "Content Creation",
    cpuWeight: 0.5,
    gpuWeight: 0.3,
    ramWeight: 0.15,
    storageWeight: 0.05
  },
  "Office & Productivity": {
    name: "Office & Productivity",
    cpuWeight: 0.5,
    gpuWeight: 0.1,
    ramWeight: 0.2,
    storageWeight: 0.2
  },
  "Game Development": {
    name: "Game Development",
    cpuWeight: 0.4,
    gpuWeight: 0.3,
    ramWeight: 0.2,
    storageWeight: 0.1
  },
  "Video Editing": {
    name: "Video Editing",
    cpuWeight: 0.4,
    gpuWeight: 0.3,
    ramWeight: 0.2,
    storageWeight: 0.1
  },
  "3D Rendering": {
    name: "3D Rendering",
    cpuWeight: 0.35,
    gpuWeight: 0.45,
    ramWeight: 0.15,
    storageWeight: 0.05
  },
  "Streaming": {
    name: "Streaming",
    cpuWeight: 0.6,
    gpuWeight: 0.3,
    ramWeight: 0.05,
    storageWeight: 0.05
  }
};

// Helper function to find the most similar CPU model name
export function findClosestCpuMatch(cpuModel: string): string | null {
  if (!cpuModel) return null;

  // Direct match
  if (cpuBenchmarks[cpuModel]) return cpuModel;

  // Try UserBenchmark data match
  const userBenchMatch = getCpuUserBenchmark(cpuModel);
  if (userBenchMatch) {
    const cpuKeys = Object.keys(cpuBenchmarks);
    // Return the best matching local model based on UBM score
    for (const key of cpuKeys) {
      if (key.toLowerCase().includes(cpuModel.toLowerCase()) || 
          cpuModel.toLowerCase().includes(key.toLowerCase())) {
        return key;
      }
    }
  }

  // Clean up the input
  const cleanedInput = cpuModel.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  // Try to find a close match
  const cpuKeys = Object.keys(cpuBenchmarks);

  // First try to find a substring match
  for (const key of cpuKeys) {
    if (cleanedInput.includes(key.toLowerCase()) || key.toLowerCase().includes(cleanedInput)) {
      return key;
    }
  }

  // If no match found, get the model number
  const modelNumberMatch = cleanedInput.match(/i[3579]-\d{4,5}[a-z]?|ryzen\s+[3579]\s+\d{4}[a-z]?/i);
  if (modelNumberMatch) {
    const modelNumber = modelNumberMatch[0];

    // Look for partial matches
    for (const key of cpuKeys) {
      if (key.toLowerCase().includes(modelNumber)) {
        return key;
      }
    }
  }

  return null;
}

// Helper function to find the most similar GPU model name
export function findClosestGpuMatch(gpuModel: string): string | null {
  if (!gpuModel) return null;

  // Direct match
  if (gpuBenchmarks[gpuModel]) return gpuModel;

  // Try UserBenchmark data match
  const userBenchMatch = getGpuUserBenchmark(gpuModel);
  if (userBenchMatch) {
    const gpuKeys = Object.keys(gpuBenchmarks);
    // Return the best matching local model based on UBM score
    for (const key of gpuKeys) {
      if (key.toLowerCase().includes(gpuModel.toLowerCase()) || 
          gpuModel.toLowerCase().includes(key.toLowerCase())) {
        return key;
      }
    }
  }

  // Clean up the input
  const cleanedInput = gpuModel.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  // Try to find a close match
  const gpuKeys = Object.keys(gpuBenchmarks);

  // First try to find a substring match
  for (const key of gpuKeys) {
    if (cleanedInput.includes(key.toLowerCase()) || key.toLowerCase().includes(cleanedInput)) {
      return key;
    }
  }

  // Check for common GPU patterns (e.g., RTX 3070, RX 6700 XT)
  const nvidiaMatch = cleanedInput.match(/(gtx|rtx)\s*\d{4}\s*(ti|super)?/i);
  const amdMatch = cleanedInput.match(/rx\s*\d{4}\s*(xt|xtx)?/i);

  if (nvidiaMatch || amdMatch) {
    const modelPart = nvidiaMatch ? nvidiaMatch[0] : amdMatch[0];

    // Look for partial matches
    for (const key of gpuKeys) {
      if (key.toLowerCase().includes(modelPart)) {
        return key;
      }
    }
  }

  return null;
}

// Extract RAM capacity from a RAM string (e.g., "16GB DDR4 3200MHz" -> 16)
export function extractRamCapacity(ramString: string): number | null {
  if (!ramString) return null;

  const match = ramString.match(/(\d+)\s*gb/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

// Extract RAM speed from a RAM string (e.g., "16GB DDR4 3200MHz" -> 3200)
export function extractRamSpeed(ramString: string): number | null {
  if (!ramString) return null;

  const match = ramString.match(/(\d{3,5})\s*mhz/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

// Determine storage type from a storage string
export function determineStorageType(storageString: string): string {
  if (!storageString) return "SATA SSD"; // default

  const lcStorage = storageString.toLowerCase();

  if (lcStorage.includes('nvme') && lcStorage.includes('gen5')) {
    return "NVMe Gen5";
  }
  if (lcStorage.includes('nvme') && lcStorage.includes('gen4')) {
    return "NVMe Gen4";
  }
  if (lcStorage.includes('nvme') || lcStorage.includes('m.2')) {
    return "NVMe Gen3";
  }
  if (lcStorage.includes('ssd')) {
    return "SATA SSD";
  }
  if (lcStorage.includes('hdd') || lcStorage.includes('hard drive')) {
    return "HDD";
  }

  return "SATA SSD"; // default if can't determine
}

// Calculate performance score for a given PC configuration (0-100)
export function calculatePerformanceScore(config: any, useCase: string = "Gaming"): number {
  try {
    // Get component weights based on use case
    const weights = performanceUseCase[useCase as keyof typeof performanceUseCase] || performanceUseCase["Gaming"];

    // Get CPU score
    let cpuScore = 0;
    let cpuUbmScore = 0;
    let cpuRank = 999; // Large default value
    if (config.cpu) {
      // Try UserBenchmark data first
      const ubmData = getCpuUserBenchmark(config.cpu);
      if (ubmData) {
        cpuUbmScore = ubmData.score;
        cpuRank = ubmData.rank;
        // Normalize UBM score for our system (they max at around 135)
        cpuScore = ubmData.score * 250; // Scale to match our system
      } else {
        // Fall back to our database
        const cpuModel = findClosestCpuMatch(config.cpu);
        if (cpuModel && cpuBenchmarks[cpuModel as keyof typeof cpuBenchmarks]) {
          cpuScore = cpuBenchmarks[cpuModel as keyof typeof cpuBenchmarks].score;
        }
      }
    }

    // Get GPU score
    let gpuScore = 0;
    let gpuUbmScore = 0;
    let gpuRank = 999; // Large default value
    if (config.gpu) {
      // Try UserBenchmark data first
      const ubmData = getGpuUserBenchmark(config.gpu);
      if (ubmData) {
        gpuUbmScore = ubmData.score;
        gpuRank = ubmData.rank;
        // Normalize UBM score for our system (they max at around 180)
        gpuScore = ubmData.score * 380; // Scale to match our system
      } else {
        // Fall back to our database
        const gpuModel = findClosestGpuMatch(config.gpu);
        if (gpuModel && gpuBenchmarks[gpuModel as keyof typeof gpuBenchmarks]) {
          gpuScore = gpuBenchmarks[gpuModel as keyof typeof gpuBenchmarks].score;
        }
      }
    }

    // Get RAM impact
    let ramMultiplier = 1.0;
    let ramUbmScore = 0;
    let ramRank = 999;
    if (config.ram) {
      // Try UserBenchmark data first
      const ubmData = getRamUserBenchmark(config.ram);
      if (ubmData) {
        // Use standard RAM multiplier based on performance scores
        ramMultiplier = 1.0;
      } else {
        // Fall back to the capacity/speed method
        const capacity = extractRamCapacity(config.ram);
        const speed = extractRamSpeed(config.ram);

        if (capacity && capacity.toString() in ramCapacityMultipliers) {
          ramMultiplier *= ramCapacityMultipliers[capacity.toString() as keyof typeof ramCapacityMultipliers];
        } else if (capacity) {
          // Interpolate if exact capacity not found
          const capacities = Object.keys(ramCapacityMultipliers).map(Number).sort((a, b) => a - b);
          let lower = capacities[0];
          let upper = capacities[capacities.length - 1];

          for (let i = 0; i < capacities.length - 1; i++) {
            if (capacities[i] <= capacity && capacities[i+1] > capacity) {
              lower = capacities[i];
              upper = capacities[i+1];
              break;
            }
          }

          const lowerMultiplier = ramCapacityMultipliers[lower.toString() as keyof typeof ramCapacityMultipliers];
          const upperMultiplier = ramCapacityMultipliers[upper.toString() as keyof typeof ramCapacityMultipliers];
          const ratio = (capacity - lower) / (upper - lower);
          ramMultiplier *= lowerMultiplier + (upperMultiplier - lowerMultiplier) * ratio;
        }

        if (speed && speed.toString() in ramSpeedMultipliers) {
          ramMultiplier *= ramSpeedMultipliers[speed.toString() as keyof typeof ramSpeedMultipliers];
        } else if (speed) {
          // Find closest speed
          const speeds = Object.keys(ramSpeedMultipliers).map(Number).sort((a, b) => a - b);
          let closest = speeds[0];
          let minDiff = Math.abs(speed - speeds[0]);

          for (let i = 1; i < speeds.length; i++) {
            const diff = Math.abs(speed - speeds[i]);
            if (diff < minDiff) {
              minDiff = diff;
              closest = speeds[i];
            }
          }

          ramMultiplier *= ramSpeedMultipliers[closest.toString() as keyof typeof ramSpeedMultipliers];
        }
      }
    }

    // Get storage impact
    let storageMultiplier = 1.0;
    let storageUbmScore = 0;
    let storageRank = 999;
    if (config.storage) {
      // Try UserBenchmark data first
      const ubmData = getStorageUserBenchmark(config.storage);
      if (ubmData) {
        storageUbmScore = ubmData.score;
        storageRank = ubmData.rank;
        // Scale storage impact based on score (ranges from ~9-900)
        if (storageUbmScore > 200) {
          // NVMe SSD
          storageMultiplier = 1.05 + (storageUbmScore / 900) * 0.15; // 1.05-1.2
        } else if (storageUbmScore > 100) {
          // SATA SSD
          storageMultiplier = 0.9 + (storageUbmScore / 200) * 0.15; // 0.9-1.05
        } else {
          // HDD
          storageMultiplier = 0.65 + (storageUbmScore / 100) * 0.25; // 0.65-0.9
        }
      } else {
        // Fall back to type-based method
        const storageType = determineStorageType(config.storage);
        storageMultiplier *= storageTypeMultipliers[storageType as keyof typeof storageTypeMultipliers];
      }
    }

    // Normalize scores relative to the highest scores in our database
    // Now using UserBenchmark-calibrated max values
    const maxCpuScore = cpuUbmScore ? 33750 : 13300; // UBM max (135*250) or local max (i9-14900KS)
    const maxGpuScore = gpuUbmScore ? 69540 : 18300; // UBM max (183*380) or local max (RTX 5090)

    const normalizedCpuScore = (cpuScore / maxCpuScore) * 100;
    const normalizedGpuScore = (gpuScore / maxGpuScore) * 100;

    // Calculate weighted score
    const weightedScore = 
      (normalizedCpuScore * weights.cpuWeight) +
      (normalizedGpuScore * weights.gpuWeight) +
      (100 * ramMultiplier * weights.ramWeight) +
      (100 * storageMultiplier * weights.storageWeight);

    // Attach the ranking data to the config for UI display
    if (config.rankData === undefined) config.rankData = {};
    if (cpuRank !== 999) config.rankData.cpuRank = cpuRank;
    if (gpuRank !== 999) config.rankData.gpuRank = gpuRank;
    if (ramRank !== 999) config.rankData.ramRank = ramRank;
    if (storageRank !== 999) config.rankData.storageRank = storageRank;
    if (cpuUbmScore) config.rankData.cpuUbmScore = cpuUbmScore;
    if (gpuUbmScore) config.rankData.gpuUbmScore = gpuUbmScore;
    if (ramUbmScore) config.rankData.ramUbmScore = ramUbmScore;
    if (storageUbmScore) config.rankData.storageUbmScore = storageUbmScore;

    // Return score (0-100)
    return Math.min(100, Math.round(weightedScore));
  } catch (error) {
    console.error("Error calculating performance score:", error);
    return 50; // return middle score on error
  }
}

// Estimate FPS for a specific game at given resolution
export function estimateGameFps(config: any, gameName: string, resolution: string = "1080p"): number {
  try {
    const gameKey = gameName as keyof typeof games;
    if (!games[gameKey]) {
      return 0; // Unknown game
    }

    const game = games[gameKey];
    const baselineFps = game.baseline[resolution as keyof typeof game.baseline] || game.baseline["1080p"];

    // Get CPU and GPU scores
    let cpuScore = 0;
    let cpuUbmScore = 0;
    if (config.cpu) {
      // Try UserBenchmark data first
      const ubmData = getCpuUserBenchmark(config.cpu);
      if (ubmData) {
        cpuUbmScore = ubmData.score;
        // Normalize UBM score for our system
        cpuScore = ubmData.score * 250; // Scale to match our system
      } else {
        // Fall back to our database
        const cpuModel = findClosestCpuMatch(config.cpu);
        if (cpuModel && cpuBenchmarks[cpuModel as keyof typeof cpuBenchmarks]) {
          cpuScore = cpuBenchmarks[cpuModel as keyof typeof cpuBenchmarks].score;
        }
      }
    }

    let gpuScore = 0;
    let gpuUbmScore = 0;
    if (config.gpu) {
      // Try UserBenchmark data first
      const ubmData = getGpuUserBenchmark(config.gpu);
      if (ubmData) {
        gpuUbmScore = ubmData.score;
        // Normalize UBM score for our system
        gpuScore = ubmData.score * 380; // Scale to match our system
      } else {
        // Fall back to our database
        const gpuModel = findClosestGpuMatch(config.gpu);
        if (gpuModel && gpuBenchmarks[gpuModel as keyof typeof gpuBenchmarks]) {
          gpuScore = gpuBenchmarks[gpuModel as keyof typeof gpuBenchmarks].score;
        }
      }
    }

    // If either component is not found, we can't estimate accurately
    if (cpuScore === 0 || gpuScore === 0) {
      return 0;
    }

    // Get baseline components for comparison
    // Using i7-12700K + RTX 3070 as our baseline
    const baselineCpuScore = cpuUbmScore ? 114 * 250 : 11400; // UserBenchmark score * 250 or our score for i7-12700K
    const baselineGpuScore = gpuUbmScore ? 62.4 * 380 : 6240; // UserBenchmark score * 380 or our score for RTX 3070

    // Get relative performance compared to baseline
    const cpuRatio = cpuScore / baselineCpuScore;
    const gpuRatio = gpuScore / baselineGpuScore;

    // Calculate weighted performance ratio based on game's dependencies
    const weightedRatio = 
      (cpuRatio * game.cpuDependency) +
      (gpuRatio * game.gpuDependency);

    // Apply RAM and storage modifiers
    let ramMultiplier = 1.0;
    let ramUbmScore = 0;
    if (config.ram) {
      // Try UserBenchmark data first
      const ubmData = getRamUserBenchmark(config.ram);
      if (ubmData) {
        // Use standard RAM multiplier based on performance scores
        ramMultiplier = 1.0;
      } else {
        // Fall back to the capacity/speed method
        const capacity = extractRamCapacity(config.ram);
        const speed = extractRamSpeed(config.ram);

        if (capacity && capacity.toString() in ramCapacityMultipliers) {
          ramMultiplier *= ramCapacityMultipliers[capacity.toString() as keyof typeof ramCapacityMultipliers];
        }

        if (speed && speed.toString() in ramSpeedMultipliers) {
          ramMultiplier *= ramSpeedMultipliers[speed.toString() as keyof typeof ramSpeedMultipliers];
        }
      }
    }

    let storageMultiplier = 1.0;
    let storageUbmScore = 0;
    if (config.storage) {
      // Try UserBenchmark data first
      const ubmData = getStorageUserBenchmark(config.storage);
      if (ubmData) {
        storageUbmScore = ubmData.score;
        // Scale storage impact based on score (ranges from ~9-900)
        if (storageUbmScore > 200) {
          // NVMe SSD
          storageMultiplier = 1.05 + (storageUbmScore / 900) * 0.15; // 1.05-1.2
        } else if (storageUbmScore > 100) {
          // SATA SSD
          storageMultiplier = 0.9 + (storageUbmScore / 200) * 0.15; // 0.9-1.05
        } else {
          // HDD
          storageMultiplier = 0.65 + (storageUbmScore / 100) * 0.25; // 0.65-0.9
        }
      } else {
        // Fall back to type-based method
        const storageType = determineStorageType(config.storage);
        storageMultiplier *= storageTypeMultipliers[storageType as keyof typeof storageTypeMultipliers];
      }
    }

    // Adjust based on resolution (GPU becomes more important at higher resolutions)
    const resolutionMultiplier = {
      "1080p": 1.0,
      "1440p": 0.9,  // 10% penalty for 1440p
      "4K": 0.65     // 35% penalty for 4K
    };

    // Calculate estimated FPS
    let estimatedFps = baselineFps * weightedRatio * ramMultiplier * storageMultiplier;

    // Apply resolution multiplier (if it's not already factored into the baseline)
    if (resolution !== "1080p") {
      const resMultiplier = resolutionMultiplier[resolution as keyof typeof resolutionMultiplier] || 1.0;
      estimatedFps *= resMultiplier;
    }

    return Math.round(estimatedFps);
  } catch (error) {
    console.error("Error estimating game FPS:", error);
    return 0;
  }
}

// Get game recommendations based on performance
export function getGameRecommendations(config: any): any[] {
  const results = [];

  // Calculate performance score for gaming
  const performanceScore = calculatePerformanceScore(config, "Gaming");

  for (const [gameName, gameData] of Object.entries(games)) {
    const fpsAt1080p = estimateGameFps(config, gameName, "1080p");
    const fpsAt1440p = estimateGameFps(config, gameName, "1440p");
    const fpsAt4K = estimateGameFps(config, gameName, "4K");

    // Rating categories
    let rating1080p = "Poor";
    let rating1440p = "Poor";
    let rating4K = "Poor";

    // For 1080p
    if (fpsAt1080p >= 144) rating1080p = "Excellent";
    else if (fpsAt1080p >= 100) rating1080p = "Very Good";
    else if (fpsAt1080p >= 60) rating1080p = "Good";
    else if (fpsAt1080p >= 30) rating1080p = "Playable";

    // For 1440p
    if (fpsAt1440p >= 144) rating1440p = "Excellent";
    else if (fpsAt1440p >= 100) rating1440p = "Very Good";
    else if (fpsAt1440p >= 60) rating1440p = "Good";
    else if (fpsAt1440p >= 30) rating1440p = "Playable";

    // For 4K
    if (fpsAt4K >= 120) rating4K = "Excellent";
    else if (fpsAt4K >= 80) rating4K = "Very Good";
    else if (fpsAt4K >= 60) rating4K = "Good";
    else if (fpsAt4K >= 30) rating4K = "Playable";

    results.push({
      game: gameData.name,
      performance: {
        "1080p": { fps: fpsAt1080p, rating: rating1080p },
        "1440p": { fps: fpsAt1440p, rating: rating1440p },
        "4K": { fps: fpsAt4K, rating: rating4K }
      }
    });
  }

  // Sort by 1080p performance (highest first)
  results.sort((a, b) => b.performance["1080p"].fps - a.performance["1080p"].fps);

  return results;
}

// Generate a performance summary for the build
export function getPerformanceSummary(config: any): any {
  // Calculate performance scores for different use cases
  const gamingScore = calculatePerformanceScore(config, "Gaming");
  const contentCreationScore = calculatePerformanceScore(config, "Content Creation");
  const officeScore = calculatePerformanceScore(config, "Office & Productivity");

  // Assign ratings based on scores
  let gamingRating = "Entry-level";
  if (gamingScore >= 90) gamingRating = "Enthusiast";
  else if (gamingScore >= 80) gamingRating = "High-end";
  else if (gamingScore >= 65) gamingRating = "Mid-range";
  else if (gamingScore >= 50) gamingRating = "Budget";

  let contentRating = "Entry-level";
  if (contentCreationScore >= 90) contentRating = "Professional";
  else if (contentCreationScore >= 80) contentRating = "High-end";
  else if (contentCreationScore >= 65) contentRating = "Mid-range";
  else if (contentCreationScore >= 50) contentRating = "Budget";

  let officeRating = "Entry-level";
  if (officeScore >= 90) officeRating = "Exceptional";
  else if (officeScore >= 80) officeRating = "Excellent";
  else if (officeScore >= 65) officeRating = "Very Good";
  else if (officeScore >= 50) officeRating = "Good";

  // Get component rankings from UserBenchmark data
  const componentRanks: any = { cpu: {}, gpu: {}, ram: {}, storage: {} };

  // CPU rank data
  if (config.cpu) {
    const cpuUbmData = getCpuUserBenchmark(config.cpu);
    if (cpuUbmData) {
      componentRanks.cpu = {
        score: cpuUbmData.score,
        rank: cpuUbmData.rank,
        samples: cpuUbmData.samples,
        percentile: Math.min(99, Math.max(1, 100 - (cpuUbmData.rank / 150) * 100))
      };
    }
  }

  // GPU rank data
  if (config.gpu) {
    const gpuUbmData = getGpuUserBenchmark(config.gpu);
    if (gpuUbmData) {
      componentRanks.gpu = {
        score: gpuUbmData.score,
        rank: gpuUbmData.rank,
        samples: gpuUbmData.samples,
        percentile: Math.min(99, Math.max(1, 100 - (gpuUbmData.rank / 150) * 100))
      };
    }
  }

  // RAM rank data
  if (config.ram) {
    const ramUbmData = getRamUserBenchmark(config.ram);
    if (ramUbmData) {
      componentRanks.ram = {
        score: ramUbmData.score,
        rank: ramUbmData.rank,
        samples: ramUbmData.samples,
        percentile: Math.min(99, Math.max(1, 100 - (ramUbmData.rank / 45) * 100))
      };
    }
  }

  // Storage rank data
  if (config.storage) {
    const storageUbmData = getStorageUserBenchmark(config.storage);
    if (storageUbmData) {
      componentRanks.storage = {
        score: storageUbmData.score,
        rank: storageUbmData.rank,
        samples: storageUbmData.samples,
        percentile: Math.min(99, Math.max(1, 100 - (storageUbmData.rank / 300) * 100))
      };

      // Calculate SSD vs HDD difference
      if (storageUbmData.score > 120) {
        componentRanks.storage.type = "SSD";
        if (storageUbmData.score > 300) {
          componentRanks.storage.subtype = "NVMe";
        } else {
          componentRanks.storage.subtype = "SATA";
        }
      } else {
        componentRanks.storage.type = "HDD";
      }
    }
  }

  // Calculate balanced vs unbalanced system
  let bottleneckInfo = null;
  if (componentRanks.cpu.percentile && componentRanks.gpu.percentile) {
    const cpuPercentile = componentRanks.cpu.percentile;
    const gpuPercentile = componentRanks.gpu.percentile;
    const difference = Math.abs(cpuPercentile - gpuPercentile);

    if (difference > 30) {
      if (cpuPercentile > gpuPercentile) {
        bottleneckInfo = {
          type: "GPU bottleneck",
          severity: difference > 50 ? "severe" : "moderate",
          message: `Your GPU (${config.gpu}) is significantly slower than your CPU (${config.cpu}), limiting overall system performance.`
        };
      } else {
        bottleneckInfo = {
          type: "CPU bottleneck",
          severity: difference > 50 ? "severe" : "moderate",
          message: `Your CPU (${config.cpu}) is significantly slower than your GPU (${config.gpu}), limiting overall system performance.`
        };
      }
    }
  }

  // Create overall rating
  const overall = Math.round((gamingScore + contentCreationScore + officeScore) / 3);

  // Generate recommendations based on benchmarks
  const recommendations = [];

  if (bottleneckInfo) {
    if (bottleneckInfo.type === "GPU bottleneck") {
      recommendations.push("Consider upgrading your GPU to better match your CPU's capabilities.");
    } else {
      recommendations.push("Consider upgrading your CPU to better match your GPU's capabilities.");
    }
  }

  if (componentRanks.ram.percentile && componentRanks.ram.percentile < 50) {
    recommendations.push("Your RAM may be limiting system performance. Consider faster memory with higher frequency.");
  }

  if (componentRanks.storage.type === "HDD") {
    recommendations.push("Upgrading to an SSD would significantly improve system responsiveness and load times.");
  } else if (componentRanks.storage.subtype === "SATA" && overall > 70) {
    recommendations.push("For a high-performance system like yours, an NVMe SSD would provide faster data access than your current SATA SSD.");
  }

  return {
    gaming: {
      score: gamingScore,
      rating: gamingRating
    },
    contentCreation: {
      score: contentCreationScore,
      rating: contentRating
    },
    office: {
      score: officeScore,
      rating: officeRating
    },
    overall: overall,
    components: componentRanks,
    bottleneck: bottleneckInfo,
    recommendations: recommendations
  };
}