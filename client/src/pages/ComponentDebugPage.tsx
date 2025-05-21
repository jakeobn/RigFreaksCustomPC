import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { loadComponentsFromStorage } from '@/lib/componentData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'wouter';

export default function ComponentDebugPage() {
  const [componentsData, setComponentsData] = useState("");
  const [backupData, setBackupData] = useState("");
  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadStorageData();
  }, []);

  // Load data from localStorage
  const loadStorageData = () => {
    try {
      // Get components data
      const currentData = localStorage.getItem('rigfreaks-components');
      const backup = localStorage.getItem('rigfreaks-components-backup');
      
      // Get all localStorage keys
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keys.push(key);
      }
      
      setComponentsData(currentData || "No data found");
      setBackupData(backup || "No backup found");
      setLocalStorageKeys(keys);
      
      console.log('Current localStorage components data:', currentData);
      console.log('Backup components data:', backup);
      
      toast({
        title: "Storage Data Loaded",
        description: "LocalStorage data loaded successfully",
      });
    } catch (error) {
      console.error('Error viewing localStorage:', error);
      toast({
        title: "Error Loading Data",
        description: "Error viewing localStorage: " + error,
        variant: "destructive"
      });
    }
  };

  // Force reload components from storage
  const forceReload = () => {
    try {
      loadComponentsFromStorage();
      loadStorageData(); // Refresh displayed data
      
      toast({
        title: "Force Reload Attempted",
        description: "Attempted to reload components from storage",
      });
    } catch (error) {
      console.error('Error reloading components:', error);
      toast({
        title: "Reload Failed",
        description: "Error reloading components: " + error,
        variant: "destructive"
      });
    }
  };

  // Refresh page
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Component Debug Tools</h1>
        <Link href="/admin/components">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Components
          </Button>
        </Link>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">LocalStorage Debugging</h2>
        <p className="text-muted-foreground mb-4">
          View and analyze the current state of your components data in localStorage.
        </p>
        
        <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 mb-6">
          <AlertTitle className="text-yellow-800 dark:text-yellow-300">Local Storage Keys</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            Found {localStorageKeys.length} keys in localStorage: {localStorageKeys.join(', ')}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-6 mb-6">
          <div>
            <h3 className="font-medium mb-2">Current Component Data</h3>
            <Textarea
              value={componentsData}
              readOnly
              className="h-40 font-mono text-xs"
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Backup Component Data</h3>
            <Textarea
              value={backupData}
              readOnly
              className="h-40 font-mono text-xs"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={forceReload} variant="default" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reload Components
          </Button>
          <Button onClick={refreshPage} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
          <Button onClick={loadStorageData} variant="secondary" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}