import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { loadComponentsFromStorage } from "@/lib/componentData";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RestoreComponentsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [componentsData, setComponentsData] = useState("");
  const [backupData, setBackupData] = useState("");
  const { toast } = useToast();
  
  // Function to display localStorage data for debugging
  const viewStorage = () => {
    try {
      // Get all components data
      const currentData = localStorage.getItem('rigfreaks-components');
      const backup = localStorage.getItem('rigfreaks-components-backup');
      
      setComponentsData(currentData || "No data found");
      setBackupData(backup || "No backup found");
      setIsOpen(true);
      
      console.log('Current localStorage components data:', currentData);
      console.log('Backup components data:', backup);
      
      // Force reload components
      loadComponentsFromStorage();
      
      toast({
        title: "Components Reloaded",
        description: "Components data loaded from localStorage. Details available in the dialog.",
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
  
  const forceReload = () => {
    try {
      loadComponentsFromStorage();
      toast({
        title: "Force Reload Attempted",
        description: "Attempted to reload components from storage",
      });
      
      // Refresh the page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error reloading components:', error);
      toast({
        title: "Reload Failed",
        description: "Error reloading components: " + error,
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      <Button onClick={viewStorage} variant="destructive">
        Debug Components
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Component Data Debug</DialogTitle>
            <DialogDescription>
              View current component data stored in localStorage
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
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
            
            <Alert variant="warning" className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-yellow-800 dark:text-yellow-300">Warning</AlertTitle>
              <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                Force reload will reload the page. Save any unsaved changes before proceeding.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">Close</Button>
            <Button onClick={forceReload} variant="destructive">
              <RefreshCw className="h-4 w-4 mr-2" />
              Force Reload Components
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
