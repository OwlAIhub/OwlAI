#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get all TypeScript/TSX files in a directory
function getTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getTsxFiles(fullPath));
    } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to find duplicate components
function findDuplicates() {
  const componentsDir = path.join(__dirname, "../src/components");
  const ComponentsDir = path.join(__dirname, "../src/Components");

  const componentsFiles = getTsxFiles(componentsDir);
  const ComponentsFiles = getTsxFiles(ComponentsDir);

  const duplicates = [];

  for (const compFile of componentsFiles) {
    const fileName = path.basename(compFile);
    const matchingFile = ComponentsFiles.find(
      file => path.basename(file) === fileName
    );

    if (matchingFile) {
      duplicates.push({
        components: compFile,
        Components: matchingFile,
        name: fileName,
      });
    }
  }

  return duplicates;
}

// Main execution
const duplicates = findDuplicates();

console.log("🔍 Found duplicate components:");
console.log("==============================\n");

if (duplicates.length === 0) {
  console.log("✅ No duplicates found!");
} else {
  duplicates.forEach((dup, index) => {
    console.log(`${index + 1}. ${dup.name}`);
    console.log(`   📁 components: ${dup.components}`);
    console.log(`   📁 Components: ${dup.Components}`);
    console.log("");
  });

  console.log("📋 Recommendations:");
  console.log(
    '1. Keep components in the lowercase "components" directory (follows React conventions)'
  );
  console.log('2. Move unique components from "Components" to "components"');
  console.log("3. Update all import statements to use consistent paths");
  console.log(
    '4. Remove the capitalized "Components" directory after migration'
  );
}

console.log("\n🎯 Next steps:");
console.log("1. Run: npm run lint to check for import inconsistencies");
console.log("2. Update import statements to use consistent paths");
console.log("3. Test the application thoroughly after changes");
