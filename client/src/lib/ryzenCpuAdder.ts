import { PCComponentData, addComponent } from './componentData';

// HTML content for AMD Ryzen 9 9950X
const ryzenHtmlSpecs = `<h3>
  <span style="color:#0066cc;"><em><strong>Next-level gaming</strong></em></span>
</h3>

<div>&nbsp;</div>

<div>
  Shatter any obstacle that stands between you and victory with the raw power
  and performance of AMD Ryzen&trade; 9 9950X processor. Our &quot;Zen 5&quot; core
  technology evolves with your needs, so you can go big today and tomorrow.
  With 16 cores and 32 threads, our proven platform makes your
  high-performance gaming possibilities limitless.
</div>

<div>&nbsp;</div>

<div>
  <span style="font-size:16px;"><strong>The uprising begins here</strong></span>
</div>

<div>&nbsp;</div>

<div>
  Rebel against underwhelming performance. The AMD Ryzen&trade; 9 9950X
  processor gives you the strength to level up and provides an insane
  experience for gaming, streaming, creating, and all the worlds you want to
  master. With features like AMD EXPO&trade;1 technology one-touch memory
  overclocking, you can game with the ultra-high performance available on a
  PC and go for more glory.
</div>

<div>&nbsp;</div>

<div>
  <span style="font-size:16px;"><strong>Reliable endurance for your next mission</strong></span>
</div>

<div>&nbsp;</div>

<div>
  The future of gaming is yours with the cutting-edge PC that can grow with
  you. The AMD Ryzen&trade; 9 9950X processor is future-ready with lightning
  fast DDR5 memory speeds and astonishing bandwidth with PCIe&reg; 5.0. What's
  more, only AMD promises years of upgradability so you can make the most of
  your AM5 platform. Buckle up, because with AMD Ryzen&trade; processors,
  you're in for non-stop victory.
</div>

<div>&nbsp;</div>

<div>
  <span style="font-size:16px;"><strong>AI-ready, destined for greatness</strong></span>
</div>

<div>&nbsp;</div>

<div>
  Unlock the full potential of your PC with AI-ready AMD Ryzen&trade;
  processors. Bring the speed of gaming to every element of your rig with
  built-in AI acceleration and enhanced AI capabilities for productivity and
  content creation. Want to supercharge AI enhancements? Pair the Ryzen&trade;
  9 9950X processor with Radeon&trade; RX 7000 Series graphics cards to
  experience the ultimate performance.
</div>

<ul>
  <li><strong>Socket:</strong> AM5</li>
  <li><strong>Type:</strong> AMD Ryzen 9</li>
  <li><strong>Clock Speed:</strong> 4.3 GHz</li>
  <li><strong>Turbo Speed:</strong> 5.7 GHz</li>
  <li><strong>Cores:</strong> 16 Core</li>
  <li><strong>Core Size:</strong> CPU Cores: TSMC 4nm FinFET<br />I/O Die: SMC 6nm FinFET</li>
  <li><strong>Threads:</strong> 32</li>
  <li><strong>Cache:</strong> L1 Cache: 1280 KB<br />L2 Cache: 16 MB<br />L3 Cache: 64 MB</li>
  <li><strong>TDP:</strong> Default TDP: 170W</li>
  <li><strong>Graphics:</strong> Yes</li>
  <li><strong>Graphics Details:</strong> AMD Radeon Graphics<br />Graphics Cores: 2<br />Frequency: 2200 MHz<br />USB Type-C DisplayPort Alternate Mode support</li>
  <li><strong>Memory:</strong> Memory Channels: 2<br />Max. Memory: 192GB<br />System Memory Subtype: UDIMM<br /><br />Max Memory Speed:<br />2x1R DDR5-5600<br />2x2R DDR5-5600<br />4x1R DDR5-3600<br />4x2R DDR5-3600</li>
  <li><strong>Max PCI Express Lanes:</strong> 28/24 (Total/Usable)<br /><br />Additional Usable PCIe Lanes from Motherboard:<br />X870E: 8x Gen4<br />X870: 4x Gen4<br />X670E: 12x Gen4<br />X670: 12x Gen4<br />B650E: 8x Gen4<br />B650: 8x Gen4</li>
  <li><strong>Cooler:</strong> No</li>
  <li><strong>Special Features:</strong> AMD EXPO Technology<br />AMD Ryzen Technologies</li>
</ul>`;

// Create Ryzen 9 9950X CPU component
export const createRyzenCpu = async (): Promise<PCComponentData | null> => {
  try {
    // Base component data
    const ryzenCpu: PCComponentData = {
      id: 'cpu-amd-ryzen-9-9950x',
      category: 'cpu',
      name: 'AMD Ryzen 9 9950X',
      brand: 'AMD',
      price: 908.99,
      description: 'AMD Ryzen 9 9950X 16-Core, 32-Thread Processor with AMD Radeon Graphics',
      specs: {
        socket: 'AM5',
        cores: '16',
        threads: '32',
        clockSpeed: '4.3 GHz',
        turboSpeed: '5.7 GHz',
        cache: 'L1: 1280 KB, L2: 16 MB, L3: 64 MB',
        tdp: '170W',
        memorySupport: 'DDR5',
        pcie: 'PCIe 5.0',
        integratedGraphics: 'Yes'
      },
      specsHtml: ryzenHtmlSpecs,
      image: '/assets/images/cpu/amd-ryzen-9-9950x.svg',
      inStock: true,

      inventoryStatus: 'in-stock'
    };

    // Add the component to the global state and database
    const result = await addComponent(ryzenCpu);
    
    if (result) {
      console.log('Successfully added AMD Ryzen 9 9950X CPU');
      return ryzenCpu;
    } else {
      console.error('Failed to add AMD Ryzen 9 9950X CPU');
      return null;
    }
  } catch (error) {
    console.error('Error adding AMD Ryzen 9 9950X CPU:', error);
    return null;
  }
};