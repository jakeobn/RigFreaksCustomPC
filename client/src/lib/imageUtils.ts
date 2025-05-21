/**
 * Utilities for handling image URLs
 */

/**
 * Process image URL to format correctly for display
 * Handles both local paths and full URLs
 */
export function processImageUrl(url: string, folder: string = 'components'): string {
  if (!url) return '/default-component.jpg';

  // Already a full URL
  if (url.startsWith('http')) {
    return url;
  }

  // Local path
  if (url.startsWith('/')) {
    return url;
  }

  // If none of the above, assume it's a filename in the uploads folder
  return `/uploads/${folder}/${url}`;
}

/**
 * Process an array of image URLs for gallery display
 */
export function processGalleryUrls(urls: string[] = []): string[] {
  if (!urls || !Array.isArray(urls)) return [];

  return urls.map(url => processImageUrl(url, 'gallery-images'));
}