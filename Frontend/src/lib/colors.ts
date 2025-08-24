/**
 * OwlAI Color System
 * 
 * This file provides easy access to our brand colors using CSS variables.
 * These colors are defined in index.css and work with both light and dark modes.
 */

export const owlColors = {
  // Primary brand color (Teal)
  primary: 'hsl(var(--owl-primary))',           // #009688
  primaryDark: 'hsl(var(--owl-primary-dark))', // #00796B  
  primaryLight: 'hsl(var(--owl-primary-light))', // #4DB6AC
  
  // Accent color (Amber/Yellow)
  accent: 'hsl(var(--owl-accent))',            // #FFC107
  accentDark: 'hsl(var(--owl-accent-dark))',  // #FFA000
  
  // Dark theme backgrounds
  baseDark: 'hsl(var(--owl-base-dark))',      // #0D1B2A
  cardDark: 'hsl(var(--owl-card-dark))',      // #1B263B
  cardBorder: 'hsl(var(--owl-card-border))',  // #415A77
} as const;

/**
 * Helper function to get OwlAI color classes for Tailwind
 */
export const owlClasses = {
  // Background classes
  bg: {
    primary: 'bg-owl-primary',
    primaryDark: 'bg-owl-primary-dark', 
    primaryLight: 'bg-owl-primary-light',
    accent: 'bg-owl-accent',
    accentDark: 'bg-owl-accent-dark',
    baseDark: 'bg-owl-base-dark',
    cardDark: 'bg-owl-card-dark',
  },
  
  // Text classes
  text: {
    primary: 'text-owl-primary',
    primaryDark: 'text-owl-primary-dark',
    primaryLight: 'text-owl-primary-light', 
    accent: 'text-owl-accent',
    accentDark: 'text-owl-accent-dark',
  },
  
  // Border classes
  border: {
    primary: 'border-owl-primary',
    primaryDark: 'border-owl-primary-dark',
    cardBorder: 'border-owl-card-border',
  },
  
  // Hover classes
  hover: {
    bgPrimary: 'hover:bg-owl-primary',
    bgPrimaryDark: 'hover:bg-owl-primary-dark',
    bgAccent: 'hover:bg-owl-accent',
    bgAccentDark: 'hover:bg-owl-accent-dark',
  }
} as const;
