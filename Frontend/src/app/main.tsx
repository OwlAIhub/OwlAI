import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

// Import global styles and main app component
import "./index.css";
import App from "./App";

// Import performance utilities
import { initializePerformanceOptimizations } from "../utils/performance";

/**
 * Application entry point
 * This file initializes the React application and renders it to the DOM
 */

/**
 * Register service worker for PWA capabilities
 */
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log("SW registered: ", registration);
    } catch (registrationError) {
      console.log("SW registration failed: ", registrationError);
    }
  }
};

/**
 * Get the root DOM element where the React app will be mounted
 * Throws an error if the element is not found
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure there is a div with id="root" in your HTML.'
  );
}

/**
 * Initialize performance optimizations
 */
initializePerformanceOptimizations();

/**
 * Register service worker
 */
registerServiceWorker();

/**
 * Create React root and render the application
 * Wraps the app with necessary providers for:
 * - StrictMode: Development mode checks and warnings
 * - HelmetProvider: SEO and document head management
 */
createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
