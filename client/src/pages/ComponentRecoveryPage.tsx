import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, RefreshCw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { allComponents, saveComponentsToStorage } from '@/lib/componentData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'wouter';

export default function ComponentRecoveryPage() {
  const [importedData, setImportedData] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setImportedData(content);
        toast({
          title: "File Loaded",
          description: "JSON file has been loaded. Review and click 'Restore Components' to apply.",
        });
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: "Error Reading File",
          description: "Could not read the selected file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Process the imported data
  const processImportedData = () => {
    try {
      if (!importedData) {
        toast({
          title: "No Data",
          description: "Please select a file or paste JSON data first.",
          variant: "destructive",
        });
        return;
      }

      // Parse the JSON data
      const parsedData = JSON.parse(importedData);
      
      // Check if the data has the expected structure
      if (!parsedData.components) {
        toast({
          title: "Invalid Data Format",
          description: "The JSON data is not in the expected format. It should contain a 'components' property.",
          variant: "destructive",
        });
        return;
      }

      // Save the components to localStorage and update the application
      // Update the global components variable
      Object.keys(parsedData.components).forEach(category => {
        allComponents[category] = parsedData.components[category];
      });
      
      // Save to localStorage
      saveComponentsToStorage();
      
      // Reload the page to ensure everything is updated
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      toast({
        title: "Components Restored",
        description: `Restored components from backup. The page will reload shortly.`,
      });
    } catch (error) {
      console.error('Error processing imported data:', error);
      toast({
        title: "Error Processing Data",
        description: "Failed to process the imported data. Make sure it's valid JSON.",
        variant: "destructive",
      });
    }
  };

  // Count the current components
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
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Component Recovery</h1>
        <Link href="/admin/components">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Components
          </Button>
        </Link>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Restore Components from Backup</h2>
        <p className="text-muted-foreground mb-4">
          Upload a JSON backup file or paste your backup data to restore your components.
        </p>
        
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 mb-6">
          <AlertTitle className="text-blue-800 dark:text-blue-300">Current Components</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            You currently have {total} components across {categories} categories
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-medium mb-2">Upload JSON Backup File</h3>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <Button onClick={triggerFileInput} variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Select Backup File
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Or Paste Backup JSON</h3>
            <Textarea
              value={importedData}
              onChange={(e) => setImportedData(e.target.value)}
              placeholder="Paste your backup JSON data here..."
              className="h-40 font-mono text-xs"
            />
          </div>
        </div>
        
        <Button 
          onClick={processImportedData} 
          disabled={!importedData} 
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Restore Components
        </Button>
      </div>
    </div>
  );
}