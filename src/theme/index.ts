/**
 * Design System & Theme Exports
 * 
 * Central export point for all design tokens, colors, and theme-related utilities
 * Enables clean imports: import { colors, spacing, typography } from '@/theme'
 */

// Core Tokens
export { colors, colorSchemes, radius, shadows, spacing, typography } from './tokens';

// Colors
export { lightColors, darkColors, getColors, type ColorPalette, gradients } from './colors';

// Layout & Responsive
export * from './layout';
export * from './breakpoints';

// Effects & Visual
export * from './effects';

// Animations & Easings
export { animationPresets, animationTimings } from './animations';
export { easing } from './easings';

// Elevation/Shadows
export { elevation } from './elevation';

// Radius
export { radius as borderRadius } from './radius';

// Spacing
export { spacing } from './spacing';

// Typography
export { typography } from './typography';

/**
 * Theme Configuration Object
 * Use this for accessing all design system values
 */
export const designSystem = {
  name: 'Ledger Analytics iOS 18 Design System',
  version: '1.0.0',
} as const;
