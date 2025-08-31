#!/usr/bin/env node

/**
 * Image optimization script
 * Converts large images to WebP format and creates responsive sizes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const OUTPUT_DIR = path.join(__dirname, '../public/optimized-images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Image sizes for responsive images
const SIZES = {
  thumbnail: 150,
  small: 300,
  medium: 600,
  large: 1200,
};

// Quality settings for WebP
const WEBP_QUALITY = 85;

/**
 * Check if ImageMagick is installed
 */
function checkImageMagick() {
  try {
    execSync('convert --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.warn('ImageMagick not found. Please install ImageMagick for image optimization.');
    return false;
  }
}

/**
 * Convert image to WebP format
 */
function convertToWebP(inputPath, outputPath, quality = WEBP_QUALITY) {
  try {
    const command = `convert "${inputPath}" -quality ${quality} "${outputPath}"`;
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error(`Failed to convert ${inputPath} to WebP:`, error.message);
    return false;
  }
}

/**
 * Resize image to specific dimensions
 */
function resizeImage(inputPath, outputPath, width, height = null) {
  try {
    const resizeParam = height ? `${width}x${height}` : `${width}`;
    const command = `convert "${inputPath}" -resize ${resizeParam} -quality ${WEBP_QUALITY} "${outputPath}"`;
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error(`Failed to resize ${inputPath}:`, error.message);
    return false;
  }
}

/**
 * Get file size in KB
 */
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

/**
 * Optimize a single image
 */
function optimizeImage(imagePath) {
  const fileName = path.basename(imagePath, path.extname(imagePath));
  const ext = path.extname(imagePath).toLowerCase();
  
  // Skip if already WebP
  if (ext === '.webp') {
    return;
  }

  console.log(`Optimizing ${fileName}${ext}...`);

  // Convert to WebP
  const webpPath = path.join(OUTPUT_DIR, `${fileName}.webp`);
  if (convertToWebP(imagePath, webpPath)) {
    const originalSize = getFileSize(imagePath);
    const webpSize = getFileSize(webpPath);
    const savings = Math.round(((originalSize - webpSize) / originalSize) * 100);
    
    console.log(`  ✓ Converted to WebP: ${originalSize}KB → ${webpSize}KB (${savings}% smaller)`);

    // Create responsive sizes
    Object.entries(SIZES).forEach(([sizeName, width]) => {
      const responsivePath = path.join(OUTPUT_DIR, `${fileName}-${sizeName}.webp`);
      if (resizeImage(webpPath, responsivePath, width)) {
        const responsiveSize = getFileSize(responsivePath);
        console.log(`  ✓ Created ${sizeName} size: ${responsiveSize}KB`);
      }
    });
  }
}

/**
 * Main optimization function
 */
function optimizeImages() {
  if (!checkImageMagick()) {
    console.log('Skipping image optimization due to missing ImageMagick.');
    return;
  }

  console.log('Starting image optimization...\n');

  // Get all image files
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
  const files = fs.readdirSync(ASSETS_DIR);
  
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  console.log(`Found ${imageFiles.length} images to optimize:\n`);

  // Optimize each image
  imageFiles.forEach(file => {
    const imagePath = path.join(ASSETS_DIR, file);
    optimizeImage(imagePath);
    console.log('');
  });

  console.log('Image optimization complete!');
  console.log(`Optimized images saved to: ${OUTPUT_DIR}`);
}

// Run optimization if script is executed directly
if (require.main === module) {
  optimizeImages();
}

module.exports = { optimizeImages, convertToWebP, resizeImage };
