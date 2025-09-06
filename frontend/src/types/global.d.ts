/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace React {
    // Fix circular reference in ReactNode
    type ReactNode =
      | ReactElement
      | string
      | number
      | ReactFragment
      | ReactPortal
      | boolean
      | null
      | undefined;
  }
}

export {};
