#!/usr/bin/env node
/* global process */

import { execSync } from "child_process";

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPort(port) {
  try {
    execSync(`lsof -i :${port}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

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

async function runLighthouseTest() {
  const args = process.argv.slice(2);
  const testType = args[0] || "dev";

  log("🚀 Starting Lighthouse Test...", "cyan");

  try {
    switch (testType) {
      case "dev":
        if (!checkPort(3000)) {
          log("❌ Dev server not running on port 3000", "red");
          log("💡 Please start the dev server first: npm run dev", "yellow");
          process.exit(1);
        }

        log("📊 Running Lighthouse test on dev server...", "blue");
        execSync(
          "npx lighthouse http://localhost:3000 --config-path=./lighthouse.config.js --output=html --output-path=./lighthouse-report.html --chrome-flags='--headless --no-sandbox --disable-gpu --disable-dev-shm-usage'",
          { stdio: "inherit" }
        );
        break;

      case "build":
        log("🔨 Building project...", "blue");
        execSync("npm run build", { stdio: "inherit" });

        log("🚀 Starting preview server...", "blue");
        execSync("npm run preview &", { stdio: "inherit" });

        log("⏳ Waiting for server to be ready...", "yellow");
        await waitForServer("http://localhost:4173");

        log("📊 Running Lighthouse test on build...", "blue");
        execSync(
          "npx lighthouse http://localhost:4173 --config-path=./lighthouse.config.js --output=html --output-path=./lighthouse-report.html",
          { stdio: "inherit" }
        );

        log("🛑 Stopping preview server...", "blue");
        execSync('pkill -f "vite preview"', { stdio: "ignore" });
        break;

      case "mobile":
        if (!checkPort(3000)) {
          log("❌ Dev server not running on port 3000", "red");
          log("💡 Please start the dev server first: npm run dev", "yellow");
          process.exit(1);
        }

        log("📱 Running Lighthouse test for mobile...", "blue");
        execSync(
          'npx lighthouse http://localhost:3000 --config-path=./lighthouse-mobile.config.js --output=html --output-path=./lighthouse-mobile-report.html --chrome-flags="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage"',
          { stdio: "inherit" }
        );
        break;

      default:
        log("❌ Invalid test type. Use: dev, build, or mobile", "red");
        process.exit(1);
    }

    log("✅ Lighthouse test completed successfully!", "green");
    log("📄 Check the generated HTML report in your project directory", "cyan");
  } catch (error) {
    log(`❌ Lighthouse test failed: ${error.message}`, "red");
    process.exit(1);
  }
}

runLighthouseTest();
