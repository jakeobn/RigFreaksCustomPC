import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGlobalState } from '@/lib/GlobalState';
import { PersistentGalleryUpload } from '@/components/ui/persistent-gallery-upload';
// Using persistent gallery upload for local storage instead
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Trash2, 
  Plus, 
  Edit, 
  Save, 
  Upload,
  Image,
  RefreshCw,
  FileText,
  AlertCircle,
  Check,
  X,
  Bug,
  Download,
  Cpu,
  Shield,
  Database
} from 'lucide-react';
import { Link } from 'wouter';
import { PCComponentData, InventoryStatus, allComponents, BUILD_STEPS, addComponent, removeComponent, loadComponentsFromStorage } from '@/lib/componentData';
import { importComponentsFromCSV } from '@/lib/csvUtils';
import { runComponentFixes } from '@/lib/threadripperFix';

// Admin Component Page
function ComponentAdmin() {
  const { toast } = useToast();
  const [components, setComponents] = useState<PCComponentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('cpu');
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
  const [isEditComponentOpen, setIsEditComponentOpen] = useState(false);
  const [isImportCSVOpen, setIsImportCSVOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvImportStatus, setCsvImportStatus] = useState<{
    success: boolean;
    imported: number;
    errors: string[];
  } | null>(null);
  const [editingComponent, setEditingComponent] = useState<PCComponentData | null>(null);
  const [newComponent, setNewComponent] = useState<Partial<PCComponentData>>({
    category: 'cpu',
    name: '',
    brand: '',
    price: 0,
    description: '',
    specs: {},
    specsHtml: '',
    image: '',
    imagesGallery: [],
    inStock: true,
    inventoryStatus: 'in-stock'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Function to refresh components from localStorage
  const refreshLocalComponents = () => {
    setLoading(true);
    
    // Use the global refresh function to ensure all components are updated
    globalRefresh();
    
    // Extract all components from allComponents object into a flat array
    const flattenedComponents = Object.values(allComponents).flat();
    setComponents(flattenedComponents);
    
    setLoading(false);
    
    toast({
      title: "Components Refreshed",
      description: "Component data has been refreshed from storage."
    });
  };
  
  // Use global state to keep component data in sync
  const { lastUpdateTime, refreshComponents: globalRefresh } = useGlobalState();
  
  // Function to save the current component state to ensure changes persist
  const saveCurrentState = async () => {
    try {
      // If in edit mode, save the edited component
      if (isEditComponentOpen && editingComponent) {
        // Update the component in the global state by using the handleEditComponent function
        await handleEditComponent();
        
        console.log('Component state saved with persistent storage');
      }
      // For new components, we don't need to do anything as they'll be saved when added
    } catch (error) {
      console.error('Error saving current state:', error);
    }
  };

  // Run component fixes and update when global state updates
  useEffect(() => {
    // Update local component state with the latest data
    const flattenedComponents = Object.values(allComponents).flat();
    setComponents(flattenedComponents);
    
    console.log('ComponentAdmin updated from global state:', new Date(lastUpdateTime).toLocaleTimeString());
  }, [lastUpdateTime]);
  
  // Run component fixes once when the component mounts
  useEffect(() => {
    // Only run once when the component mounts
    const runFixes = async () => {
      try {
        await runComponentFixes();
        
        // After fixing duplicates, refresh components to show the updated state
        setTimeout(() => {
          globalRefresh();
          toast({
            title: "Component Maintenance Complete",
            description: "Fixed any component duplicates and ensured proper inventory status.",
          });
        }, 500);
      } catch (error) {
        console.error("Error running component fixes:", error);
      }
    };
    
    runFixes();
    // Empty dependency array ensures this only runs once
  }, []);
  
  // Handle CSV file change
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      setCsvImportStatus(null); // Reset status when a new file is selected
    }
  };
  
  // Import CSV file
  const importCsvFile = async () => {
    if (!csvFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Read the file
      const fileContent = await csvFile.text();
      
      // Process the CSV
      const result = importComponentsFromCSV(fileContent);
      setCsvImportStatus(result);
      
      if (result.success) {
        toast({
          title: "Import successful",
          description: `Successfully imported ${result.imported} components`,
          variant: "default",
        });
        
        // Refresh the component list
        refreshLocalComponents();
        
        // Close the dialog if successful and no errors
        if (result.errors.length === 0) {
          setIsImportCSVOpen(false);
          setCsvFile(null);
        }
      } else {
        toast({
          title: "Import failed",
          description: "There were errors during the import. See the details in the dialog.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error importing CSV file:', error);
      toast({
        title: "Import failed",
        description: `Error: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    }
  };

  // Initial load
  useEffect(() => {
    // First load any saved components from localStorage
    loadComponentsFromStorage();
    
    // Then extract all components from allComponents object into a flat array
    const flattenedComponents = Object.values(allComponents).flat();
    setComponents(flattenedComponents);
    setLoading(false);
  }, []);

  const filteredComponents = components.filter(
    component => component.category === selectedCategory
  );

  const handleAddComponent = async () => {
    try {
      // Validate required fields
      if (!newComponent.name || !newComponent.category || newComponent.price === undefined) {
        toast({
          title: "Missing Required Fields",
          description: "Please fill in all required fields: Name, Category, and Price.",
          variant: "destructive"
        });
        return;
      }
      
      // Generate a unique ID for the new component
      const categoryPrefix = newComponent.category || 'component';
      const timestamp = Date.now().toString(36);
      const sanitizedName = (newComponent.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newId = `${categoryPrefix}-${sanitizedName}-${timestamp}`;
      
      // Clean the specsHtml field to ensure it's a string
      const cleanedSpecsHtml = newComponent.specsHtml || '';
      
      // Create the new component with all required fields
      const componentToAdd: PCComponentData = {
        id: newId,
        category: newComponent.category as string,
        name: newComponent.name as string,
        brand: newComponent.brand as string || 'Generic',
        price: Number(newComponent.price) || 0,
        description: newComponent.description as string || '',
        specs: newComponent.specs as Record<string, string | number | boolean> || {},
        specsHtml: cleanedSpecsHtml,
        image: newComponent.image as string || '',
        imagesGallery: newComponent.imagesGallery || [],
        inStock: newComponent.inStock === undefined ? true : newComponent.inStock,
        inventoryStatus: newComponent.inventoryStatus as InventoryStatus || 'in-stock'
      };
      
      console.log('Adding component with specs HTML:', componentToAdd.specsHtml ? 'HTML present' : 'No HTML');
      
      // Add component to the global allComponents object using the async function
      const addResult = await addComponent(componentToAdd);
      
      if (!addResult) {
        throw new Error('Failed to add component to the global state');
      }
      
      // Update local state
      setComponents([...components, componentToAdd]);
      
      // Reset the form
      setNewComponent({
        category: selectedCategory,
        name: '',
        brand: '',
        price: 0,
        description: '',
        specs: {},
        specsHtml: '',
        image: '',
        imagesGallery: [],
        inStock: true,
        inventoryStatus: 'in-stock'
      });
      
      setIsAddComponentOpen(false);
      
      // Trigger a server backup after adding
      try {
        await fetch('/api/components/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ components: allComponents }),
        });
        console.log('Component successfully backed up to CSV after addition');
      } catch (backupError) {
        console.error('Failed to backup component after addition:', backupError);
      }
      
      toast({
        title: "Component Added",
        description: `${componentToAdd.name} has been added successfully. It will now be available in the Step Builder.`,
      });
    } catch (error) {
      console.error('Error adding component:', error);
      toast({
        title: "Error",
        description: "Failed to add component. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditComponent = async () => {
    if (!editingComponent) return;
    
    try {
      // Make sure the price is a number
      if (typeof editingComponent.price === 'string') {
        editingComponent.price = parseFloat(editingComponent.price);
      }
      
      // Ensure HTML specs are properly handled
      if (!editingComponent.specsHtml) {
        editingComponent.specsHtml = '';
      }
      
      console.log('Updating component with price:', editingComponent.price);
      console.log('Specs HTML present:', editingComponent.specsHtml ? 'Yes' : 'No');
      
      // Add updated component to the global allComponents object using async function
      const updateResult = await addComponent(editingComponent);
      
      if (!updateResult) {
        throw new Error('Failed to update component in the global state');
      }
      
      // Refresh the entire components list from the global state
      const flattenedComponents = Object.values(allComponents).flat();
      setComponents(flattenedComponents);
      
      setIsEditComponentOpen(false);
      
      // Trigger a server backup after updating
      try {
        await fetch('/api/components/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ components: allComponents }),
        });
        console.log('Component successfully backed up to CSV after update');
      } catch (backupError) {
        console.error('Failed to backup component after update:', backupError);
      }
      
      toast({
        title: "Component Updated",
        description: `${editingComponent.name} has been updated successfully. Changes will be reflected in the Step Builder.`,
      });
    } catch (error) {
      console.error('Error updating component:', error);
      toast({
        title: "Error",
        description: "Failed to update component. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteComponent = async (componentId: string) => {
    try {
      // Remove the component from the global allComponents object and database
      const removeResult = await removeComponent(componentId);
      
      if (!removeResult) {
        throw new Error('Failed to delete component from the global state');
      }
      
      // Update local state
      const updatedComponents = components.filter(comp => comp.id !== componentId);
      setComponents(updatedComponents);
      
      // Trigger a server backup after deleting to ensure consistency
      try {
        await fetch('/api/components/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ components: allComponents }),
        });
        console.log('Components successfully backed up to CSV after deletion');
      } catch (backupError) {
        console.error('Failed to backup components after deletion:', backupError);
      }
      
      toast({
        title: "Component Deleted",
        description: "Component has been deleted successfully and removed from the database.",
      });
    } catch (error) {
      console.error('Error deleting component:', error);
      toast({
        title: "Error",
        description: "Failed to delete component. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, isForGallery = false) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    try {
      // Show loading toast
      toast({
        title: "Uploading Image",
        description: "Please wait while your image is being uploaded..."
      });

      const formData = new FormData();
      
      if (isForGallery) {
        Array.from(files).forEach(file => {
          formData.append('images', file);
        });
      } else {
        formData.append('image', files[0]);
      }

      const response = await fetch('/api/uploads/component-images', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      const uploadedUrls = isForGallery ? data.urls : [data.url];
      
      if (isForGallery) {
        if (isEditComponentOpen && editingComponent) {
          const updatedGallery = [...(editingComponent.imagesGallery || []), imageUrl];
          setEditingComponent({
            ...editingComponent,
            imagesGallery: updatedGallery
          });
        } else {
          const updatedGallery = [...(newComponent.imagesGallery || []), imageUrl];
          setNewComponent({
            ...newComponent,
            imagesGallery: updatedGallery
          });
        }
        
        toast({
          title: "Image Added",
          description: "Image has been added to the gallery and will persist after server restarts.",
        });
      } else {
        if (isEditComponentOpen && editingComponent) {
          setEditingComponent({
            ...editingComponent,
            image: imageUrl
          });
        } else {
          setNewComponent({
            ...newComponent,
            image: imageUrl
          });
        }
        
        toast({
          title: "Image Uploaded",
          description: "Main image has been uploaded successfully and will persist after server restarts.",
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
    
    // Reset file input value
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (isEditComponentOpen && editingComponent) {
      const updatedGallery = [...(editingComponent.imagesGallery || [])];
      updatedGallery.splice(index, 1);
      setEditingComponent({
        ...editingComponent,
        imagesGallery: updatedGallery
      });
      
      // Save changes after removing an image
      setTimeout(() => saveCurrentState(), 500);
    } else {
      const updatedGallery = [...(newComponent.imagesGallery || [])];
      updatedGallery.splice(index, 1);
      setNewComponent({
        ...newComponent,
        imagesGallery: updatedGallery
      });
    }
  };

  const addSpecField = () => {
    const specKey = prompt("Enter specification key (e.g., 'cores', 'frequency'):");
    if (!specKey) return;
    
    const specValue = prompt(`Enter value for ${specKey}:`);
    if (specValue === null) return;
    
    if (isEditComponentOpen && editingComponent) {
      setEditingComponent({
        ...editingComponent,
        specs: {
          ...editingComponent.specs,
          [specKey]: specValue
        }
      });
    } else {
      setNewComponent({
        ...newComponent,
        specs: {
          ...(newComponent.specs || {}),
          [specKey]: specValue
        }
      });
    }
  };

  const deleteSpecField = (key: string) => {
    if (isEditComponentOpen && editingComponent) {
      const { [key]: _, ...remainingSpecs } = editingComponent.specs || {};
      setEditingComponent({
        ...editingComponent,
        specs: remainingSpecs
      });
    } else {
      const { [key]: _, ...remainingSpecs } = newComponent.specs || {};
      setNewComponent({
        ...newComponent,
        specs: remainingSpecs
      });
    }
  };

  const renderComponentForm = () => {
    const isEdit = isEditComponentOpen;
    const component = isEdit ? editingComponent as PCComponentData : newComponent;
    
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={component.name || ''} 
              onChange={(e) => {
                if (isEdit) {
                  setEditingComponent({
                    ...(editingComponent as PCComponentData),
                    name: e.target.value
                  });
                } else {
                  setNewComponent({
                    ...newComponent,
                    name: e.target.value
                  });
                }
              }}
              placeholder="Component name"
            />
          </div>
          
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input 
              id="brand" 
              value={component.brand || ''} 
              onChange={(e) => {
                if (isEdit) {
                  setEditingComponent({
                    ...(editingComponent as PCComponentData),
                    brand: e.target.value
                  });
                } else {
                  setNewComponent({
                    ...newComponent,
                    brand: e.target.value
                  });
                }
              }}
              placeholder="Manufacturer brand"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              disabled={isEdit}
              value={component.category}
              onValueChange={(value) => {
                if (isEdit) {
                  setEditingComponent({
                    ...(editingComponent as PCComponentData),
                    category: value
                  });
                } else {
                  setNewComponent({
                    ...newComponent,
                    category: value
                  });
                }
              }}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {BUILD_STEPS.map((step) => (
                  <SelectItem key={step.id} value={step.id}>
                    {step.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="price">Price (£)</Label>
            <Input 
              id="price" 
              type="number" 
              value={component.price?.toString() || '0'} 
              onChange={(e) => {
                const price = parseFloat(e.target.value);
                if (isEdit) {
                  setEditingComponent({
                    ...(editingComponent as PCComponentData),
                    price: isNaN(price) ? 0 : price
                  });
                } else {
                  setNewComponent({
                    ...newComponent,
                    price: isNaN(price) ? 0 : price
                  });
                }
              }}
              placeholder="Component price"
              min={0}
              step={0.01}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="inventoryStatus">Inventory Status</Label>
            <Select
              value={component.inventoryStatus || 'in-stock'}
              onValueChange={(value: InventoryStatus) => {
                if (isEdit) {
                  setEditingComponent({
                    ...(editingComponent as PCComponentData),
                    inventoryStatus: value
                  });
                } else {
                  setNewComponent({
                    ...newComponent,
                    inventoryStatus: value
                  });
                }
              }}
            >
              <SelectTrigger id="inventoryStatus" className="w-full">
                <SelectValue placeholder="Select inventory status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="pre-order">Pre Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            {/* Second column can be used for another field in the future */}
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={component.description} 
            onChange={(e) => {
              if (isEdit) {
                setEditingComponent({
                  ...(editingComponent as PCComponentData),
                  description: e.target.value
                });
              } else {
                setNewComponent({
                  ...newComponent,
                  description: e.target.value
                });
              }
            }}
            placeholder="Detailed description of the component"
            rows={4}
          />
        </div>
        
        <Separator />
        
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional key-value specs */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Key-Value Specifications</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={addSpecField}
                  className="text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Spec
                </Button>
              </div>
              
              <div className="border rounded-md p-3 mb-3 bg-gray-50 dark:bg-gray-900">
                {Object.keys(component.specs || {}).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(component.specs || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <div className="font-medium">{key}:</div>
                        <div className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400 mr-2">{String(value)}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                            onClick={() => deleteSpecField(key)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                    No specifications added yet
                  </div>
                )}
              </div>
            </div>
            
            {/* HTML Specifications */}
            <div>
              <Label htmlFor="specsHtml">HTML Specifications</Label>
              <Textarea 
                id="specsHtml" 
                value={component.specsHtml || ''} 
                onChange={(e) => {
                  if (isEdit) {
                    setEditingComponent({
                      ...(editingComponent as PCComponentData),
                      specsHtml: e.target.value
                    });
                  } else {
                    setNewComponent({
                      ...newComponent,
                      specsHtml: e.target.value
                    });
                  }
                }}
                placeholder="<p>HTML formatted specifications</p>"
                rows={7}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <Label htmlFor="mainImage">Main Image</Label>
          <div className="flex flex-col gap-3 mt-1">
            {component.image ? (
              <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-900 rounded-md overflow-hidden">
                <img 
                  src={component.image} 
                  alt="Main product"
                  className="w-full h-full object-contain"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => {
                    if (isEdit) {
                      setEditingComponent({
                        ...(editingComponent as PCComponentData),
                        image: ''
                      });
                    } else {
                      setNewComponent({
                        ...newComponent,
                        image: ''
                      });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-32 bg-gray-100 dark:bg-gray-900 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Image className="h-8 w-8 text-gray-400 mb-1" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No image uploaded</p>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e)}
              className="w-full"
            />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Gallery Images</Label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e, true)}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {(component.imagesGallery || []).length > 0 ? (
              (component.imagesGallery || []).map((img, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-md overflow-hidden">
                  <img 
                    src={img} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => handleRemoveGalleryImage(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center h-24 bg-gray-100 dark:bg-gray-900 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">No gallery images</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Component Management | RigFreaks Admin</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">PC Component Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Add, edit, and manage components for the PC Builder.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <Button 
            variant="default" 
            onClick={() => setIsAddComponentOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Component
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setIsImportCSVOpen(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          
          <Button 
            variant="outline"
            onClick={refreshLocalComponents}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {/* Using local storage instead of Supabase */}
        </div>
      </div>
      
      <Tabs defaultValue="cpu" className="space-y-4">
        <TabsList className="flex flex-wrap">
          {BUILD_STEPS.map((step) => (
            <TabsTrigger 
              key={step.id} 
              value={step.id}
              onClick={() => setSelectedCategory(step.id)}
              className="flex items-center"
            >
              <span className="mr-1">{step.icon}</span>
              {step.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {BUILD_STEPS.map((step) => (
          <TabsContent 
            key={step.id} 
            value={step.id}
            className="space-y-4"
          >
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading components...</span>
              </div>
            ) : filteredComponents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComponents.map((component) => (
                  <Card key={component.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{component.name}</CardTitle>
                        
                        {/* Inventory status badge */}
                        {component.inventoryStatus === 'in-stock' ? (
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">In Stock</Badge>
                        ) : component.inventoryStatus === 'out-of-stock' ? (
                          <Badge variant="destructive">Out of Stock</Badge>  
                        ) : (
                          <Badge variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white">Pre Order</Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                          {component.image ? (
                            <img 
                              src={component.image} 
                              alt={component.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Image className="h-8 w-8 text-gray-300" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{component.brand}</p>
                          <p className="font-semibold text-lg">£{component.price?.toFixed(2)}</p>
                          
                          {/* Gallery indication if it has multiple images */}
                          {(component.imagesGallery?.length || 0) > 0 && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              +{component.imagesGallery?.length} gallery images
                            </p>
                          )}
                          
                          {/* Display first two specs as preview */}
                          {Object.entries(component.specs || {}).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="text-xs mt-1">
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end gap-2 p-3 pt-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingComponent(component);
                          setIsEditComponentOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${component.name}?`)) {
                            handleDeleteComponent(component.id as string);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-3 mb-4">
                    <Cpu className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No {step.name} Components</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    There are no {step.name.toLowerCase()} components available. Start by adding a new one.
                  </p>
                  <Button 
                    variant="default"
                    onClick={() => {
                      setNewComponent({
                        ...newComponent,
                        category: step.id
                      });
                      setIsAddComponentOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add {step.name} Component
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Add Component Dialog */}
      <Dialog open={isAddComponentOpen} onOpenChange={setIsAddComponentOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Component</DialogTitle>
            <DialogDescription>
              Add a new component to the PC Builder. Fill in all the required fields.
            </DialogDescription>
          </DialogHeader>
          
          {renderComponentForm()}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddComponentOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddComponent}>
              <Save className="h-4 w-4 mr-2" />
              Save Component
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Component Dialog */}
      <Dialog open={isEditComponentOpen} onOpenChange={setIsEditComponentOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Component</DialogTitle>
            <DialogDescription>
              Update component details. Changes will be saved to the database.
            </DialogDescription>
          </DialogHeader>
          
          {renderComponentForm()}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditComponentOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditComponent}>
              <Save className="h-4 w-4 mr-2" />
              Update Component
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import CSV Dialog */}
      <Dialog open={isImportCSVOpen} onOpenChange={setIsImportCSVOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Components from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with component data. The file should have the correct headers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="csvFile">Upload CSV File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv,.tsv,text/csv,text/tab-separated-values"
                  onChange={handleCsvFileChange}
                />
                <Button
                  variant="outline"
                  onClick={importCsvFile}
                  disabled={!csvFile}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </Button>
              </div>
              {csvFile && (
                <p className="text-xs text-gray-500">Selected: {csvFile.name}</p>
              )}
            </div>
            
            {csvImportStatus && (
              <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center mb-2">
                  {csvImportStatus.success ? (
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="font-medium">Successfully imported {csvImportStatus.imported} components</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="font-medium">Import failed</span>
                    </div>
                  )}
                </div>
                
                {csvImportStatus.errors.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Errors:</h4>
                    <ul className="list-disc list-inside text-xs text-red-600 dark:text-red-400 space-y-1">
                      {csvImportStatus.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ComponentAdmin;