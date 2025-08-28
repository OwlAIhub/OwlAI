#!/usr/bin/env node

import { execSync } from "child_process";
import process from "process";

// Color codes for console output styling
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

/**
 * Logs a message with optional color styling
 * @param {string} message - The message to display
 * @param {string} color - Color key from colors object
 */
function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Checks if a port is in use by attempting to find processes using it
 * @param {number} port - Port number to check
 * @returns {boolean} - True if port is in use, false otherwise
 */
function checkPort(port) {
  try {
    execSync(`lsof -i :${port}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Waits for a server to be ready by polling the URL until it responds
 * @param {string} url - URL to check
 * @param {number} maxAttempts - Maximum number of attempts (default: 30)
 * @returns {Promise} - Resolves when server is ready, rejects after max attempts
 */
function waitForServer(url, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      try {
        execSync(`curl -s -o /dev/null -w "%{http_code}" ${url}`, {
          stdio: "ignore",
        });
        clearInterval(interval);
        resolve();
      } catch {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error(`Server not ready after ${maxAttempts} attempts`));
        }
      }
    }, 1000);
  });
}

/**
 * Runs Lighthouse performance tests based on the specified test type
 * Supports three modes: dev (development server), build (production build), mobile (mobile testing)
 */
async function runLighthouseTest() {
  const args = process.argv.slice(2);
  const testType = args[0] || "dev";

  log("🚀 Starting Lighthouse Performance Test...", "cyan");

  try {
    switch (testType) {
      case "dev":
        // Test development server on port 3000
        if (!checkPort(3000)) {
          log("❌ Development server not running on port 3000", "red");
          log("💡 Please start the dev server first: pnpm run dev", "yellow");
          process.exit(1);
        }

        log("📊 Running Lighthouse test on development server...", "blue");
        execSync(
          "npx lighthouse http://localhost:3000 --config-path=./lighthouse.config.js --output=html --output-path=./lighthouse-report.html --chrome-flags='--headless --no-sandbox --disable-gpu --disable-dev-shm-usage'",
          { stdio: "inherit" }
        );
        break;

      case "build":
        // Test production build by building and previewing
        log("🔨 Building project for production...", "blue");
        execSync("pnpm run build", { stdio: "inherit" });

        log("🚀 Starting preview server...", "blue");
        execSync("pnpm run preview &", { stdio: "inherit" });

        log("⏳ Waiting for preview server to be ready...", "yellow");
        await waitForServer("http://localhost:4173");

        log("📊 Running Lighthouse test on production build...", "blue");
        execSync(
          "npx lighthouse http://localhost:4173 --config-path=./lighthouse.config.js --output=html --output-path=./lighthouse-report.html",
          { stdio: "inherit" }
        );

        log("🛑 Stopping preview server...", "blue");
        execSync('pkill -f "vite preview"', { stdio: "ignore" });
        break;

      case "mobile":
        // Test mobile performance on development server
        if (!checkPort(3000)) {
          log("❌ Development server not running on port 3000", "red");
          log("💡 Please start the dev server first: pnpm run dev", "yellow");
          process.exit(1);
        }

        log("📱 Running Lighthouse test for mobile performance...", "blue");
        execSync(
          'npx lighthouse http://localhost:3000 --config-path=./lighthouse-mobile.config.js --output=html --output-path=./lighthouse-mobile-report.html --chrome-flags="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage"',
          { stdio: "inherit" }
        );
        break;

      default:
        log("❌ Invalid test type. Use: dev, build, or mobile", "red");
        process.exit(1);
    }

    log("✅ Lighthouse performance test completed successfully!", "green");
    log("📄 Check the generated HTML report in your project directory", "cyan");
  } catch (error) {
    log(`❌ Lighthouse test failed: ${error.message}`, "red");
    process.exit(1);
  }
}

// Execute the lighthouse test
runLighthouseTest();
