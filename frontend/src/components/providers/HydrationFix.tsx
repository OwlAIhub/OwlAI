"use client";

import { useEffect } from "react";

/**
 * Component to fix hydration issues caused by browser extensions
 * that add attributes like bis_skin_checked to DOM elements
 */
export function HydrationFix() {
  useEffect(() => {
    // Remove browser extension attributes that cause hydration mismatches
    const removeExtensionAttributes = () => {
      const extensionAttrs = [
        "bis_skin_checked",
        "data-new-gr-c-s-check-loaded",
        "data-gr-ext-installed",
        "data-gramm_editor",
        "data-gramm",
        "spellcheck",
        "data-lexical-editor",
      ];

      extensionAttrs.forEach((attr) => {
        const elements = document.querySelectorAll(`[${attr}]`);
        elements.forEach((element) => {
          element.removeAttribute(attr);
        });
      });
    };

    // Run immediately
    removeExtensionAttributes();

    // Set up mutation observer to catch new attributes added by extensions
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const target = mutation.target as Element;
          if (target.nodeType === Node.ELEMENT_NODE) {
            const extensionAttrs = [
              "bis_skin_checked",
              "data-new-gr-c-s-check-loaded",
              "data-gr-ext-installed",
              "data-gramm_editor",
              "data-gramm",
              "spellcheck",
              "data-lexical-editor",
            ];

            extensionAttrs.forEach((attr) => {
              if (target.hasAttribute(attr)) {
                target.removeAttribute(attr);
              }
            });
          }
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: [
        "bis_skin_checked",
        "data-new-gr-c-s-check-loaded",
        "data-gr-ext-installed",
        "data-gramm_editor",
        "data-gramm",
        "spellcheck",
        "data-lexical-editor",
      ],
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
