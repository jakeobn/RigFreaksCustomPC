// UserBenchmark data extracted from userbenchmark.com
// CPU data
export const cpuUserBenchmarks: Record<string, { score: number, rank: number, samples: number }> = {
  // Intel CPUs
  "Core i9-14900KS": { score: 133, rank: 1, samples: 1592 },
  "Core i9-14900KF": { score: 131, rank: 2, samples: 7773 },
  "Core i9-14900K": { score: 131, rank: 3, samples: 19876 },
  "Core i9-13900KS": { score: 131, rank: 4, samples: 4204 },
  "Core i7-14700KF": { score: 130, rank: 5, samples: 4842 },
  "Core i7-14700K": { score: 130, rank: 6, samples: 10287 },
  "Core i9-13900KF": { score: 129, rank: 7, samples: 16914 },
  "Core i9-13900K": { score: 129, rank: 8, samples: 49132 },
  "Core i7-13700KF": { score: 126, rank: 9, samples: 20009 },
  "Core i7-13700K": { score: 126, rank: 10, samples: 38490 },
  "Core i9-14900": { score: 124, rank: 11, samples: 226 },
  "Core i9-14900F": { score: 124, rank: 12, samples: 1023 },
  "Core i5-14600KF": { score: 124, rank: 13, samples: 4869 },
  "Core i9-13900F": { score: 124, rank: 14, samples: 824 },
  "Core i5-14600K": { score: 124, rank: 15, samples: 3343 },
  "Core i9-13900": { score: 123, rank: 16, samples: 1007 },
  "Core i5-13600K": { score: 122, rank: 18, samples: 27559 },
  "Core i5-13600KF": { score: 122, rank: 19, samples: 33334 },
  "Core Ultra 9 285K": { score: 121, rank: 20, samples: 91 },
  "Core i7-14700F": { score: 121, rank: 21, samples: 7379 },
  "Core i7-14700": { score: 121, rank: 22, samples: 1584 },
  "Core i7-13700F": { score: 121, rank: 23, samples: 4561 },
  "Core i7-13700": { score: 121, rank: 24, samples: 2216 },
  "Core i9-12900KS": { score: 119, rank: 27, samples: 7188 },
  "Core Ultra 7 265K": { score: 119, rank: 28, samples: 144 },
  "Core i9-14900HX": { score: 118, rank: 30, samples: 3762 },
  "Core Ultra 5 245K": { score: 117, rank: 32, samples: 36 },
  "Core i9-12900K": { score: 117, rank: 34, samples: 101563 },
  "Core i9-12900KF": { score: 117, rank: 35, samples: 15291 },
  "Core i9-13980HX": { score: 117, rank: 36, samples: 6602 },
  "Core i5-13600": { score: 117, rank: 37, samples: 97 },
  "Core i5-14600": { score: 116, rank: 40, samples: 95 },
  "Core i9-13950HX": { score: 116, rank: 41, samples: 1007 },
  "Core i9-13900HX": { score: 115, rank: 43, samples: 8200 },
  "Core i7-12700K": { score: 114, rank: 46, samples: 133111 },
  "Core i7-12700KF": { score: 114, rank: 47, samples: 70812 },
  "Core i5-14500": { score: 114, rank: 48, samples: 345 },
  "Core i9-12900F": { score: 113, rank: 50, samples: 2318 },
  "Core i5-13500": { score: 113, rank: 51, samples: 4279 },
  "Core i7-14700HX": { score: 112, rank: 53, samples: 1072 },
  "Core i7-13850HX": { score: 111, rank: 54, samples: 183 },
  "Core i9-12900": { score: 111, rank: 55, samples: 2410 },
  "Core i5-12600KF": { score: 109, rank: 57, samples: 40032 },
  "Core i7-12700F": { score: 109, rank: 58, samples: 31910 },
  "Core i5-12600K": { score: 109, rank: 59, samples: 101563 },
  "Core i7-12700": { score: 108, rank: 62, samples: 25535 },
  "Core i7-13700HX": { score: 108, rank: 63, samples: 4526 },
  "Core i9-13900H": { score: 107, rank: 64, samples: 4699 },
  "Core i5-14400F": { score: 107, rank: 65, samples: 1254 },
  "Core i5-14400": { score: 107, rank: 66, samples: 129 },
  "Core i9-12950HX": { score: 107, rank: 67, samples: 515 },
  
  // AMD CPUs
  "Ryzen 7 9800X3D": { score: 122, rank: 17, samples: 2321 },
  "Ryzen 9 9950X3D": { score: 120, rank: 25, samples: 134 },
  "Ryzen 9 9900X3D": { score: 119, rank: 26, samples: 79 },
  "Ryzen 9 9950X": { score: 118, rank: 29, samples: 218 },
  "Ryzen 9 9900X": { score: 117, rank: 31, samples: 319 },
  "Ryzen 7 7800X3D": { score: 117, rank: 33, samples: 17872 },
  "Ryzen 7 9700X": { score: 116, rank: 38, samples: 421 },
  "Ryzen 9 7950X3D": { score: 116, rank: 39, samples: 1499 },
  "Ryzen 9 7900X3D": { score: 115, rank: 42, samples: 2814 },
  "Ryzen 9 7950X": { score: 114, rank: 44, samples: 2969 },
  "Ryzen 5 9600X": { score: 114, rank: 45, samples: 324 },
  "Ryzen 9 7900X": { score: 113, rank: 49, samples: 6076 },
  "Ryzen 7 7700X": { score: 112, rank: 52, samples: 7256 },
  "Ryzen 5 7600X": { score: 110, rank: 56, samples: 7902 },
  "Ryzen 7 7700": { score: 109, rank: 60, samples: 2291 },
  "Ryzen 9 7900": { score: 109, rank: 61, samples: 939 },
  "Ryzen 5 7600X3D": { score: 106, rank: 68, samples: 324 },
  "Ryzen 5 7600": { score: 106, rank: 73, samples: 5938 },
  "Ryzen 7 5800X3D": { score: 104, rank: 76, samples: 23248 },
  "Ryzen 5 7500F": { score: 103, rank: 81, samples: 5284 },
  "Ryzen 9 5950X": { score: 100, rank: 89, samples: 33026 },
  "Ryzen 5 5600X3D": { score: 100, rank: 90, samples: 1473 },
  "Ryzen 7 5800XT": { score: 99, rank: 100, samples: 193 },
  "Ryzen 9 5900X": { score: 99, rank: 102, samples: 37992 }
};

