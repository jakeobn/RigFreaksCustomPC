import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersistentGalleryUploadProps {
  onImagesUploaded: (imagePaths: string[]) => void;
  componentType: string;
  componentName: string;
  multiple?: boolean;
  className?: string;
}

export function PersistentGalleryUpload({
  onImagesUploaded,
  componentType,
  componentName,
  multiple = true,
  className = ''
}: PersistentGalleryUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Show loading toast
      toast({
        title: "Uploading Images",
        description: `Uploading ${files.length} ${files.length > 1 ? 'images' : 'image'}. Please wait...`
      });
      
      // Create FormData object to send files to server
      const formData = new FormData();
      
      if (multiple) {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
      } else {
        formData.append('image', files[0]);
      }
      
      // Add component metadata to ensure proper file naming and persistence
      formData.append('componentType', componentType);
      formData.append('componentName', componentName);
      
      // Upload the files to the server
      const endpoint = multiple ? '/api/uploads/component-gallery' : '/api/uploads/component-image';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload ${multiple ? 'gallery images' : 'image'}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }
      
      // Get the permanent URL paths to the uploaded images
      const imagePaths = multiple ? data.imagePaths : [data.imagePath];
      
      // Trigger callback
      onImagesUploaded(imagePaths);
      
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${imagePaths.length} ${imagePaths.length > 1 ? 'images' : 'image'}. Images will persist after server restarts.`
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      
      // Reset file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        hidden
        multiple={multiple}
        accept="image/*"
        onChange={handleUpload}
        ref={fileInputRef}
      />
      
      <Button
        variant="outline"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </span>
        ) : (
          <span className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            {multiple ? 'Upload Gallery Images' : 'Upload Image'}
          </span>
        )}
      </Button>
    </div>
  );
}