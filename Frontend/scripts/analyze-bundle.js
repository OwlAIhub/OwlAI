#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get file size in KB/MB
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Function to analyze dist folder
function analyzeBundle() {
  const distPath = path.join(__dirname, "../dist");

  if (!fs.existsSync(distPath)) {
    console.log('❌ Dist folder not found. Run "npm run build" first.');
    return;
  }

  const assetsPath = path.join(distPath, "assets");
  const files = fs.readdirSync(assetsPath);

  console.log("📊 Bundle Analysis");
  console.log("==================\n");

  let totalSize = 0;
  const fileSizes = [];

  files.forEach(file => {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    totalSize += size;

    fileSizes.push({
      name: file,
      size: size,
      formattedSize: formatFileSize(size),
    });
  });

  // Sort by size (largest first)
  fileSizes.sort((a, b) => b.size - a.size);

  console.log("📁 Asset Files:");
  fileSizes.forEach(file => {
    const icon = file.size > 500 * 1024 ? "⚠️" : "✅";
    console.log(`${icon} ${file.name}: ${file.formattedSize}`);
  });

  console.log(`\n📈 Total Bundle Size: ${formatFileSize(totalSize)}`);

  // Recommendations
  console.log("\n💡 Optimization Recommendations:");

  const largeFiles = fileSizes.filter(f => f.size > 500 * 1024);
  if (largeFiles.length > 0) {
    console.log("⚠️  Large files detected:");
    largeFiles.forEach(file => {
      console.log(`   - ${file.name} (${file.formattedSize})`);
    });
    console.log("\n   Consider:");
    console.log("   - Code splitting with dynamic imports");
    console.log("   - Lazy loading for routes");
    console.log("   - Optimizing images and assets");
    console.log("   - Tree shaking unused dependencies");
  }

  // Check for image optimization
  const imageFiles = fileSizes.filter(f =>
    f.name.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/i)
  );

  if (imageFiles.length > 0) {
    console.log("\n🖼️  Image files:");
    imageFiles.forEach(file => {
      const icon = file.size > 100 * 1024 ? "⚠️" : "✅";
      console.log(`${icon} ${file.name}: ${file.formattedSize}`);
    });

    const largeImages = imageFiles.filter(f => f.size > 100 * 1024);
    if (largeImages.length > 0) {
      console.log("\n   Consider optimizing large images:");
      console.log("   - Convert to WebP format");
      console.log("   - Use responsive images");
      console.log("   - Implement lazy loading");
    }
  }
}

// Run analysis
analyzeBundle();
