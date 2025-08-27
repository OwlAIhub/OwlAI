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

function installChromeIfNeeded() {
  try {
    // Check if Chrome is installed
    execSync("google-chrome --version", { stdio: "ignore" });
    log("✅ Chrome is already installed", "green");
  } catch {
    log("📦 Installing Chrome for WSL2...", "yellow");
    try {
      execSync(
        "wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -",
        { stdio: "inherit" }
      );
      execSync(
        'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list',
        { stdio: "inherit" }
      );
      execSync("sudo apt-get update", { stdio: "inherit" });
      execSync("sudo apt-get install -y google-chrome-stable", {
        stdio: "inherit",
      });
      log("✅ Chrome installed successfully", "green");
    } catch {
      log("❌ Failed to install Chrome automatically", "red");
      log("💡 Please install Chrome manually or use Chromium:", "yellow");
      log("   sudo apt-get install chromium-browser", "cyan");
      return false;
    }
  }
  return true;
}

async function runLighthouseTest() {
  const args = process.argv.slice(2);
  const testType = args[0] || "dev";

  log("🚀 Starting Lighthouse Test for WSL2...", "cyan");

  try {
    // Check if server is running
    if (!checkPort(3000)) {
      log("❌ Dev server not running on port 3000", "red");
      log("💡 Please start the dev server first: npm run dev", "yellow");
      process.exit(1);
    }

    // Try to install Chrome if needed
    if (!installChromeIfNeeded()) {
      log("⚠️  Continuing with system Chrome...", "yellow");
    }

    const chromeFlags =
      "--headless --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-web-security --disable-features=VizDisplayCompositor";

    switch (testType) {
      case "dev":
        log("📊 Running Lighthouse test on dev server...", "blue");
        execSync(
          `npx lighthouse http://localhost:3000 --config-path=./lighthouse.config.js --output=html --output-path=./lighthouse-report.html --chrome-flags="${chromeFlags}"`,
          { stdio: "inherit" }
        );
        break;

      case "mobile":
        log("📱 Running Lighthouse test for mobile...", "blue");
        execSync(
          `npx lighthouse http://localhost:3000 --config-path=./lighthouse-mobile.config.js --output=html --output-path=./lighthouse-mobile-report.html --chrome-flags="${chromeFlags}"`,
          { stdio: "inherit" }
        );
        break;

      default:
        log("❌ Invalid test type. Use: dev or mobile", "red");
        process.exit(1);
    }

    log("✅ Lighthouse test completed successfully!", "green");
    log("📄 Check the generated HTML report in your project directory", "cyan");
  } catch (error) {
    log(`❌ Lighthouse test failed: ${error.message}`, "red");
    log("💡 Try these troubleshooting steps:", "yellow");
    log(
      "   1. Install Chrome: sudo apt-get install google-chrome-stable",
      "cyan"
    );
    log("   2. Or use Chromium: sudo apt-get install chromium-browser", "cyan");
    log("   3. Make sure your dev server is running on port 3000", "cyan");
    process.exit(1);
  }
}

runLighthouseTest();
