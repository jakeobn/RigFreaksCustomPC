import { Request, Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
const componentImagesDir = path.join(uploadDir, 'components');

// Create directories if they don't exist
[uploadDir, componentImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage with more stable file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, componentImagesDir);
  },
  filename: function (req, file, cb) {
    // Get component type and name from the request body if available
    const componentType = req.body.componentType || 'unknown';
    const componentName = req.body.componentName || '';
    
    // Create a more identifiable filename
    const sanitizedName = componentName ? 
      componentName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30) : 
      'component';
    
    // Still add timestamp for uniqueness but in a more stable format
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').substring(0, 14);
    const ext = path.extname(file.originalname);
    
    // Format: component-type-sanitized-name-timestamp.ext
    cb(null, `${componentType}-${sanitizedName}-${timestamp}${ext}`);
  }
});

// File filter to only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Configure multer with storage and limits
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter
});

// Upload single image route
router.post('/component-image', upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided or invalid image format'
      });
    }
    
    // Return the URL path that can be used to access the file
    const imagePath = `/uploads/components/${req.file.filename}`;
    
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imagePath
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
});

// Upload multiple images route
router.post('/component-gallery', upload.array('images', 10), (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image files provided or invalid image format'
      });
    }
    
    // Return the URL paths that can be used to access the files
    const imagePaths = files.map(file => `/uploads/components/${file.filename}`);
    
    return res.status(200).json({
      success: true,
      message: `${files.length} images uploaded successfully`,
      imagePaths
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload images'
    });
  }
});

export default router;