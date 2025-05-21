import React from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Helmet } from "react-helmet";
import { Filter, SlidersHorizontal, Grid3X3, Grid2X2 } from "lucide-react";

const Collection: React.FC = () => {
  const [match, params] = useRoute<{ handle: string }>("/collections/:handle");
  const collectionHandle = params?.handle;
  
  const [gridView, setGridView] = React.useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = React.useState("featured");
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  
  const { data: collection, isLoading } = useQuery({
    queryKey: [`/api/collections/${collectionHandle}`],
    enabled: !!collectionHandle,
    staleTime: 60 * 1000,
  });

  // Fallback data for render
  const collectionData = collection || {
    id: 1,
    title: collectionHandle === "all" ? "All Gaming PCs" : 
           collectionHandle === "vortex" ? "Vortex Gaming PCs" :
           collectionHandle === "nova" ? "Nova Gaming PCs" :
           collectionHandle === "pulse" ? "Pulse Creator PCs" : "Collection",
    handle: collectionHandle || "all",
    description: collectionHandle === "vortex" ? "Ultimate 4K gaming experience with framerates up to 120fps" :
                collectionHandle === "nova" ? "Perfect for 1080p/1440p gaming with smooth framerates" :
                collectionHandle === "pulse" ? "Designed for content creators, video editing, and 3D rendering" :
                "Browse our selection of custom gaming PCs and workstations",
    imageUrl: collectionHandle === "vortex" ? "https://images.unsplash.com/photo-1547082299-de196ea013d6" :
             collectionHandle === "nova" ? "https://images.unsplash.com/photo-1587202372775-e229f172b9d7" :
             collectionHandle === "pulse" ? "https://images.unsplash.com/photo-1593640408182-31c70c8268f5" :
             "https://images.unsplash.com/photo-1587202372616-b43abea06c2a",
    products: []
  };
  
  // For collection pages, we're already getting the correct products from the API
  const filteredProducts = collectionData?.products || [];
  
  // Apply any additional filters
  const applyFilters = () => {
    let result = [...filteredProducts];
    
    // Apply sorting
    if (sortOption === "price-asc") {
      result = result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === "price-desc") {
      result = result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    
    // Apply PC component filters
    if (filters.gpu && filters.gpu !== 'all') {
      result = result.filter(product => 
        product.specs && product.specs.gpu && product.specs.gpu.toLowerCase().includes(filters.gpu.toLowerCase())
      );
    }
    
    if (filters.cpu && filters.cpu !== 'all') {
      result = result.filter(product => 
        product.specs && product.specs.cpu && product.specs.cpu.toLowerCase().includes(filters.cpu.toLowerCase())
      );
    }
    
    if (filters.ram && filters.ram !== 'all') {
      result = result.filter(product => 
        product.specs && product.specs.ram && product.specs.ram.toLowerCase().includes(filters.ram.toLowerCase())
      );
    }
    
    return result;
  };
  
  const productsToShow = applyFilters();
  
  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Render filter options for PC components
  const renderFilterOptions = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">GPU</label>
          <Select 
            value={filters.gpu || "all"} 
            onValueChange={(value) => handleFilterChange("gpu", value)}
          >
            <SelectTrigger className="w-full bg-dark-card border-gray-700">
              <SelectValue placeholder="All GPUs" />
            </SelectTrigger>
            <SelectContent className="bg-dark-surface border-gray-700">
              <SelectItem value="all">All GPUs</SelectItem>
              <SelectItem value="4090">RTX 4090</SelectItem>
              <SelectItem value="4080">RTX 4080</SelectItem>
              <SelectItem value="3070">RTX 3070</SelectItem>
              <SelectItem value="3060">RTX 3060</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">CPU</label>
          <Select 
            value={filters.cpu || "all"} 
            onValueChange={(value) => handleFilterChange("cpu", value)}
          >
            <SelectTrigger className="w-full bg-dark-card border-gray-700">
              <SelectValue placeholder="All CPUs" />
            </SelectTrigger>
            <SelectContent className="bg-dark-surface border-gray-700">
              <SelectItem value="all">All CPUs</SelectItem>
              <SelectItem value="i9">Intel Core i9</SelectItem>
              <SelectItem value="i7">Intel Core i7</SelectItem>
              <SelectItem value="i5">Intel Core i5</SelectItem>
              <SelectItem value="ryzen">AMD Ryzen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">RAM</label>
          <Select 
            value={filters.ram || "all"} 
            onValueChange={(value) => handleFilterChange("ram", value)}
          >
            <SelectTrigger className="w-full bg-dark-card border-gray-700">
              <SelectValue placeholder="All RAM" />
            </SelectTrigger>
            <SelectContent className="bg-dark-surface border-gray-700">
              <SelectItem value="all">All RAM</SelectItem>
              <SelectItem value="64GB">64GB</SelectItem>
              <SelectItem value="32GB">32GB</SelectItem>
              <SelectItem value="16GB">16GB</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-3 flex justify-end mt-4">
          <Button 
            variant="outline" 
            className="mr-3"
            onClick={() => setFilters({})}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{collectionData.title} - RigFreaks</title>
        <meta name="description" content={collectionData.description} />
        <meta property="og:title" content={`${collectionData.title} - RigFreaks`} />
        <meta property="og:description" content={collectionData.description} />
        <meta property="og:image" content={collectionData.imageUrl} />
        <meta property="og:url" content={`https://rigfreaks.com/collections/${collectionData.handle}`} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Collection Hero */}
      <section 
        className="relative h-[40vh] flex items-center bg-cover bg-center" 
        style={{
          backgroundImage: `url('${collectionData.imageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-dark-base/90"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-rajdhani mb-4 leading-tight">
              {collectionData.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-inter">
              {collectionData.description}
            </p>
          </div>
        </div>
      </section>
      
      {/* Collection Content */}
      <section className="bg-dark-base py-12">
        <div className="container mx-auto px-4">
          {/* Filters and Sorting */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Button 
                variant="outline" 
                className="mr-3"
                onClick={toggleFilterPanel}
              >
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
              
              <div className="flex items-center border border-gray-800 rounded-md overflow-hidden">
                <button 
                  className={`p-2 ${gridView === "grid" ? "bg-dark-card text-blue-500" : "bg-dark-surface text-muted-foreground"}`}
                  onClick={() => setGridView("grid")}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button 
                  className={`p-2 ${gridView === "list" ? "bg-dark-card text-blue-500" : "bg-dark-surface text-muted-foreground"}`}
                  onClick={() => setGridView("list")}
                >
                  <Grid2X2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <p className="mr-3 text-muted-foreground">
                {productsToShow.length} products
              </p>
              
              <Select 
                value={sortOption} 
                onValueChange={(value) => setSortOption(value)}
              >
                <SelectTrigger className="w-[180px] bg-dark-card border-gray-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-dark-surface border-gray-800">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Filter Panel (conditional) */}
          {isFilterOpen && (
            <div className="bg-dark-card border border-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold font-rajdhani mb-4 flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2" /> Filter Products
              </h3>
              
              {renderFilterOptions()}
            </div>
          )}
          
          {/* Products Grid */}
          {productsToShow.length > 0 ? (
            <div className={`grid ${gridView === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"} gap-6`}>
              {productsToShow.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-rajdhani font-bold mb-4">No Products Found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
              <Button onClick={() => setFilters({})}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Collection;