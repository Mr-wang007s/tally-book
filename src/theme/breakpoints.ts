/**
 * Responsive Breakpoints - iOS 18 Design System
 * 
 * Defines breakpoints for different screen sizes and device types
 * Based on common iOS device dimensions and responsive design principles
 * 
 * Breakpoints:
 * - xs: Small phones (iPhone SE, iPhone 12 mini, etc.) - 320px+
 * - sm: Regular phones (iPhone 12, iPhone 13, etc.) - 375px+
 * - md: Large phones (iPhone 14 Pro Max, etc.) - 430px+
 * - lg: iPad Mini/Air - 768px+
 * - xl: iPad Pro - 1024px+
 */

/**
 * Screen size constants (in points, matching React Native measurement)
 */
export const screenSizes = {
  // iPhone SE, iPhone 11 (first gen)
  xs: 320,
  
  // iPhone 12, iPhone 13, standard width
  sm: 375,
  
  // iPhone 14 Pro Max, large phones
  md: 430,
  
  // iPad Mini, iPad Air portrait
  lg: 768,
  
  // iPad Pro, large tablets
  xl: 1024,
  
  // iPad Pro Max, landscape
  xxl: 1366,
} as const;

/**
 * Breakpoint query helpers
 * Use in components with useWindowDimensions() to determine layout
 */
export const breakpoints = {
  isExtraSmall: (width: number) => width < screenSizes.sm,
  isSmall: (width: number) => width >= screenSizes.sm && width < screenSizes.md,
  isMedium: (width: number) => width >= screenSizes.md && width < screenSizes.lg,
  isLarge: (width: number) => width >= screenSizes.lg && width < screenSizes.xl,
  isExtraLarge: (width: number) => width >= screenSizes.xl,
  isTablet: (width: number) => width >= screenSizes.lg,
  isPhone: (width: number) => width < screenSizes.lg,
} as const;

/**
 * Responsive column counts for grid layouts
 * Based on Apple's grid system guidelines
 */
export const gridColumns = {
  xs: 1,    // Single column on small phones
  sm: 2,    // Two columns on regular phones
  md: 2,    // Two columns on large phones
  lg: 3,    // Three columns on tablet
  xl: 4,    // Four columns on iPad Pro
} as const;

/**
 * Container max-widths for centered content
 * Prevents content from being too wide on large screens
 */
export const containerMaxWidths = {
  xs: 320,
  sm: 360,
  md: 428,
  lg: 720,
  xl: 1000,
  xxl: 1366,
} as const;

/**
 * Padding adjustments per breakpoint
 * Ensures consistent margins on different screen sizes
 */
export const containerPadding = {
  xs: 12,  // Tight on small screens
  sm: 16,  // Standard padding
  md: 20,  // Extra space on large phones
  lg: 24,  // Spacious on tablets
  xl: 32,  // Maximum padding on large devices
} as const;

/**
 * Common layout patterns
 */
export const layoutPatterns = {
  // Single column with optional sidebar
  singleColumn: {
    xs: 'full',      // Full width
    sm: 'full',      // Full width
    md: 'full',      // Full width
    lg: 'with-sidebar', // Add sidebar
    xl: 'with-sidebar', // Add sidebar
  },
  
  // Grid with responsive columns
  grid: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  },
  
  // Card layouts
  cards: {
    xs: 'stacked',   // Stack vertically
    sm: 'stacked',   // Stack vertically
    md: 'row-2',     // Two per row
    lg: 'row-3',     // Three per row
    xl: 'row-4',     // Four per row
  },
} as const;

/**
 * Device type detection
 * Use with Platform.select and dimensions to determine device
 */
export const deviceTypes = {
  PHONE_SMALL: 'phone-small',
  PHONE_LARGE: 'phone-large',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
} as const;

/**
 * Get device type based on width
 */
export function getDeviceType(width: number): typeof deviceTypes[keyof typeof deviceTypes] {
  if (width < screenSizes.lg) {
    return width < screenSizes.md ? deviceTypes.PHONE_SMALL : deviceTypes.PHONE_LARGE;
  }
  if (width < screenSizes.xl) {
    return deviceTypes.TABLET;
  }
  return deviceTypes.DESKTOP;
}

/**
 * Get grid columns for device width
 */
export function getGridColumns(width: number): number {
  if (width < screenSizes.sm) return gridColumns.xs;
  if (width < screenSizes.md) return gridColumns.sm;
  if (width < screenSizes.lg) return gridColumns.md;
  if (width < screenSizes.xl) return gridColumns.lg;
  return gridColumns.xl;
}

/**
 * Get container padding for device width
 */
export function getContainerPadding(width: number): number {
  if (width < screenSizes.sm) return containerPadding.xs;
  if (width < screenSizes.md) return containerPadding.sm;
  if (width < screenSizes.lg) return containerPadding.md;
  if (width < screenSizes.xl) return containerPadding.lg;
  return containerPadding.xl;
}

export default {
  screenSizes,
  breakpoints,
  gridColumns,
  containerMaxWidths,
  containerPadding,
  layoutPatterns,
  deviceTypes,
  getDeviceType,
  getGridColumns,
  getContainerPadding,
};
