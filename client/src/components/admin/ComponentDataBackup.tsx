import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Save } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { allComponents } from '@/lib/componentData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ComponentDataBackup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  // Generate the current components data as JSON
  const generateComponentsJson = (): string => {
    try {
      // Add timestamp to the data
      const dataWithTimestamp = {
        components: allComponents,
        lastUpdated: Date.now()
      };
      
      // Format with indentation for readability
      return JSON.stringify(dataWithTimestamp, null, 2);
    } catch (error) {
      console.error('Error generating components JSON:', error);
      return JSON.stringify({ error: 'Failed to generate components data' });
    }
  };

  // Copy JSON to clipboard
  const copyToClipboard = () => {
    try {
      const json = generateComponentsJson();
      navigator.clipboard.writeText(json);
      setIsCopied(true);
      
      toast({
        title: "Copied to Clipboard",
        description: "Components data has been copied to your clipboard",
      });
      
      // Reset copy state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy data to clipboard",
        variant: "destructive",
      });
    }
  };

  // Download JSON as a file
  const downloadJson = () => {
    try {
      const json = generateComponentsJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `rigfreaks-components-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: "Components data downloaded as JSON file",
      });
    } catch (error) {
      console.error('Error downloading JSON:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download components data",
        variant: "destructive",
      });
    }
  };

  // Count the number of components in each category
  const countComponents = (): { total: number, categories: number } => {
    let total = 0;
    let categoriesWithComponents = 0;
    
    Object.keys(allComponents).forEach(category => {
      if (allComponents[category] && allComponents[category].length > 0) {
        total += allComponents[category].length;
        categoriesWithComponents++;
      }
    });
    
    return { total, categories: categoriesWithComponents };
  };

  const { total, categories } = countComponents();

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline"
        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-500/20"
      >
        <Save className="h-4 w-4 mr-2" />
        Backup Components
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Component Data Backup</DialogTitle>
            <DialogDescription>
              Create a backup of all your component data. This backup can be used to restore your components if needed.
            </DialogDescription>
          </DialogHeader>
          
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <AlertTitle className="text-blue-800 dark:text-blue-300">Component Summary</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              Found {total} components across {categories} categories
            </AlertDescription>
          </Alert>
          
          <Textarea
            value={generateComponentsJson()}
            readOnly
            className="h-60 font-mono text-xs"
          />
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                {isCopied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
              <Button onClick={downloadJson} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>
            <Button onClick={() => setIsOpen(false)} variant="ghost">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}