// GPU data
export const gpuUserBenchmarks: Record<string, { score: number, rank: number, samples: number }> = {
  // NVIDIA GPUs
  "RTX 5090": { score: 183, rank: 1, samples: 416 },
  "RTX 4090": { score: 155, rank: 2, samples: 121235 },
  "RTX 5080": { score: 139, rank: 3, samples: 2771 },
  "RTX 4080 Super": { score: 126, rank: 4, samples: 17475 },
  "RTX 4080": { score: 122, rank: 5, samples: 80552 },
  "RTX 5070 Ti": { score: 120, rank: 6, samples: 2098 },
  "RTX 4070 Ti Super": { score: 105, rank: 8, samples: 21854 },
  "RTX 4070 Ti": { score: 101, rank: 9, samples: 120180 },
  "RTX 5070": { score: 99, rank: 10, samples: 1741 },
  "RTX 3090 Ti": { score: 97.3, rank: 12, samples: 28639 },
  "RTX 4070 Super": { score: 91, rank: 14, samples: 48442 },
  "RTX 3090": { score: 87.4, rank: 16, samples: 252728 },
  "RTX 4090 Laptop": { score: 86.5, rank: 17, samples: 7142 },
  "RTX 3080 Ti": { score: 86.3, rank: 18, samples: 275308 },
  "RTX 4070": { score: 80, rank: 22, samples: 122223 },
  "RTX 4060 Ti 16GB": { score: 72.6, rank: 31, samples: 2329 },
  "RTX 3080 12GB": { score: 71.5, rank: 34, samples: 24343 },
  "RTX 3080": { score: 69.2, rank: 38, samples: 389700 },
  "RTX 4060 Ti": { score: 68.3, rank: 41, samples: 68401 },
  "RTX 3070 Ti": { score: 66, rank: 43, samples: 123664 },
  "RTX 3070": { score: 62.4, rank: 47, samples: 345344 },
  "RTX 2080 Ti": { score: 59.7, rank: 51, samples: 206825 },
  "RTX 4060": { score: 57.9, rank: 54, samples: 154428 },
  "RTX 3060 Ti": { score: 56.9, rank: 56, samples: 401066 },
  "RTX 2080 Super": { score: 51.5, rank: 62, samples: 73767 },
  "RTX 2080": { score: 49.6, rank: 64, samples: 146748 },
  "RTX 2070 Super": { score: 48.1, rank: 66, samples: 192857 },
  "RTX 3060": { score: 43.9, rank: 72, samples: 584962 },
  "RTX 2070": { score: 43.7, rank: 73, samples: 167080 },
  "RTX 2060 Super": { score: 41.4, rank: 77, samples: 80986 },
  "RTX 3050": { score: 38.3, rank: 82, samples: 248123 },
  "RTX 2060": { score: 37.3, rank: 85, samples: 329632 },
  "GTX 1660 Ti": { score: 30.9, rank: 94, samples: 206394 },
  "GTX 1660 Super": { score: 30.1, rank: 96, samples: 339602 },
  "GTX 1660": { score: 27.5, rank: 99, samples: 140844 },
  "GTX 1650 Super": { score: 26.4, rank: 101, samples: 106126 },
  "GTX 1650": { score: 21.7, rank: 105, samples: 329748 },
  
  // AMD GPUs
  "RX 7900 XTX": { score: 108, rank: 7, samples: 5084 },
  "RX 9070 XT": { score: 97.7, rank: 11, samples: 115 },
  "RX 7900 XT": { score: 92.8, rank: 13, samples: 1931 },
  "RX 9070": { score: 88.5, rank: 15, samples: 55 },
  "RX 6950 XT": { score: 84.2, rank: 19, samples: 5892 },
  "RX 7900 GRE": { score: 81.7, rank: 20, samples: 307 },
  "RX 6900 XT": { score: 81.7, rank: 21, samples: 29826 },
  "RX 7800 XT": { score: 76.5, rank: 27, samples: 19350 },
  "RX 6800 XT": { score: 70.2, rank: 36, samples: 65947 },
  "RX 6800": { score: 66.2, rank: 42, samples: 28456 },
  "RX 7700 XT": { score: 63.1, rank: 46, samples: 18246 },
  "RX 6750 XT": { score: 57.4, rank: 55, samples: 10073 },
  "RX 6700 XT": { score: 55.7, rank: 58, samples: 92201 },
  "RX 6650 XT": { score: 47.6, rank: 67, samples: 9499 },
  "RX 6600 XT": { score: 45.1, rank: 70, samples: 49978 },
  "RX 6600": { score: 40.7, rank: 79, samples: 50761 },
  "RX 5700 XT": { score: 38.7, rank: 81, samples: 121963 },
  "RX 5700": { score: 36.3, rank: 88, samples: 26795 },
  "RX 5600 XT": { score: 33.4, rank: 92, samples: 52158 },
  "RX 580": { score: 21.1, rank: 106, samples: 254037 },
  "RX 570": { score: 19.1, rank: 109, samples: 146371 },
  "RX 560": { score: 12.6, rank: 123, samples: 47761 },
  "RX 550": { score: 8.85, rank: 135, samples: 36968 }
};

