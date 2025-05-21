import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  buttonText?: string;
  isGallery?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
  icon?: React.ReactNode;
}

const FileUploader = ({
  onImageUploaded,
  buttonText = 'Upload Image',
  isGallery = false,
  className = '',
  variant = 'outline',
  size = 'default',
  icon = <Upload className="h-4 w-4 mr-2" />
}: FileUploaderProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    
    try {
      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append('image', file);
      
      // Show loading toast
      toast({
        title: "Uploading Image",
        description: "Please wait while the image is being uploaded...",
      });
      
      // Upload the file to the server
      const response = await fetch('/api/uploads/component-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }
      
      const imageUrl = result.imagePath; // This will be the path to the uploaded image
      
      // Call the callback with the image URL
      onImageUploaded(imageUrl);
      
      toast({
        title: isGallery ? "Image Added" : "Image Uploaded",
        description: isGallery 
          ? "Image has been added to the gallery." 
          : "Main product image has been updated."
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      
      // Reset file input value
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div>
      <Button 
        type="button" 
        variant={variant as any} 
        size={size as any}
        className={className}
        disabled={isUploading}
        onClick={() => document.getElementById(isGallery ? 'gallery-upload' : 'main-upload')?.click()}
      >
        {isUploading ? (
          <span className="animate-pulse">Uploading...</span>
        ) : (
          <>
            {icon}
            {buttonText}
          </>
        )}
      </Button>
      <input 
        id={isGallery ? 'gallery-upload' : 'main-upload'}
        type="file" 
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;