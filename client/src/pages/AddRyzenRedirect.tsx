import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function AddRyzenRedirect() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to the AddRyzenPage
    setLocation('/admin/components/add-ryzen');
  }, [setLocation]);
  
  return (
    <div className="container mx-auto py-8 text-center">
      Redirecting...
    </div>
  );
}