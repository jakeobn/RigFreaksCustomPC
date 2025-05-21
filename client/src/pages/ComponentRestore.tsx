import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, FileUp, Clock, Save, Check, Download, RefreshCw, Trash2, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { allComponents, loadComponentsFromStorage } from '../lib/componentData';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Component restore page
export default function ComponentRestore() {
  // State for backups
  const [backups, setBackups] = useState<any[]>([]);
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [restoring, setRestoring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  // Get backup list on mount
  useEffect(() => {
    fetchBackupList();
  }, []);

  // Fetch backup list
  const fetchBackupList = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/components/backup/info');
      const data = await response.json();
      
      if (data.success) {
        // Split into backups and uploads
        const backups = data.files.filter((f: any) => !f.isUpload);
        const uploads = data.files.filter((f: any) => f.isUpload);
        
        setBackups(backups);
        setUploads(uploads);
        
        // If we have uploads and no file is selected, select the first one
        if (uploads.length > 0 && !selectedFile) {
          setSelectedFile(uploads[0]);
          fetchPreviewData(uploads[0].path);
        }
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to get backup information',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching backup list:', error);
      toast({
        title: 'Error',
        description: 'Failed to get backup information. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch preview data for a file
  const fetchPreviewData = async (filePath: string) => {
    try {
      setPreviewData(null);
      
      const response = await fetch('/api/components/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filePath })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPreviewData(data);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to check file content',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching preview data:', error);
      toast({
        title: 'Error',
        description: 'Failed to check file content. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Select a file
  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
    fetchPreviewData(file.path);
  };

  // Restore components from selected file
  const restoreComponents = async () => {
    if (!selectedFile) return;
    
    try {
      setRestoring(true);
      setProgress(10);
      
      const response = await fetch('/api/components/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          filePath: selectedFile.path,
          saveToDb: true
        })
      });
      
      setProgress(50);
      
      const data = await response.json();
      
      if (data.success) {
        setProgress(80);
        
        // Reload components from storage
        loadComponentsFromStorage();
        
        setProgress(90);
        
        // Show success message
        toast({
          title: 'Success',
          description: data.message || 'Components restored successfully',
        });
        
        // Close the dialog
        setRestoreDialogOpen(false);
        
        setProgress(100);
        
        // Refresh the backup list
        fetchBackupList();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to restore components',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error restoring components:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore components. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setRestoring(false);
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString();
    } catch (error) {
      return dateStr;
    }
  };

  // Check if any components
  const hasAnyComponents = () => {
    return Object.values(allComponents).some(array => array.length > 0);
  };

  // Check if file is selected
  const isSelected = (file: any) => {
    return selectedFile && selectedFile.path === file.path;
  };

  return (
    <div className="container py-6 max-w-5xl">
      <div className="flex items-center mb-6">
        <Link href="/component-admin">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Component Admin
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Component Recovery</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar with file list */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Backup Files</CardTitle>
              <CardDescription>
                Select a file to restore components from
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="uploads">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="uploads">Uploads</TabsTrigger>
                  <TabsTrigger value="backups">Auto Backups</TabsTrigger>
                </TabsList>
                
                <TabsContent value="uploads" className="p-0">
                  <ScrollArea className="h-96 p-4">
                    {loading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="mb-4">
                          <Skeleton className="h-12 w-full" />
                        </div>
                      ))
                    ) : uploads.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        <FileUp className="mx-auto h-12 w-12 mb-2 opacity-50" />
                        <p>No uploaded CSV files found</p>
                        <p className="text-sm mt-2">Upload CSV files to attached_assets</p>
                      </div>
                    ) : (
                      uploads.map((file, index) => (
                        <div 
                          key={index}
                          className={`mb-2 p-3 rounded-md cursor-pointer transition-colors
                            ${isSelected(file) 
                              ? 'bg-primary/10 border border-primary/50' 
                              : 'hover:bg-muted border border-transparent'
                            }`}
                          onClick={() => handleFileSelect(file)}
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-500" />
                            <span className="font-medium truncate">{file.name}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1 justify-between">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(file.date)}
                            </span>
                            <span>{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="backups" className="p-0">
                  <ScrollArea className="h-96 p-4">
                    {loading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="mb-4">
                          <Skeleton className="h-12 w-full" />
                        </div>
                      ))
                    ) : backups.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        <Save className="mx-auto h-12 w-12 mb-2 opacity-50" />
                        <p>No backup files found</p>
                        <p className="text-sm mt-2">Add components to create backups</p>
                      </div>
                    ) : (
                      backups.map((file, index) => (
                        <div 
                          key={index}
                          className={`mb-2 p-3 rounded-md cursor-pointer transition-colors
                            ${isSelected(file) 
                              ? 'bg-primary/10 border border-primary/50' 
                              : 'hover:bg-muted border border-transparent'
                            }`}
                          onClick={() => handleFileSelect(file)}
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-green-500" />
                            <span className="font-medium truncate">{file.name}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1 justify-between">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(file.date)}
                            </span>
                            <span>{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchBackupList}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Link href={selectedFile?.path} target="_blank">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!selectedFile}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right content with file preview and restore button */}
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>
                {selectedFile ? (
                  <span className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    {selectedFile.name}
                  </span>
                ) : 'File Preview'}
              </CardTitle>
              <CardDescription>
                {selectedFile 
                  ? `${formatFileSize(selectedFile.size)} • ${formatDate(selectedFile.date)}`
                  : 'Select a file to preview its contents'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              {!selectedFile ? (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground p-10">
                  <div>
                    <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Select a file from the left to view its contents</p>
                  </div>
                </div>
              ) : !previewData ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Separator className="my-4" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <div>
                  <div className="bg-muted p-3 rounded-md mb-4">
                    <h3 className="font-medium mb-2">File Summary</h3>
                    <p className="text-sm mb-1">Total components: <span className="font-medium">{previewData.totalComponents}</span></p>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Components by category:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(previewData.categoryCounts).map(([category, count]: [string, any]) => (
                          <div key={category} className="flex items-center justify-between bg-background p-2 rounded text-xs">
                            <span className="capitalize">{category}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-medium mb-2">Preview</h3>
                  <ScrollArea className="h-56 border rounded-md p-3">
                    {Object.entries(previewData.preview).map(([category, components]: [string, any]) => (
                      <div key={category} className="mb-4">
                        <h4 className="capitalize font-medium mb-2">{category} Components</h4>
                        {components.map((component: any, index: number) => (
                          <div key={index} className="mb-2 bg-muted/50 p-2 rounded-md text-sm">
                            <div className="flex items-center mb-1">
                              <span className="font-medium">{component.name}</span>
                              <span className="ml-auto font-mono">£{component.price.toFixed(2)}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {component.brand} • ID: {component.id}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="mt-auto">
              {progress > 0 && (
                <Progress value={progress} className="mb-4 w-full" />
              )}
              
              <div className="flex w-full justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setPreviewOpen(true)}
                  disabled={!previewData}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Full Preview
                </Button>
                
                <Button 
                  onClick={() => setRestoreDialogOpen(true)}
                  disabled={!selectedFile || restoring || !previewData}
                >
                  {restoring ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Restore Components
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Restore confirmation dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Components</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore components from {selectedFile?.name}?
              {hasAnyComponents() && (
                <p className="mt-2 text-yellow-500">
                  Note: This will keep your existing components and add the restored ones.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {previewData && (
            <div className="bg-muted p-3 rounded-md my-2 text-sm">
              <p>This will add {previewData.totalComponents} components from the following categories:</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(previewData.categoryCounts).map(([category, count]: [string, any]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize">{category}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={restoreComponents} disabled={restoring}>
              {restoring ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Restore
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Full preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {selectedFile?.name}
              </span>
            </DialogTitle>
            <DialogDescription>
              Preview of all components in this file
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            {previewData && Object.entries(previewData.preview).map(([category, components]: [string, any]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold capitalize mb-3 flex items-center">
                  {category} Components
                  <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full">
                    {previewData.categoryCounts[category]} items
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {components.map((component: any, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{component.name}</CardTitle>
                          <div className="font-mono text-sm">£{component.price.toFixed(2)}</div>
                        </div>
                        <CardDescription className="flex items-center justify-between">
                          <span>{component.brand}</span>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">
                            {component.id}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        {component.description && (
                          <p className="text-sm mb-2">{component.description}</p>
                        )}
                        
                        {component.specs && Object.keys(component.specs).length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                              Specifications
                            </h4>
                            <div className="text-xs">
                              {Object.entries(component.specs).map(([key, value]: [string, any]) => (
                                <div key={key} className="flex items-center mb-1">
                                  <span className="font-medium mr-1">{key}:</span>
                                  <span>{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
          
          <DialogFooter>
            <Button onClick={() => setPreviewOpen(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}