import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createRyzenCpu } from '@/lib/ryzenCpuAdder';
import { Link } from 'wouter';

export default function AddRyzenPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddRyzen = async () => {
    setLoading(true);
    try {
      const result = await createRyzenCpu();
      
      if (result) {
        setAdded(true);
        toast({
          title: "CPU Added",
          description: "AMD Ryzen 9 9950X has been added to the database and local storage.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add the CPU. Please check the console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding Ryzen CPU:', error);
      toast({
        title: "Error",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Add AMD Ryzen 9 9950X | RigFreaks</title>
      </Helmet>
      
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Add AMD Ryzen 9 9950X</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>
            This will add the AMD Ryzen 9 9950X CPU with detailed specifications to your database and local storage.
          </p>
          
          <div className="flex justify-center my-4">
            <img 
              src="/assets/images/cpu/amd-ryzen-9-9950x.svg" 
              alt="AMD Ryzen 9 9950X CPU" 
              className="w-32 h-32 object-contain"
            />
          </div>
          
          <div className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-4">
            <ul className="list-disc list-inside space-y-1">
              <li>Socket: AM5</li>
              <li>Cores: 16</li>
              <li>Threads: 32</li>
              <li>Base Clock: 4.3 GHz</li>
              <li>Boost Clock: Up to 5.7 GHz</li>
              <li>Price: £908.99</li>
            </ul>
          </div>
          
          {added ? (
            <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>CPU successfully added!</span>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
          {!added ? (
            <Button 
              onClick={handleAddRyzen} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Adding...' : 'Add Ryzen 9 9950X'}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/admin/components">Go to Component Admin</Link>
              </Button>
              <Button 
                variant="outline"
                onClick={() => setAdded(false)}
                className="w-full sm:w-auto"
              >
                Add Again
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}