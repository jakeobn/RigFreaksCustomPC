/**
 * Image routes for handling image operations
 */

import { Router } from 'express';

const router = Router();

// Image operations API endpoint
router.post('/api/images/process', async (req, res) => {
  console.log('Image processing request received');
  res.status(200).json({
    success: true,
    message: 'Images are stored locally in the filesystem'
  });
});

export default router;