// SSD data
export const ssdUserBenchmarks: Record<string, { score: number, rank: number, samples: number }> = {
  // NVMe SSDs
  "Samsung 9100 Pro 4TB": { score: 897, rank: 1, samples: 84 },
  "Samsung 9100 Pro 2TB": { score: 845, rank: 2, samples: 158 },
  "Crucial T705 4TB": { score: 766, rank: 3, samples: 390 },
  "Crucial T705 2TB": { score: 737, rank: 4, samples: 751 },
  "Crucial T700 4TB": { score: 716, rank: 5, samples: 1175 },
  "Samsung 9100 Pro 1TB": { score: 700, rank: 6, samples: 93 },
  "Crucial T700 2TB": { score: 658, rank: 7, samples: 2334 },
  "Crucial T705 1TB": { score: 577, rank: 8, samples: 610 },
  "Crucial T700 1TB": { score: 569, rank: 9, samples: 2773 },
  "WD Black SN850X 8TB": { score: 562, rank: 10, samples: 140 },
  "WD Black SN850X 4TB": { score: 546, rank: 11, samples: 13471 },
  "WD Black SN850X 2TB": { score: 492, rank: 12, samples: 37629 },
  "Samsung 990 Pro 4TB": { score: 475, rank: 13, samples: 9414 },
  "Samsung 990 Evo Plus 4TB": { score: 471, rank: 14, samples: 720 },
  "WD Black SN850 2TB": { score: 464, rank: 15, samples: 1131 },
  "Samsung 990 Pro 2TB": { score: 460, rank: 16, samples: 98000 },
  "Samsung 990 Evo Plus 2TB": { score: 454, rank: 17, samples: 1888 },
  "WD Black SN850X 1TB": { score: 443, rank: 18, samples: 37972 },
  "Intel 900P Optane 280GB": { score: 440, rank: 19, samples: 3427 },
  "Crucial P5 Plus 2TB": { score: 438, rank: 20, samples: 14975 },
  "Samsung 980 Pro 2TB": { score: 402, rank: 23, samples: 182136 },
  "Samsung 990 Pro 1TB": { score: 402, rank: 24, samples: 34940 },
  "WD Black SN850 1TB": { score: 395, rank: 25, samples: 14499 },
  "Crucial P5 Plus 1TB": { score: 385, rank: 26, samples: 27673 },
  "Samsung 980 Pro 1TB": { score: 385, rank: 27, samples: 327441 },
  "WD Black SN850 500GB": { score: 379, rank: 28, samples: 771 },
  "Samsung 990 Evo Plus 1TB": { score: 362, rank: 29, samples: 1379 },
  "Samsung 970 Evo Plus 2TB": { score: 336, rank: 35, samples: 200600 },
  "Samsung 990 Evo 2TB": { score: 330, rank: 36, samples: 3355 },
  "Crucial P5 Plus 500GB": { score: 328, rank: 37, samples: 8064 },
  "Samsung 970 Pro 1TB": { score: 327, rank: 38, samples: 38669 },
  "Samsung 970 Pro 512GB": { score: 322, rank: 39, samples: 93447 },
  "Samsung 990 Evo 1TB": { score: 312, rank: 42, samples: 3156 },
  "Samsung 970 Evo Plus 1TB": { score: 310, rank: 43, samples: 455997 },
  "WD Black SN770 250GB": { score: 304, rank: 44, samples: 1176 },
  "Samsung 970 Evo 1TB": { score: 297, rank: 47, samples: 331647 },
  "Samsung 970 Evo 2TB": { score: 290, rank: 48, samples: 10709 },
  "Crucial P5 2TB": { score: 283, rank: 50, samples: 4222 },
  "Crucial P5 1TB": { score: 283, rank: 51, samples: 34104 },
  "Samsung 960 Pro 1TB": { score: 279, rank: 52, samples: 18356 },
  
  // SATA SSDs
  "Samsung 870 Evo 4TB": { score: 143, rank: 192, samples: 6392 },
  "Samsung 870 Evo 2TB": { score: 135, rank: 202, samples: 53431 },
  "Samsung 870 Evo 1TB": { score: 134, rank: 205, samples: 189414 },
  "Samsung 870 Evo 500GB": { score: 133, rank: 209, samples: 157022 },
  "Samsung 860 Evo 4TB": { score: 132, rank: 211, samples: 3429 },
  "Samsung 860 Evo 2TB": { score: 131, rank: 216, samples: 21992 },
  "Samsung 860 Evo 1TB": { score: 128, rank: 223, samples: 287850 },
  "Samsung 860 Evo 500GB": { score: 126, rank: 232, samples: 312057 },
  "Crucial MX500 2TB": { score: 126, rank: 230, samples: 29384 },
  "Crucial MX500 1TB": { score: 123, rank: 240, samples: 273474 },
  "Crucial MX500 500GB": { score: 123, rank: 243, samples: 280957 },
  "WD Blue 3D 1TB": { score: 120, rank: 254, samples: 157380 },
  "Kingston KC600 1TB": { score: 120, rank: 257, samples: 11352 },
  "WD Blue 3D 500GB": { score: 119, rank: 258, samples: 187642 },
  "Samsung 850 Evo 1TB": { score: 116, rank: 270, samples: 387343 },
  "Samsung 850 Evo 500GB": { score: 115, rank: 275, samples: 746318 }
};

