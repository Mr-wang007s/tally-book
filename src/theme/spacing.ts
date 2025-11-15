/**
 * Spacing System - 8pt Grid
 * Consistent spacing scale for layouts and components
 */

export const spacing = {
  // Micro spacing
  xxxs: 2, // 0.125rem - Hairline separators, optical adjustments
  xxs: 4, // 0.25rem - Tight spacing, icon padding

  // Compact spacing
  xs: 8, // 0.5rem - Compact spacing, list item internal
  sm: 12, // 0.75rem - Close spacing, form field gaps

  // Default spacing
  md: 16, // 1rem - Default spacing, card padding
  lg: 24, // 1.5rem - Section spacing, screen padding

  // Generous spacing
  xl: 32, // 2rem - Screen margins, major sections
  xxl: 48, // 3rem - Hero sections, empty states
  xxxl: 64, // 4rem - Special layouts, onboarding
} as const;

/**
 * Touch target sizes (iOS HIG compliance)
 */
export const touchTargets = {
  minimum: 44, // iOS minimum touch target
  comfortable: 48, // Recommended comfortable size
  primary: 56, // Primary action buttons (e.g., FAB)
} as const;

/**
 * Safe area insets (for notched devices)
 */
export const safeArea = {
  top: 44, // Status bar height
  bottom: 34, // Home indicator area (iPhone X+)
  horizontal: 16, // Screen edge padding
} as const;

/**
 * Helper function to calculate spacing
 */
export function getSpacing(multiplier: number): number {
  return spacing.md * multiplier; // Base 16pt grid
}

/**
 * Helper to get spacing by size
 */
export function getSize(
  size: keyof typeof spacing
): number {
  return spacing[size];
}
