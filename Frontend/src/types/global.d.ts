/* Temporary React JSX and library type harmonization */

// Relax JSX intrinsic element typing to unblock builds when React type versions mismatch
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Framer Motion compatibility shim to avoid JSX component type errors
declare module "framer-motion" {
  import type * as React from "react";
  export const AnimatePresence: React.ComponentType<React.PropsWithChildren<unknown>>;
  export const motion: any;
}