// RAM data
export const ramUserBenchmarks: Record<string, { score: number, rank: number, samples: number }> = {
  // DDR5 RAM
  "Corsair Vengeance RGB DDR5 6400 C32 2x32GB": { score: 207, rank: 1, samples: 3673 },
  "Corsair Vengeance RGB DDR5 6000 C30 2x16GB": { score: 206, rank: 2, samples: 13762 },
  "G.SKILL TZ/RJ/FX DDR5 7200 C34 2x16GB": { score: 201, rank: 3, samples: 3920 },
  "G.SKILL TZ/RJ/FX DDR5 6000 C30 2x32GB": { score: 192, rank: 4, samples: 7918 },
  "G.SKILL TZ/RJ/FX DDR5 6400 C32 2x32GB": { score: 188, rank: 5, samples: 6571 },
  "G.SKILL TZ/RJ/FX DDR5 6400 C32 2x16GB": { score: 187, rank: 6, samples: 18403 },
  "G.SKILL TZ/RJ/FX DDR5 6000 C30 2x16GB": { score: 184, rank: 7, samples: 17261 },
  "G.SKILL TZ/RJ/FX DDR5 5600 C30 2x32GB": { score: 180, rank: 8, samples: 1573 },
  "Corsair Vengeance RGB DDR5 6400 C36 2x16GB": { score: 173, rank: 9, samples: 3900 },
  "G.SKILL TZ/RJ/FX DDR5 6400 C36 2x16GB": { score: 173, rank: 10, samples: 39467 },
  "G.SKILL TZ/RJ/FL DDR5 6000 C32 2x16GB": { score: 170, rank: 11, samples: 9528 },
  "G.SKILL TZ/RJ/FL DDR5 6000 C36 2x16GB": { score: 168, rank: 12, samples: 31229 },
  "Corsair Vengeance DDR5 6000 C36 2x16GB": { score: 167, rank: 13, samples: 3231 },
  "Corsair Vengeance RGB DDR5 6000 C36 2x16GB": { score: 167, rank: 14, samples: 13495 },
  "Corsair Vengeance DDR5 5600 C36 2x16GB": { score: 162, rank: 15, samples: 40739 },
  "Kingston Fury DDR5 5600 C40 2x16GB": { score: 161, rank: 16, samples: 9287 },
  "Kingston Fury DDR5 5600 C40 2x8GB": { score: 141, rank: 17, samples: 4309 },
  
  // DDR4 RAM
  "G.SKILL Ripjaws 4 DDR4 2400 C14 8x16GB": { score: 121, rank: 18, samples: 53 },
  "G.SKILL Trident Z DDR4 3200 C14 4x16GB": { score: 116, rank: 19, samples: 1197 },
  "Crucial Ballistix Sport DDR4 2400 C16 8x4GB": { score: 110, rank: 20, samples: 125 },
  "Crucial Ballistix Elite DDR4 3600 C16 4x8GB": { score: 108, rank: 21, samples: 1449 },
  "G.SKILL Flare X DDR4 3200 C14 4x8GB": { score: 106, rank: 22, samples: 7103 },
  "G.SKILL Trident Z DDR4 3200 C15 4x16GB": { score: 103, rank: 23, samples: 211 },
  "Corsair Dominator DDR4 3000 C15 4x16GB": { score: 99.3, rank: 24, samples: 133 },
  "Corsair Vengeance LPX DDR4 3600 C18 2x16GB": { score: 98.6, rank: 25, samples: 17829 },
  "G.SKILL Trident Z DDR4 3600 C16 2x8GB": { score: 97.8, rank: 26, samples: 4081 },
  "G.SKILL Flare X DDR4 3200 C14 2x8GB": { score: 97.8, rank: 27, samples: 54616 },
  "Crucial Ballistix Sport DDR4 2400 C16 4x4GB": { score: 97.4, rank: 28, samples: 1914 },
  "G.SKILL Trident Z DDR4 3600 C17 2x8GB": { score: 96.2, rank: 29, samples: 1785 },
  "Corsair Vengeance LPX DDR4 2666 C15 4x8GB": { score: 95.5, rank: 30, samples: 798 },
  "Crucial Ballistix Elite DDR4 3600 C16 2x8GB": { score: 95.2, rank: 31, samples: 3032 },
  "G.SKILL Ripjaws V DDR4 3200 C16 4x16GB": { score: 94.5, rank: 32, samples: 14506 },
  "HyperX Fury DDR4 2666 C15 4x8GB": { score: 92.4, rank: 33, samples: 7179 },
  "G.SKILL Ripjaws 4 DDR4 3000 C15 4x4GB": { score: 92.1, rank: 34, samples: 3507 },
  "G.SKILL Ripjaws 4 DDR4 2800 C16 4x4GB": { score: 91.9, rank: 35, samples: 1513 },
  "G.SKILL Trident Z DDR4 3600 C17 2x4GB": { score: 91.4, rank: 36, samples: 153 },
  "Corsair Vengeance RGB DDR4 3466 C16 2x8GB": { score: 91.3, rank: 37, samples: 5267 },
  "Corsair Vengeance LPX DDR4 3000 C15 4x4GB": { score: 90.9, rank: 38, samples: 6794 },
  "Corsair Vengeance LPX DDR4 3600 C18 2x8GB": { score: 89.4, rank: 39, samples: 87344 },
  "Corsair Vengeance RGB DDR4 3600 C18 2x8GB": { score: 89, rank: 40, samples: 5582 },
  "Corsair Vengeance RGB PRO DDR4 3200 C16 2x16GB": { score: 88.5, rank: 41, samples: 144399 },
  "Corsair Vengeance LPX DDR4 2800 C16 4x4GB": { score: 88.5, rank: 42, samples: 3970 },
  "Corsair Vengeance LPX DDR4 2666 C16 4x4GB": { score: 87.9, rank: 43, samples: 5380 },
  "Corsair Vengeance LPX DDR4 3200 C16 2x16GB": { score: 87.5, rank: 44, samples: 110884 }
};

