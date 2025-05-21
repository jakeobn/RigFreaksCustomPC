import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2, RefreshCw, Download, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Color setting interface
interface ColorSetting {
  name: string;
  variable: string;
  value: string;
  description: string;
  category: 'base' | 'primary' | 'accent' | 'ui' | 'text' | 'chart';
}

const ThemeCustomizer: React.FC = () => {
  // Initial state from current CSS variables
  const [colors, setColors] = useState<ColorSetting[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('dark');
  
  // Get initial colors from CSS variables
  useEffect(() => {
    const initialColors: ColorSetting[] = [
      // Base colors
      { name: 'Background', variable: '--background', value: hslToHex(0, 0, 7), description: 'Main background color', category: 'base' },
      { name: 'Surface', variable: '--dark-surface', value: hslToHex(0, 0, 12), description: 'Secondary background color', category: 'base' },
      { name: 'Card', variable: '--dark-card', value: hslToHex(0, 0, 15), description: 'Card background color', category: 'base' },
      
      // Primary colors
      { name: 'Primary', variable: '--primary', value: hslToHex(348, 100, 50), description: 'Primary action color', category: 'primary' },
      { name: 'Primary Foreground', variable: '--primary-foreground', value: hslToHex(0, 0, 100), description: 'Text on primary color', category: 'primary' },
      
      // Accent colors
      { name: 'Accent', variable: '--accent', value: hslToHex(187, 100, 50), description: 'Accent highlight color', category: 'accent' },
      { name: 'Accent Foreground', variable: '--accent-foreground', value: hslToHex(240, 5, 10), description: 'Text on accent color', category: 'accent' },
      
      // UI elements
      { name: 'Border', variable: '--border', value: hslToHex(240, 4, 16), description: 'Border color', category: 'ui' },
      { name: 'Input', variable: '--input', value: hslToHex(240, 4, 16), description: 'Input border color', category: 'ui' },
      { name: 'Ring', variable: '--ring', value: hslToHex(240, 5, 84), description: 'Focus ring color', category: 'ui' },
      { name: 'Muted', variable: '--muted', value: hslToHex(240, 4, 16), description: 'Muted background color', category: 'ui' },
      { name: 'Secondary', variable: '--secondary', value: hslToHex(240, 4, 16), description: 'Secondary button color', category: 'ui' },
      
      // Text colors
      { name: 'Foreground', variable: '--foreground', value: hslToHex(0, 0, 97), description: 'Main text color', category: 'text' },
      { name: 'Muted Foreground', variable: '--muted-foreground', value: hslToHex(240, 5, 65), description: 'Muted text color', category: 'text' },
      { name: 'Secondary Foreground', variable: '--secondary-foreground', value: hslToHex(0, 0, 98), description: 'Secondary text color', category: 'text' },
      
      // Chart colors
      { name: 'Chart 1', variable: '--chart-1', value: hslToHex(348, 100, 50), description: 'First chart color', category: 'chart' },
      { name: 'Chart 2', variable: '--chart-2', value: hslToHex(187, 100, 50), description: 'Second chart color', category: 'chart' },
      { name: 'Chart 3', variable: '--chart-3', value: hslToHex(142, 100, 45), description: 'Third chart color', category: 'chart' },
      { name: 'Chart 4', variable: '--chart-4', value: hslToHex(54, 100, 50), description: 'Fourth chart color', category: 'chart' },
      { name: 'Chart 5', variable: '--chart-5', value: hslToHex(270, 100, 60), description: 'Fifth chart color', category: 'chart' },
    ];
    
    setColors(initialColors);
  }, []);
  
  // Convert HSL to HEX color
  function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  
  // Convert HEX to HSL color
  function hexToHsl(hex: string): { h: number, s: number, l: number } {
    // Remove the # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
  
  // Handle color change
  const handleColorChange = (index: number, newValue: string) => {
    const newColors = [...colors];
    newColors[index].value = newValue;
    setColors(newColors);
    
    // Apply the color change immediately for preview
    applyThemePreview(newColors);
  };
  
  // Apply theme changes for preview
  const applyThemePreview = (colorSettings: ColorSetting[] = colors) => {
    colorSettings.forEach(setting => {
      const hsl = hexToHsl(setting.value);
      document.documentElement.style.setProperty(
        setting.variable, 
        `${hsl.h} ${hsl.s}% ${hsl.l}%`
      );
    });
  };
  
  // Save theme to localStorage and apply
  const saveTheme = async () => {
    setIsSaving(true);
    try {
      // Convert colors to HSL format for storage
      const theme = colors.reduce((acc, color) => {
        const hsl = hexToHsl(color.value);
        acc[color.variable] = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
        return acc;
      }, {} as Record<string, string>);
      
      // Save to localStorage
      localStorage.setItem('rigfreaks-theme', JSON.stringify(theme));
      
      // Apply the theme
      applyThemePreview();
      
      toast({
        title: "Theme saved",
        description: "Your custom theme has been saved and applied.",
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error saving theme",
        description: "There was a problem saving your theme.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Reset theme to defaults
  const resetTheme = () => {
    setIsResetting(true);
    try {
      // Import resetThemeToDefault from themeLoader.ts
      import('@/lib/themeLoader').then(({ resetThemeToDefault }) => {
        // Call the function to reset the theme without page reload
        resetThemeToDefault();
        
        // Reset to initial state in the component
        const initialColors: ColorSetting[] = [
          // Base colors
          { name: 'Background', variable: '--background', value: hslToHex(0, 0, 7), description: 'Main background color', category: 'base' },
          { name: 'Surface', variable: '--dark-surface', value: hslToHex(0, 0, 12), description: 'Secondary background color', category: 'base' },
          { name: 'Card', variable: '--dark-card', value: hslToHex(0, 0, 15), description: 'Card background color', category: 'base' },
          
          // Primary colors
          { name: 'Primary', variable: '--primary', value: hslToHex(348, 100, 50), description: 'Primary action color', category: 'primary' },
          { name: 'Primary Foreground', variable: '--primary-foreground', value: hslToHex(0, 0, 100), description: 'Text on primary color', category: 'primary' },
          
          // Accent colors
          { name: 'Accent', variable: '--accent', value: hslToHex(187, 100, 50), description: 'Accent highlight color', category: 'accent' },
          { name: 'Accent Foreground', variable: '--accent-foreground', value: hslToHex(240, 5, 10), description: 'Text on accent color', category: 'accent' },
          
          // UI elements
          { name: 'Border', variable: '--border', value: hslToHex(240, 4, 16), description: 'Border color', category: 'ui' },
          { name: 'Input', variable: '--input', value: hslToHex(240, 4, 16), description: 'Input border color', category: 'ui' },
          { name: 'Ring', variable: '--ring', value: hslToHex(240, 5, 84), description: 'Focus ring color', category: 'ui' },
          { name: 'Muted', variable: '--muted', value: hslToHex(240, 4, 16), description: 'Muted background color', category: 'ui' },
          { name: 'Secondary', variable: '--secondary', value: hslToHex(240, 4, 16), description: 'Secondary button color', category: 'ui' },
          
          // Text colors
          { name: 'Foreground', variable: '--foreground', value: hslToHex(0, 0, 97), description: 'Main text color', category: 'text' },
          { name: 'Muted Foreground', variable: '--muted-foreground', value: hslToHex(240, 5, 65), description: 'Muted text color', category: 'text' },
          { name: 'Secondary Foreground', variable: '--secondary-foreground', value: hslToHex(0, 0, 98), description: 'Secondary text color', category: 'text' },
          
          // Chart colors
          { name: 'Chart 1', variable: '--chart-1', value: hslToHex(348, 100, 50), description: 'First chart color', category: 'chart' },
          { name: 'Chart 2', variable: '--chart-2', value: hslToHex(187, 100, 50), description: 'Second chart color', category: 'chart' },
          { name: 'Chart 3', variable: '--chart-3', value: hslToHex(142, 100, 45), description: 'Third chart color', category: 'chart' },
          { name: 'Chart 4', variable: '--chart-4', value: hslToHex(54, 100, 50), description: 'Fourth chart color', category: 'chart' },
          { name: 'Chart 5', variable: '--chart-5', value: hslToHex(270, 100, 60), description: 'Fifth chart color', category: 'chart' },
        ];
        
        setColors(initialColors);
        
        toast({
          title: "Theme reset",
          description: "Theme has been reset to default values.",
        });
        
        setIsResetting(false);
      });
    } catch (error) {
      console.error('Error resetting theme:', error);
      toast({
        title: "Error resetting theme",
        description: "There was a problem resetting your theme.",
        variant: "destructive",
      });
      setIsResetting(false);
    }
  };
  
  // Export theme to JSON
  const exportTheme = () => {
    try {
      const theme = colors.reduce((acc, color) => {
        const hsl = hexToHsl(color.value);
        acc[color.variable] = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
        return acc;
      }, {} as Record<string, string>);
      
      const dataStr = JSON.stringify(theme, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = 'rigfreaks-theme.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Theme exported",
        description: "Your theme has been exported as JSON.",
      });
    } catch (error) {
      console.error('Error exporting theme:', error);
      toast({
        title: "Error exporting theme",
        description: "There was a problem exporting your theme.",
        variant: "destructive",
      });
    }
  };
  
  // Import theme from JSON
  const importTheme = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
      
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      
      reader.onload = (readerEvent) => {
        try {
          const content = readerEvent.target?.result as string;
          const theme = JSON.parse(content);
          
          // Update colors with imported values
          const newColors = [...colors];
          Object.keys(theme).forEach(variable => {
            const index = newColors.findIndex(c => c.variable === variable);
            if (index !== -1) {
              const [h, s, l] = theme[variable].split(' ').map((v: string) => parseFloat(v));
              newColors[index].value = hslToHex(h, s.replace('%', ''), l.replace('%', ''));
            }
          });
          
          setColors(newColors);
          applyThemePreview(newColors);
          
          toast({
            title: "Theme imported",
            description: "Your theme has been imported and applied.",
          });
        } catch (error) {
          console.error('Error importing theme:', error);
          toast({
            title: "Error importing theme",
            description: "There was a problem with the imported file.",
            variant: "destructive",
          });
        }
      };
    };
    
    input.click();
  };
  
  return (
    <div className="container py-8">
      <Helmet>
        <title>Theme Customizer | RigFreaks</title>
        <meta name="description" content="Customize the RigFreaks theme colors to match your preferences." />
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Theme Customizer</h1>
          <p className="text-muted-foreground mb-6">Customize the colors of the RigFreaks website to match your preferences.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button 
              onClick={saveTheme} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Theme
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetTheme} 
              disabled={isResetting}
              className="flex items-center gap-2"
            >
              {isResetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Reset to Default
            </Button>
            
            <Button 
              variant="outline" 
              onClick={exportTheme}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Theme
            </Button>
            
            <Button 
              variant="outline" 
              onClick={importTheme}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import Theme
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="base">
          <TabsList className="mb-6">
            <TabsTrigger value="base">Base</TabsTrigger>
            <TabsTrigger value="primary">Primary</TabsTrigger>
            <TabsTrigger value="accent">Accent</TabsTrigger>
            <TabsTrigger value="ui">UI</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="chart">Charts</TabsTrigger>
          </TabsList>
          
          {['base', 'primary', 'accent', 'ui', 'text', 'chart'].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colors
                  .filter(color => color.category === category)
                  .map((color, index) => {
                    const colorIndex = colors.findIndex(c => c === color);
                    return (
                      <Card key={color.variable} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{color.name}</CardTitle>
                          <CardDescription>{color.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-3">
                            <div 
                              className="w-full h-16 rounded-md border" 
                              style={{ backgroundColor: color.value }}
                            />
                            <div className="flex gap-3 items-center">
                              <input 
                                type="color" 
                                value={color.value}
                                onChange={(e) => handleColorChange(colorIndex, e.target.value)}
                                className="w-10 h-10 rounded-md cursor-pointer"
                              />
                              <input 
                                type="text" 
                                value={color.value}
                                onChange={(e) => handleColorChange(colorIndex, e.target.value)}
                                className="flex-1 px-3 py-2 rounded-md bg-background border"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <div className="mt-8 p-6 border rounded-lg bg-card">
        <h2 className="text-xl font-bold mb-4">Theme preview examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Typography</h3>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Heading 1</h1>
              <h2 className="text-xl font-bold">Heading 2</h2>
              <h3 className="text-lg font-bold">Heading 3</h3>
              <p className="text-base">Regular paragraph text</p>
              <p className="text-sm text-muted-foreground">Muted text</p>
              <a href="#" className="text-primary hover:underline">Link text</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Card Example</h3>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is an example card component with different elements.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Form Elements</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-md bg-background border"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;