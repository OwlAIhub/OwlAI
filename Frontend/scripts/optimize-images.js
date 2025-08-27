#!/usr/bin/env node
/* global process */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkImageOptimizationTools() {
  try {
    execSync("which convert", { stdio: "ignore" });
    log("✅ ImageMagick found", "green");
    return true;
  } catch {
    log("❌ ImageMagick not found. Installing...", "yellow");
    try {
      execSync("sudo apt-get update && sudo apt-get install -y imagemagick", {
        stdio: "inherit",
      });
      log("✅ ImageMagick installed successfully", "green");
      return true;
    } catch {
      log("❌ Failed to install ImageMagick", "red");
      log(
        "💡 Please install manually: sudo apt-get install imagemagick",
        "yellow"
      );
      return false;
    }
  }
}

function optimizeImage(inputPath, outputPath, quality = 80) {
  try {
    const ext = path.extname(inputPath).toLowerCase();

    if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
      // Convert to WebP
      const webpPath = outputPath.replace(ext, ".webp");
      execSync(`convert "${inputPath}" -quality ${quality} "${webpPath}"`, {
        stdio: "ignore",
      });

      // Also create optimized version of original format
      execSync(
        `convert "${inputPath}" -strip -quality ${quality} "${outputPath}"`,
        { stdio: "ignore" }
      );

      const originalSize = fs.statSync(inputPath).size;
      const webpSize = fs.statSync(webpPath).size;
      const optimizedSize = fs.statSync(outputPath).size;

      const webpSavings = (
        ((originalSize - webpSize) / originalSize) *
        100
      ).toFixed(1);
      const optimizedSavings = (
        ((originalSize - optimizedSize) / originalSize) *
        100
      ).toFixed(1);

      log(`📸 ${path.basename(inputPath)}:`, "blue");
      log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`, "yellow");
      log(
        `   WebP: ${(webpSize / 1024).toFixed(1)}KB (${webpSavings}% smaller)`,
        "green"
      );
      log(
        `   Optimized: ${(optimizedSize / 1024).toFixed(1)}KB (${optimizedSavings}% smaller)`,
        "green"
      );

      return { webpPath, optimizedPath: outputPath };
    }
  } catch (error) {
    log(`❌ Failed to optimize ${inputPath}: ${error.message}`, "red");
  }
  return null;
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalOriginalSize = 0;
  let totalWebpSize = 0;

  log(`\n🔄 Processing directory: ${dirPath}`, "blue");

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      const originalSize = stat.size;
      totalOriginalSize += originalSize;

      const result = optimizeImage(filePath, filePath);
      if (result) {
        totalWebpSize += fs.statSync(result.webpPath).size;
      }
    }
  }

  if (totalOriginalSize > 0) {
    const totalSavings = (
      ((totalOriginalSize - totalWebpSize) / totalOriginalSize) *
      100
    ).toFixed(1);
    log(`\n📊 Total Results:`, "blue");
    log(
      `   Original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`,
      "yellow"
    );
    log(`   WebP: ${(totalWebpSize / 1024 / 1024).toFixed(2)}MB`, "green");
    log(`   Total Savings: ${totalSavings}%`, "green");
  }
}

async function main() {
  log("🚀 Starting Image Optimization...", "blue");

  if (!checkImageOptimizationTools()) {
    process.exit(1);
  }

  const assetsDir = path.join(process.cwd(), "src", "assets");

  if (!fs.existsSync(assetsDir)) {
    log("❌ Assets directory not found", "red");
    process.exit(1);
  }

  processDirectory(assetsDir);

  log("\n✅ Image optimization completed!", "green");
  log(
    "💡 Remember to update your components to use WebP images where possible",
    "yellow"
  );
}

main().catch(console.error);