// HDD data
export const hddUserBenchmarks: Record<string, { score: number, rank: number, samples: number }> = {
  "WD Gold 12TB (2017)": { score: 113, rank: 1, samples: 1221 },
  "WD Gold 10TB (2016)": { score: 107, rank: 2, samples: 1110 },
  "WD Gold 6TB (2016)": { score: 101, rank: 3, samples: 2043 },
  "WD Gold 8TB (256MB Cache 2017)": { score: 100, rank: 4, samples: 695 },
  "WD Red Pro 6TB (2015)": { score: 99.8, rank: 5, samples: 995 },
  "WD Black 6TB (2016)": { score: 97.8, rank: 6, samples: 6443 },
  "HGST Deskstar NAS 6TB": { score: 94.9, rank: 7, samples: 974 },
  "WD Gold 8TB (128MB Cache 2016)": { score: 94.8, rank: 8, samples: 288 },
  "WD VelociRaptor 1TB": { score: 94.6, rank: 9, samples: 8165 },
  "Seagate Constellation CS 3TB": { score: 93.9, rank: 10, samples: 667 },
  "WD VelociRaptor 2.5\" 500GB": { score: 93.2, rank: 11, samples: 435 },
  "WD Black 4TB (2016)": { score: 92.4, rank: 12, samples: 9888 },
  "Seagate Barracuda 1TB (2016)": { score: 92.3, rank: 13, samples: 1120098 },
  "Seagate Barracuda 3TB (2016)": { score: 92.1, rank: 14, samples: 112118 },
  "Seagate Barracuda 2TB (2016)": { score: 91.6, rank: 15, samples: 462780 },
  "WD Black 6TB (2015)": { score: 91.6, rank: 16, samples: 5447 },
  "HGST Ultrastar He8 Helium 8TB": { score: 91.3, rank: 17, samples: 1061 },
  "WD Gold 4TB (2016)": { score: 91.1, rank: 18, samples: 4829 },
  "Seagate Video SV35.6 Series 3TB": { score: 90.5, rank: 19, samples: 6381 },
  "Seagate Desktop HDD 6TB (2014)": { score: 90.5, rank: 20, samples: 1278 },
  "Seagate Desktop HDD 6TB (2015)": { score: 90.3, rank: 21, samples: 691 },
  "Seagate Video SV35.6 Series 1TB": { score: 90.2, rank: 22, samples: 17310 },
  "WD VelociRaptor 250GB": { score: 90, rank: 23, samples: 3015 },
  "Seagate Desktop HDD 5TB (2015)": { score: 89.8, rank: 24, samples: 281 },
  "Seagate IronWolf 4TB (2016)": { score: 89.6, rank: 25, samples: 26217 },
  "WD VelociRaptor 500GB": { score: 89.4, rank: 26, samples: 8133 },
  "Seagate Barracuda 7200.14 1TB": { score: 89.2, rank: 27, samples: 1562409 },
  "WD Red 10TB (2017)": { score: 89.2, rank: 28, samples: 1763 },
  "Seagate Video SV35.6 Series 2TB": { score: 89, rank: 29, samples: 12330 },
  "WD Black 2TB (2013)": { score: 88.5, rank: 30, samples: 144544 },
  "Seagate Barracuda 7200.14 3TB": { score: 88.3, rank: 31, samples: 235501 },
  "Seagate Barracuda 7200.14 2TB": { score: 88.2, rank: 32, samples: 815515 },
  "Toshiba X300 5TB": { score: 88.2, rank: 33, samples: 12743 },
  "Toshiba P300 2TB": { score: 87.9, rank: 34, samples: 100891 },
  "WD Gold 2TB (2016)": { score: 87.8, rank: 35, samples: 5580 },
  "Seagate SkyHawk 4TB (2016)": { score: 87.2, rank: 36, samples: 7966 },
  "Seagate Barracuda 2TB (2018)": { score: 86.9, rank: 37, samples: 695066 },
  "Toshiba MD04ACA600 6TB": { score: 86.8, rank: 38, samples: 686 },
  "Toshiba X300 6TB": { score: 86.8, rank: 39, samples: 5594 },
  "Toshiba P300 3TB": { score: 86.6, rank: 40, samples: 74038 },
  "Seagate Constellation CS 2TB": { score: 86.3, rank: 41, samples: 576 },
  "Toshiba DT01ACA200 2TB": { score: 85.7, rank: 42, samples: 344862 },
  "HGST Deskstar NAS 5TB": { score: 85.6, rank: 43, samples: 660 },
  "WD Red 8TB (2017)": { score: 85.5, rank: 44, samples: 4534 },
  "Toshiba MD04ACA500 5TB": { score: 85.4, rank: 45, samples: 3810 },
  "WD Red Pro 3TB (2014)": { score: 85.2, rank: 46, samples: 548 },
  "WD Black 5TB (2015)": { score: 84.9, rank: 47, samples: 7245 },
  "WD Gold 1TB (2016)": { score: 84.9, rank: 48, samples: 2872 },
  "Toshiba DT01ACA300 3TB": { score: 84.7, rank: 49, samples: 85620 },
  "Seagate FireCuda SSHD 2TB (2016)": { score: 84.5, rank: 50, samples: 133734 }
};

