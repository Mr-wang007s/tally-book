/**
 * Border Radius Constants - iOS 18 Inspired
 * Standardized rounded corner values
 */

export const borderRadius = {
  // Small (buttons, badges)
  xs: 4,
  
  // Input fields, small cards
  sm: 8,
  
  // Standard cards, modals
  md: 12,
  
  // Large elevated surfaces
  lg: 16,
  
  // Extra large cards
  xl: 20,
  
  // Circular elements (FAB, profile pics)
  full: 9999,
} as const;

// Type-safe radius values
export type BorderRadiusKey = keyof typeof borderRadius;

export default borderRadius;
