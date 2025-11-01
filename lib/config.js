/**
 * Application configuration
 */

// Allowed audio file extensions
export const ALLOWED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];

// Allowed image file extensions
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Maximum file size for audio files (100MB)
export const MAX_AUDIO_FILE_SIZE = 100 * 1024 * 1024;

// Maximum file size for images (10MB)
export const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validates if a path is within allowed directories
 * This prevents path traversal attacks
 */
export function isPathAllowed(requestedPath, basePath) {
  if (!requestedPath || !basePath) {
    return false;
  }

  const path = require('path');
  
  // Normalize paths to prevent path traversal
  const normalizedBase = path.resolve(basePath);
  const normalizedRequested = path.resolve(requestedPath);
  
  // Check if requested path starts with base path
  return normalizedRequested.startsWith(normalizedBase);
}

/**
 * Sanitizes a file path to prevent path traversal
 */
export function sanitizePath(inputPath) {
  if (!inputPath || typeof inputPath !== 'string') {
    return null;
  }

  const path = require('path');
  
  // Remove null bytes
  const cleaned = inputPath.replace(/\0/g, '');
  
  // Normalize the path
  const normalized = path.normalize(cleaned);
  
  // Check for path traversal attempts
  if (normalized.includes('..') || normalized.includes('~')) {
    return null;
  }
  
  return normalized;
}

/**
 * Validates file extension
 */
export function hasValidExtension(filePath, allowedExtensions) {
  if (!filePath || !Array.isArray(allowedExtensions)) {
    return false;
  }

  const path = require('path');
  const ext = path.extname(filePath).toLowerCase();
  
  return allowedExtensions.includes(ext);
}

/**
 * Gets MIME type from file extension
 */
export function getMimeType(filePath) {
  const path = require('path');
  const ext = path.extname(filePath).toLowerCase();
  
  const mimeTypes = {
    // Audio
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    '.flac': 'audio/flac',
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}