// Map old names to new UserBenchmark names
export const cpuNameMap: Record<string, string> = {
  // Intel - Old name to new name mapping
  "i9-14900KS": "Core i9-14900KS",
  "i9-14900KF": "Core i9-14900KF",
  "i9-14900K": "Core i9-14900K",
  "i9-13900KS": "Core i9-13900KS",
  "i7-14700KF": "Core i7-14700KF",
  "i7-14700K": "Core i7-14700K",
  "i9-13900KF": "Core i9-13900KF",
  "i9-13900K": "Core i9-13900K",
  "i7-13700KF": "Core i7-13700KF",
  "i7-13700K": "Core i7-13700K",
  "i9-14900": "Core i9-14900",
  "i9-14900F": "Core i9-14900F",
  "i5-14600KF": "Core i5-14600KF",
  "i9-13900F": "Core i9-13900F",
  "i5-14600K": "Core i5-14600K",
  "i9-13900": "Core i9-13900",
  "i5-13600K": "Core i5-13600K",
  "i5-13600KF": "Core i5-13600KF",
  "i5-14600": "Core i5-14600",
  "i5-13500": "Core i5-13500",
  "i9-12900": "Core i9-12900",
  "i5-12600KF": "Core i5-12600KF",
  "i7-12700F": "Core i7-12700F",
  "i5-12600K": "Core i5-12600K",
  "i7-12700K": "Core i7-12700K",
  "i7-12700KF": "Core i7-12700KF",
  "i5-14400F": "Core i5-14400F",
  "i5-14400": "Core i5-14400",
  "i7-12700": "Core i7-12700",
  "i9-12900K": "Core i9-12900K",
  "i9-12900KF": "Core i9-12900KF",
  "i9-12900KS": "Core i9-12900KS",
  "i5-13400F": "Core i5-13400F",
  "i5-13400": "Core i5-13400",
  "i5-12600": "Core i5-12600"
};

