/**
 * Design Tokens - Central Export
 * 
 * Single entry point for all design tokens throughout the application.
 * Provides colors, typography, spacing, elevation, and animations.
 * 
 * @module src/tokens
 */

// Export all color utilities and palettes
export * from './colors';
export { colors, lightColors, darkColors, getColors, withOpacity } from './colors';
export type { ColorMode, ColorToken } from './colors';

// Export all typography tokens
export * from './typography';
export { typography, fontWeights, typographyVariants, getTypography, getVariant } from './typography';
export type { TypographyKey, TypographyVariantKey } from './typography';

// Export all spacing tokens
export * from './spacing';
export { spacing, screenPadding, componentSpacing, touchTargets, borderRadius, createPadding, createMargin, getSpacing } from './spacing';
export type { SpacingKey } from './spacing';

// Export all elevation tokens
export * from './elevation';
export { elevations, elevation0, elevation1, elevation2, elevation3, elevation4, elevation5, componentElevations, getElevation, combineWithElevation } from './elevation';
export type { ElevationLevel } from './elevation';

// Export all animation tokens
export * from './animations';
export { springs, durations, easings, componentAnimations, gestureAnimations, getSpring, getDuration } from './animations';
export type { SpringKey, DurationKey } from './animations';

/**
 * Default theme object
 * Combines all tokens for easy access
 */
export const theme = {
  colors,
  typography,
  spacing,
  elevations,
  springs,
  durations,
} as const;

/**
 * Type for the complete theme
 */
export type Theme = typeof theme;
