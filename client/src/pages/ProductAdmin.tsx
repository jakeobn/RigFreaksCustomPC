import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Plus, Trash2, Save, Image, Info, Tag, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

// Define the form schema based on product structure
const productSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  handle: z.string().min(3, { message: "Handle must be at least 3 characters" })
    .refine(val => /^[a-z0-9-]+$/.test(val), {
      message: "Handle can only contain lowercase letters, numbers, and hyphens"
    }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.string().min(1, { message: "Price is required" }),
  compareAtPrice: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().optional(),
  featuredImageUrl: z.string().url({ message: "Featured image URL must be valid" }),
  imagesUrls: z.array(z.string().url({ message: "Image URL must be valid" })).optional(),
  tags: z.array(z.string()).optional(),
  specs: z.record(z.string(), z.any()),
  stock: z.union([
    z.number().min(0),
    z.string().transform(val => val && val.trim() ? parseInt(val, 10) : 0)
  ]).default(0),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Define interfaces for API data
interface Collection {
  id: number;
  title: string;
  handle: string;
  description?: string;
}

interface Product {
  id: number;
  title: string;
  handle: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  category: string;
  subcategory?: string;
  featuredImageUrl: string;
  imagesUrls?: string[];
  tags?: string[];
  specs: Record<string, any>;
  stock: number;
}

const ProductAdmin: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("add-product");
  const [selectedCollections, setSelectedCollections] = useState<number[]>([]);
  const [currentImgUrl, setCurrentImgUrl] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [specsKey, setSpecsKey] = useState("");
  const [specsValue, setSpecsValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch collections for dropdown
  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });
  
  // Fetch existing products
  const { data: products = [], refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Default values with placeholders
  const defaultValues: Partial<ProductFormValues> = {
    title: "",
    handle: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "",
    subcategory: "",
    featuredImageUrl: "",
    imagesUrls: [],
    tags: [],
    specs: {},
    stock: 0,
  };
  
  // Setup form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });
  
  const { reset, watch } = form;
  const watchedValues = watch();
  
  // Generate handle from title
  useEffect(() => {
    const title = watchedValues.title;
    if (title && !watchedValues.handle) {
      const handle = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("handle", handle);
    }
  }, [watchedValues.title, form, watchedValues.handle]);
  
  // Create product mutation
  const createProduct = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: async (data) => {
      // Add product to selected collections
      if (selectedCollections.length > 0) {
        for (const collectionId of selectedCollections) {
          await apiRequest("POST", "/api/product-collections", {
            productId: data.id,
            collectionId,
          });
        }
      }
      
      toast({
        title: "Product created",
        description: `${data.title} has been added to the store.`,
      });
      
      // Reset form and selected values
      reset(defaultValues);
      setSelectedCollections([]);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
    },
    onError: (error) => {
      toast({
        title: "Error creating product",
        description: error.message || "There was an error adding the product. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      await createProduct.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add an image URL to the images array
  const addImageUrl = () => {
    if (!currentImgUrl || !currentImgUrl.trim()) return;
    
    const currentUrls = form.getValues("imagesUrls") || [];
    form.setValue("imagesUrls", [...currentUrls, currentImgUrl]);
    setCurrentImgUrl("");
  };
  
  // Remove an image URL
  const removeImageUrl = (index: number) => {
    const currentUrls = form.getValues("imagesUrls") || [];
    form.setValue(
      "imagesUrls", 
      currentUrls.filter((_, i) => i !== index)
    );
  };
  
  // Add a tag
  const addTag = () => {
    if (!currentTag || !currentTag.trim()) return;
    
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", [...currentTags, currentTag]);
    setCurrentTag("");
  };
  
  // Remove a tag
  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags", 
      currentTags.filter((_, i) => i !== index)
    );
  };
  
  // Add a spec
  const addSpec = () => {
    if (!specsKey || !specsKey.trim() || !specsValue.trim()) return;
    
    const currentSpecs = form.getValues("specs") || {};
    form.setValue("specs", {
      ...currentSpecs,
      [specsKey]: specsValue,
    });
    
    setSpecsKey("");
    setSpecsValue("");
  };
  
  // Remove a spec
  const removeSpec = (key: string) => {
    const currentSpecs = form.getValues("specs") || {};
    const { [key]: _, ...restSpecs } = currentSpecs;
    form.setValue("specs", restSpecs);
  };
  
  // Toggle collection selection
  const toggleCollection = (collectionId: number) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };
  
  // Delete product handler (for product list)
  const deleteProduct = async (productId: number) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    
    try {
      await apiRequest("DELETE", `/api/products/${productId}`);
      toast({
        title: "Product deleted",
        description: "The product has been removed from the store.",
      });
      refetchProducts();
    } catch (error) {
      toast({
        title: "Error deleting product",
        description: "There was an error deleting the product. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Product Administration - RigFreaks</title>
        <meta name="description" content="Manage products for your online store" />
      </Helmet>
      
      <section className="bg-dark-base py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Product Administration</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-8">
              <TabsTrigger value="add-product">Add New Product</TabsTrigger>
              <TabsTrigger value="product-list">Manage Products</TabsTrigger>
            </TabsList>
            
            {/* Add Product Tab */}
            <TabsContent value="add-product">
              <Card className="bg-dark-card border-gray-700">
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                  <CardDescription>
                    Create a new product for your store. Fill in the details below and click 'Save Product'.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                          
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Vortex Pro Gaming PC" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="handle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL Handle</FormLabel>
                                <FormControl>
                                  <Input placeholder="vortex-pro-gaming-pc" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Detailed product description" 
                                    className="min-h-[120px]" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price ($)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="1999.99" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="compareAtPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Compare at Price ($)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="2499.99" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-dark-surface border-gray-700">
                                      <SelectItem value="vortex">Vortex (High-End)</SelectItem>
                                      <SelectItem value="nova">Nova (Mid-Range)</SelectItem>
                                      <SelectItem value="pulse">Pulse (Creator)</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="subcategory"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subcategory (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Gaming" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stock Quantity</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="10" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {/* Images, Tags, Collections */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold mb-4">Images & Organization</h3>
                          
                          <FormField
                            control={form.control}
                            name="featuredImageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Featured Image URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/image.jpg" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Featured image preview */}
                          {watchedValues.featuredImageUrl && (
                            <div className="mt-2 relative rounded-md overflow-hidden">
                              <img 
                                src={watchedValues.featuredImageUrl} 
                                alt="Featured preview" 
                                className="w-full h-40 object-cover rounded border border-gray-700" 
                              />
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <Label>Additional Images</Label>
                            <div className="flex space-x-2">
                              <Input 
                                placeholder="https://example.com/image2.jpg" 
                                value={currentImgUrl}
                                onChange={(e) => setCurrentImgUrl(e.target.value)}
                              />
                              <Button type="button" size="sm" onClick={addImageUrl}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                              </Button>
                            </div>
                            
                            {/* Image URLs list */}
                            {(watchedValues.imagesUrls || []).length > 0 && (
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                {(watchedValues.imagesUrls || []).map((url, index) => (
                                  <div key={index} className="relative group">
                                    <img 
                                      src={url} 
                                      alt={`Product ${index + 1}`} 
                                      className="w-full h-28 object-cover rounded border border-gray-700" 
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeImageUrl(index)}
                                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex space-x-2">
                              <Input 
                                placeholder="gaming, bestseller, new" 
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                              />
                              <Button type="button" size="sm" onClick={addTag}>
                                <Tag className="h-4 w-4 mr-1" /> Add
                              </Button>
                            </div>
                            
                            {/* Tags list */}
                            {(watchedValues.tags || []).length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(watchedValues.tags || []).map((tag, index) => (
                                  <div 
                                    key={index} 
                                    className="bg-primary/20 text-primary rounded-full px-3 py-1 text-sm flex items-center"
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => removeTag(index)}
                                      className="ml-2 text-primary hover:text-white"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2 mt-4">
                            <Label>Collections</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {collections.map((collection) => (
                                <div key={collection.id} className="flex items-center space-x-2">
                                  <Switch 
                                    id={`collection-${collection.id}`}
                                    checked={selectedCollections.includes(collection.id)}
                                    onCheckedChange={() => toggleCollection(collection.id)}
                                  />
                                  <Label htmlFor={`collection-${collection.id}`}>
                                    {collection.title}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                        
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="specs">
                          <AccordionTrigger className="font-semibold">
                            <Info className="h-5 w-5 mr-2" /> Product Specifications
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-4">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <Input 
                                  placeholder="Spec Name (e.g. CPU)" 
                                  value={specsKey}
                                  onChange={(e) => setSpecsKey(e.target.value)}
                                />
                                <Input 
                                  placeholder="Spec Value (e.g. Intel i9-13900K)" 
                                  value={specsValue}
                                  onChange={(e) => setSpecsValue(e.target.value)}
                                />
                                <Button type="button" onClick={addSpec} className="w-full md:w-auto">
                                  <Plus className="h-4 w-4 mr-1" /> Add Spec
                                </Button>
                              </div>
                              
                              {/* Specs list */}
                              {Object.keys(watchedValues.specs || {}).length > 0 && (
                                <div className="mt-4 border border-gray-700 rounded-md overflow-hidden">
                                  <table className="w-full">
                                    <thead className="bg-dark-surface">
                                      <tr>
                                        <th className="text-left p-3">Specification</th>
                                        <th className="text-left p-3">Value</th>
                                        <th className="text-right p-3 w-16">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.entries(watchedValues.specs || {}).map(([key, value]) => (
                                        <tr key={key} className="border-t border-gray-700">
                                          <td className="p-3">{key}</td>
                                          <td className="p-3">{value}</td>
                                          <td className="p-3 text-right">
                                            <Button 
                                              type="button" 
                                              variant="ghost" 
                                              size="sm" 
                                              onClick={() => removeSpec(key)}
                                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                        
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="mt-8 ml-auto py-2 px-6 flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" /> Save Product
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Product List Tab */}
            <TabsContent value="product-list">
              <Card className="bg-dark-card border-gray-700">
                <CardHeader>
                  <CardTitle>Manage Products</CardTitle>
                  <CardDescription>
                    View and manage existing products in your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-dark-surface">
                        <tr>
                          <th className="p-3 text-left">Image</th>
                          <th className="p-3 text-left">Title</th>
                          <th className="p-3 text-left">Category</th>
                          <th className="p-3 text-left">Price</th>
                          <th className="p-3 text-left">Stock</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-t border-gray-700">
                            <td className="p-3">
                              {product.featuredImageUrl ? (
                                <img 
                                  src={product.featuredImageUrl} 
                                  alt={product.title} 
                                  className="w-12 h-12 object-cover rounded-sm"
                                />
                              ) : (
                                <div className="w-12 h-12 flex items-center justify-center bg-dark-surface rounded-sm">
                                  <Image className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                            </td>
                            <td className="p-3">{product.title}</td>
                            <td className="p-3 capitalize">{product.category}</td>
                            <td className="p-3">${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : '0.00'}</td>
                            <td className="p-3">{product.stock}</td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  type="button" 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => navigate(`/product/${product.handle}`)}
                                >
                                  View
                                </Button>
                                <Button 
                                  type="button" 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        
                        {products.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                              No products found. Add your first product to get started.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => setActiveTab("add-product")}>
                    <Plus className="h-4 w-4 mr-2" /> Add New Product
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default ProductAdmin;