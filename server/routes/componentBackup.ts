import express from 'express';
import fs from 'fs';
import path from 'path';
import { saveComponentsToCsv, restoreComponentsFromCsv, parseComponentsFromCsv } from '../services/autoBackupService';
import { executeWithRetry } from '../db';

const router = express.Router();
const BACKUP_DIR = './public/backups';
const UPLOADS_DIR = './attached_assets';

// Maximum retry attempts for database operations
const MAX_RETRIES = 3;

// API endpoint to trigger a manual CSV backup
router.post('/backup', async (req, res) => {
  try {
    const components = req.body.components;

    if (!components) {
      return res.status(400).json({ error: 'No component data provided' });
    }

    // Save to filesystem - this doesn't involve the database
    // so no need for retry here
    saveComponentsToCsv(components);

    // Now try to save to database, but don't fail if database is down
    try {
      // For database operations, we'd use executeWithRetry here
      // This is just a placeholder for any future database backup operations
      await executeWithRetry(async () => {
        // Any database operations would go here
        // e.g. await db.insert(backupTable).values({...});
        return true;
      });
    } catch (dbError: any) {
      // Log database error but don't fail the entire request
      // since we already saved to filesystem
      console.warn('Database backup failed, but filesystem backup succeeded:', dbError.message);

      // Still return success but with a warning
      return res.status(200).json({
        success: true,
        message: 'Components backed up to filesystem successfully',
        warning: 'Database backup failed. Data is saved locally but might not persist across sessions.',
        backupPath: '/backups/components.csv'
      });
    }

    // If we get here, both filesystem and database operations succeeded
    return res.status(200).json({
      success: true,
      message: 'Components backed up successfully',
      backupPath: '/backups/components.csv'
    });
  } catch (error: any) {
    console.error('Error in backup API:', error);
    return res.status(500).json({ 
      error: 'Failed to backup components',
      message: error.message
    });
  }
});

// API endpoint to get backup file info
router.get('/backup/info', (req, res) => {
  try {
    // Get list of all backup files
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.endsWith('.csv'))
      .map(file => ({
        name: file,
        path: `/backups/${file}`,
        date: file.includes('_') 
          ? new Date(file.split('_')[1].split('.')[0].replace(/-/g, ':'))
          : new Date(),
        size: fs.statSync(path.join(BACKUP_DIR, file)).size
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    // Also check if we have any upload files
    const uploadFiles = fs.existsSync(UPLOADS_DIR) 
      ? fs.readdirSync(UPLOADS_DIR)
          .filter(file => file.endsWith('.csv'))
          .map(file => ({
            name: file,
            path: `/attached_assets/${file}`,
            date: fs.statSync(path.join(UPLOADS_DIR, file)).mtime,
            size: fs.statSync(path.join(UPLOADS_DIR, file)).size,
            isUpload: true
          }))
      : [];

    // Combine both lists
    const allFiles = [...files, ...uploadFiles]
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    // Return information about all backup files
    return res.status(200).json({
      success: true,
      files: allFiles,
      latestBackup: files.length > 0 ? files[0] : null
    });
  } catch (error) {
    console.error('Error getting backup info:', error);
    return res.status(500).json({ error: 'Failed to get backup information' });
  }
});

// API endpoint to restore components from a CSV file
router.post('/restore', async (req, res) => {
  try {
    const { filePath, saveToDb } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'No file path provided' });
    }

    // Resolve the file path based on whether it's in uploads or backups
    let resolvedPath;
    if (filePath.startsWith('/attached_assets/')) {
      resolvedPath = path.join('.', filePath);
    } else if (filePath.startsWith('/backups/')) {
      resolvedPath = path.join('.', 'public', filePath);
    } else {
      resolvedPath = path.join(BACKUP_DIR, filePath);
    }

    console.log(`Restoring components from: ${resolvedPath}`);

    try {
      // Use our retry functionality for database operations
      const result = await executeWithRetry(() => 
        restoreComponentsFromCsv(resolvedPath, saveToDb !== false)
      );

      return res.status(result.success ? 200 : 400).json(result);
    } catch (dbError: any) {
      console.error('Database error during component restore:', dbError);

      // If we have a database error, try to restore without saving to DB
      // This ensures the user can at least get their components back in memory
      if (saveToDb) {
        console.log('Attempting to restore without saving to database...');
        const fallbackResult = await restoreComponentsFromCsv(resolvedPath, false);

        // If the fallback worked, return it with a warning
        if (fallbackResult.success) {
          return res.status(200).json({
            ...fallbackResult,
            warning: 'Components were loaded but could not be saved to the database due to connection issues. Your data is available in memory only until you save it again.'
          });
        }
      }

      // If we get here, both attempts failed
      return res.status(500).json({
        success: false,
        error: 'Failed to restore components due to database issues',
        message: dbError.message,
        suggestion: 'Please try again later when database connectivity is restored.'
      });
    }
  } catch (error: any) {
    console.error('Error restoring components:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to restore components',
      message: error.message
    });
  }
});

// API endpoint to check content of a CSV file
router.post('/check', async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'No file path provided' });
    }

    // Resolve the file path based on whether it's in uploads or backups
    let resolvedPath;
    if (filePath.startsWith('/attached_assets/')) {
      resolvedPath = path.join('.', filePath);
    } else if (filePath.startsWith('/backups/')) {
      resolvedPath = path.join('.', 'public', filePath);
    } else {
      resolvedPath = path.join(BACKUP_DIR, filePath);
    }

    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({
        success: false,
        message: `File not found: ${resolvedPath}`
      });
    }

    const components = parseComponentsFromCsv(resolvedPath);

    // Count components by category
    const categoryCounts = {};
    let totalCount = 0;

    Object.keys(components).forEach(category => {
      categoryCounts[category] = components[category].length;
      totalCount += components[category].length;
    });

    return res.status(200).json({
      success: true,
      totalComponents: totalCount,
      categoryCounts,
      // Only send the first few components to avoid large response
      preview: Object.keys(components).reduce((acc, category) => {
        acc[category] = components[category].slice(0, 3);
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error checking CSV file:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to check CSV file',
      message: error.message
    });
  }
});

export default router;