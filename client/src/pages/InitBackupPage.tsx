import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, FileText } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { allComponents, backupComponentsToCsv } from '@/lib/componentData';
import { Helmet } from 'react-helmet';

export default function InitBackupPage() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Trigger the initial backup
  const initializeBackup = async () => {
    try {
      setIsInitializing(true);
      
      // Wait a moment to ensure server is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trigger CSV backup
      const success = await backupComponentsToCsv();
      
      if (success) {
        setIsComplete(true);
        toast({
          title: "Backup Initialized",
          description: "Components data has been backed up to CSV file",
        });
      } else {
        throw new Error('Backup failed');
      }
    } catch (error) {
      console.error('Error initializing backup:', error);
      toast({
        title: "Backup Initialization Failed",
        description: "Could not create the initial backup file",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };
  
  // Return to admin page
  const goToAdmin = () => {
    navigate('/admin/components');
  };
  
  // Count components
  const countComponents = () => {
    return Object.values(allComponents).reduce((total, components) => {
      return total + (Array.isArray(components) ? components.length : 0);
    }, 0);
  };
  
  return (
    <div className="container mx-auto p-8 max-w-md">
      <Helmet>
        <title>Initialize Backup | RigFreaks Admin</title>
      </Helmet>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Initialize Automatic Backup</CardTitle>
          <CardDescription>
            Create the initial CSV backup file with all current components.
            Future components will be automatically backed up when added.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            {isInitializing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p>Initializing backup system...</p>
              </div>
            ) : isComplete ? (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p>Backup system initialized successfully!</p>
                <p className="text-sm text-muted-foreground">
                  {countComponents()} components have been backed up.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <FileText className="h-12 w-12 text-primary" />
                <p>Ready to initialize the backup system</p>
                <p className="text-sm text-muted-foreground">
                  This will create a CSV file with all your current {countComponents()} components.
                </p>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToAdmin}
            disabled={isInitializing}
          >
            Return to Admin
          </Button>
          
          {isComplete ? (
            <a href="/backups/components.csv" target="_blank" rel="noopener noreferrer">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                View CSV File
              </Button>
            </a>
          ) : (
            <Button 
              onClick={initializeBackup} 
              disabled={isInitializing}
            >
              {isInitializing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                'Initialize Backup'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}