export const gpuNameMap: Record<string, string> = {
  // Convert from our current naming to UserBenchmark naming
  "RTX 4090": "RTX 4090",
  "RTX 4080 Super": "RTX 4080 Super",
  "RTX 4080": "RTX 4080",
  "RTX 4070 Ti Super": "RTX 4070 Ti Super",
  "RTX 4070 Ti": "RTX 4070 Ti",
  "RTX 4070 Super": "RTX 4070 Super",
  "RTX 4070": "RTX 4070",
  "RTX 4060 Ti": "RTX 4060 Ti",
  "RTX 4060": "RTX 4060",
  "RTX 3090 Ti": "RTX 3090 Ti",
  "RTX 3090": "RTX 3090",
  "RTX 3080 Ti": "RTX 3080 Ti",
  "RTX 3080": "RTX 3080",
  "RTX 3070 Ti": "RTX 3070 Ti",
  "RTX 3070": "RTX 3070",
  "RTX 3060 Ti": "RTX 3060 Ti",
  "RTX 3060": "RTX 3060",
  "RTX 3050": "RTX 3050",
  "RTX 2080 Ti": "RTX 2080 Ti",
  "RTX 2080 Super": "RTX 2080 Super",
  "RTX 2080": "RTX 2080",
  "RTX 2070 Super": "RTX 2070 Super",
  "RTX 2070": "RTX 2070",
  "RTX 2060 Super": "RTX 2060 Super",
  "RTX 2060": "RTX 2060",
  "GTX 1660 Ti": "GTX 1660 Ti",
  "GTX 1660 Super": "GTX 1660 Super",
  "GTX 1660": "GTX 1660",
  "GTX 1650 Super": "GTX 1650 Super",
  "GTX 1650": "GTX 1650"
};

