import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addComponent, PCComponentData } from "@/lib/componentData";
import { AlertCircle, Check, Download, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

export function ComponentRecoveryUtility() {
  const [isOpen, setIsOpen] = useState(false);
  const [componentsJson, setComponentsJson] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [backupData, setBackupData] = useState<string | null>(null);
  const { toast } = useToast();

  // Open dialog and check localStorage
  const openDialog = () => {
    setIsOpen(true);
    checkLocalStorage();
  };

  // Check localStorage for component data
  const checkLocalStorage = () => {
    try {
      const componentsData = localStorage.getItem('rigfreaks-components');
      const componentsBackup = localStorage.getItem('rigfreaks-components-backup');
      
      // If we have backup data, show it in the text area
      if (componentsBackup) {
        setBackupData(componentsBackup);
        setMessage(`Found backup from ${getBackupDate(componentsBackup)}`);
      } else if (componentsData) {
        setBackupData(componentsData);
        setMessage(`Found current data from ${getBackupDate(componentsData)}`);
      } else {
        setBackupData(null);
        setMessage('No component data found in localStorage');
      }
    } catch (error) {
      console.error('Error checking localStorage:', error);
      setBackupData(null);
      setMessage('Error accessing localStorage');
    }
  };

  // Get formatted date from backup data
  const getBackupDate = (data: string): string => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.lastUpdated) {
        return new Date(parsedData.lastUpdated).toLocaleString();
      }
      return 'unknown date';
    } catch {
      return 'unknown date';
    }
  };

  // Download backup data as JSON file
  const downloadBackup = () => {
    if (!backupData) return;
    
    try {
      // Create a blob from the data
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `rigfreaks-components-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup Downloaded",
        description: "Your component data has been downloaded as a JSON file",
      });
    } catch (error) {
      console.error('Error downloading backup:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download backup file",
        variant: "destructive",
      });
    }
  };

  // Restore components from backup
  const restoreFromBackup = () => {
    if (!backupData) return;
    
    try {
      // First save it to localStorage for additional safety
      localStorage.setItem('rigfreaks-components-external-backup', backupData);
      
      // Then try to restore from it
      restoreComponents(backupData);
    } catch (error) {
      console.error('Error restoring from backup:', error);
      setStatus('error');
      setMessage('Failed to restore from backup');
    }
  };

  // Restore components from imported JSON
  const restoreFromImport = () => {
    if (!componentsJson.trim()) {
      setStatus('error');
      setMessage('Please paste component data JSON');
      return;
    }
    
    try {
      restoreComponents(componentsJson);
    } catch (error) {
      console.error('Error restoring components:', error);
      setStatus('error');
      setMessage('Invalid JSON data format');
    }
  };

  // Common restore function
  const restoreComponents = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      // Check if we have components property (new format) or direct array (old format)
      const componentsData = parsedData.components || parsedData;
      
      let importCount = 0;
      let categoryCount = 0;
      
      // Process each category
      Object.keys(componentsData).forEach(category => {
        if (Array.isArray(componentsData[category])) {
          categoryCount++;
          
          // Add each component to the storage
          componentsData[category].forEach((component: PCComponentData) => {
            if (addComponent(component)) {
              importCount++;
            }
          });
        }
      });
      
      // Set success state
      setStatus('success');
      setMessage(`Successfully restored ${importCount} components from ${categoryCount} categories`);
      
      // Show toast notification
      toast({
        title: "Components Restored",
        description: `Restored ${importCount} components from ${categoryCount} categories`,
      });
      
      // Reset textarea
      setComponentsJson('');
      
      // Force reload the page after 2 seconds to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error restoring components:', error);
      setStatus('error');
      setMessage('Failed to restore components: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <>
      <Button 
        onClick={openDialog} 
        variant="outline" 
        className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-500/20"
      >
        <Download className="h-4 w-4 mr-2" />
        Recover Components
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Component Recovery Utility</DialogTitle>
            <DialogDescription>
              Restore missing components from backups or import from a JSON file
            </DialogDescription>
          </DialogHeader>
          
          {status !== 'idle' && (
            <Alert variant={status === 'success' ? "default" : "destructive"}>
              {status === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{status === 'success' ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          {backupData && (
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="font-medium mb-2">Found Component Data</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
                <div className="flex space-x-2 mt-4">
                  <Button onClick={restoreFromBackup} size="sm">
                    <Check className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>
                  <Button onClick={downloadBackup} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="components-json">Import Component Data</Label>
              <Textarea
                id="components-json"
                value={componentsJson}
                onChange={(e) => setComponentsJson(e.target.value)}
                placeholder="Paste your components JSON data here"
                className="h-40 font-mono text-sm"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={restoreFromImport} disabled={!componentsJson.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Import and Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}