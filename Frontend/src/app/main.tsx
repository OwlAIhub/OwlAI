import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Get the root element with type assertion
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure there is a div with id="root" in your HTML.'
  );
}

// Create root and render the app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