// Helper functions to get UserBenchmark scores
export function getCpuUserBenchmark(cpuModel: string): { score: number, rank: number, samples: number } | null {
  if (!cpuModel) return null;
  
  // Clean up the input
  const cleanedInput = cpuModel.trim();
  
  // Direct match
  if (cpuUserBenchmarks[cleanedInput]) {
    return cpuUserBenchmarks[cleanedInput];
  }
  
  // Check map for remapped names
  if (cpuNameMap[cleanedInput] && cpuUserBenchmarks[cpuNameMap[cleanedInput]]) {
    return cpuUserBenchmarks[cpuNameMap[cleanedInput]];
  }
  
  // Try to find a partial match
  for (const key of Object.keys(cpuUserBenchmarks)) {
    if (cleanedInput.includes(key) || key.includes(cleanedInput)) {
      return cpuUserBenchmarks[key];
    }
  }
  
  return null;
}

export function getGpuUserBenchmark(gpuModel: string): { score: number, rank: number, samples: number } | null {
  if (!gpuModel) return null;
  
  // Clean up the input
  const cleanedInput = gpuModel.trim();
  
  // Direct match
  if (gpuUserBenchmarks[cleanedInput]) {
    return gpuUserBenchmarks[cleanedInput];
  }
  
  // Check map for remapped names
  if (gpuNameMap[cleanedInput] && gpuUserBenchmarks[gpuNameMap[cleanedInput]]) {
    return gpuUserBenchmarks[gpuNameMap[cleanedInput]];
  }
  
  // Try to find a partial match
  for (const key of Object.keys(gpuUserBenchmarks)) {
    if (cleanedInput.includes(key) || key.includes(cleanedInput)) {
      return gpuUserBenchmarks[key];
    }
  }
  
  return null;
}

export function getStorageUserBenchmark(storageModel: string): { score: number, rank: number, samples: number } | null {
  if (!storageModel) return null;
  
  // Clean up the input
  const cleanedInput = storageModel.trim();
  
  // Direct match
  if (ssdUserBenchmarks[cleanedInput]) {
    return ssdUserBenchmarks[cleanedInput];
  }
  
  // Try to find a partial match
  for (const key of Object.keys(ssdUserBenchmarks)) {
    if (cleanedInput.includes(key) || key.includes(cleanedInput)) {
      return ssdUserBenchmarks[key];
    }
  }
  
  // For HDDs
  for (const key of Object.keys(hddUserBenchmarks)) {
    if (cleanedInput.includes(key) || key.includes(cleanedInput)) {
      return hddUserBenchmarks[key];
    }
  }
  
  return null;
}

export function getRamUserBenchmark(ramModel: string): { score: number, rank: number, samples: number } | null {
  if (!ramModel) return null;
  
  // Clean up the input
  const cleanedInput = ramModel.trim();
  
  // Direct match
  if (ramUserBenchmarks[cleanedInput]) {
    return ramUserBenchmarks[cleanedInput];
  }
  
  // Try to find a partial match
  for (const key of Object.keys(ramUserBenchmarks)) {
    if (cleanedInput.includes(key) || key.includes(cleanedInput)) {
      return ramUserBenchmarks[key];
    }
  }
  
  return null;
}