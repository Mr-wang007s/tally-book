/**
 * Layout System - Responsive grid and layout utilities
 * Defines responsive breakpoints, grid columns, and layout constants
 * Based on iOS 18 design principles and modern responsive design
 */

import { Dimensions, Platform } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

/**
 * Responsive breakpoints
 * Used to adapt layouts for different device sizes
 */
export const breakpoints = {
  xs: 0, // Very small phones (< 320px)
  sm: 320, // Small phones (iPhone SE, 6/7/8)
  md: 375, // Medium phones (iPhone 12/13 mini)
  lg: 390, // Large phones (iPhone 14/15 Pro)
  xl: 428, // Extra large phones (iPhone 14/15 Plus)
  '2xl': 768, // iPad mini
  '3xl': 1024, // iPad
  '4xl': 1366, // iPad Pro
};

/**
 * Get current breakpoint based on screen width
 */
export function getCurrentBreakpoint(): keyof typeof breakpoints {
  if (screenWidth >= breakpoints['4xl']) return '4xl';
  if (screenWidth >= breakpoints['3xl']) return '3xl';
  if (screenWidth >= breakpoints['2xl']) return '2xl';
  if (screenWidth >= breakpoints.xl) return 'xl';
  if (screenWidth >= breakpoints.lg) return 'lg';
  if (screenWidth >= breakpoints.md) return 'md';
  if (screenWidth >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * Check if current device is tablet
 */
export function isTablet(): boolean {
  return screenWidth >= breakpoints['2xl'];
}

/**
 * Check if current device is iPad
 */
export function isIPad(): boolean {
  return Platform.OS === 'ios' && screenWidth >= breakpoints['2xl'];
}

/**
 * Grid system - CSS Grid-like columns for different breakpoints
 */
export const gridColumns = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 3,
  '2xl': 4,
  '3xl': 4,
  '4xl': 6,
};

/**
 * Get grid columns for current breakpoint
 */
export function getGridColumns(): number {
  const breakpoint = getCurrentBreakpoint();
  return gridColumns[breakpoint];
}

/**
 * Grid gap sizes (padding between grid items)
 */
export const gridGaps = {
  compact: 8,
  normal: 12,
  comfortable: 16,
  spacious: 20,
};

/**
 * Get optimal grid gap for current screen size
 */
export function getOptimalGridGap(): number {
  const width = screenWidth;
  if (width < breakpoints.sm) return gridGaps.compact;
  if (width < breakpoints.lg) return gridGaps.normal;
  if (width < breakpoints['2xl']) return gridGaps.comfortable;
  return gridGaps.spacious;
}

/**
 * Container widths - max-width for content containers
 */
export const containerWidths = {
  narrow: 280, // Small phones
  normal: 320, // Default phone
  wide: 380, // Large phones
  tablet: 600, // Tablets
  desktop: 1200, // Desktop
};

/**
 * Get optimal container width for current device
 */
export function getOptimalContainerWidth(): number {
  if (isTablet()) return containerWidths.tablet;
  if (screenWidth >= breakpoints.xl) return containerWidths.wide;
  if (screenWidth >= breakpoints.md) return containerWidths.normal;
  return containerWidths.narrow;
}

/**
 * Safe area padding (accounts for notches, home indicators)
 */
export const safeAreaPadding = {
  horizontal: 16,
  vertical: 8,
  large: 24,
};

/**
 * Screen dimensions
 */
export const screenDimensions = {
  width: screenWidth,
  height: screenHeight,
  isPortrait: screenHeight > screenWidth,
  isLandscape: screenWidth > screenHeight,
};

/**
 * Calculate responsive size based on screen width
 * Useful for fonts, paddings, etc.
 */
export function responsiveSize(baseSize: number, maxSize?: number): number {
  const ratio = screenWidth / 375; // Base size for iPhone 12
  const size = baseSize * ratio;

  if (maxSize && size > maxSize) {
    return maxSize;
  }

  return Math.round(size);
}

/**
 * Responsive padding/margin generator
 */
export function getResponsivePadding(
  small: number,
  medium: number,
  large: number
): number {
  const breakpoint = getCurrentBreakpoint();
  
  if (breakpoint === 'xs' || breakpoint === 'sm') return small;
  if (breakpoint === 'md' || breakpoint === 'lg') return medium;
  return large;
}

/**
 * Column width calculator for grid
 */
export function getColumnWidth(gapSize: number = gridGaps.normal): number {
  const columns = getGridColumns();
  const totalGaps = (columns - 1) * gapSize;
  const availableWidth =
    screenWidth - safeAreaPadding.horizontal * 2 - totalGaps;
  return availableWidth / columns;
}

/**
 * Common layout breakpoints for conditions
 */
export const layoutBreakpoints = {
  isSmallPhone: screenWidth < 375,
  isMediumPhone: screenWidth >= 375 && screenWidth < 390,
  isLargePhone: screenWidth >= 390 && screenWidth < 428,
  isExtraLargePhone: screenWidth >= 428 && screenWidth < 768,
  isTablet: screenWidth >= 768,
};

/**
 * Responsive orientation utilities
 */
export function getOrientationStyles() {
  return {
    isPortrait: screenDimensions.isPortrait,
    isLandscape: screenDimensions.isLandscape,
    portraitWidth: Math.min(screenWidth, screenHeight),
    portraitHeight: Math.max(screenWidth, screenHeight),
    landscapeWidth: Math.max(screenWidth, screenHeight),
    landscapeHeight: Math.min(screenWidth, screenHeight),
  };
}

/**
 * Safe area calculator (for notches, home indicators, etc)
 */
export function getSafeAreaMargins() {
  return {
    top: safeAreaPadding.vertical,
    right: safeAreaPadding.horizontal,
    bottom: safeAreaPadding.vertical,
    left: safeAreaPadding.horizontal,
  };
}

/**
 * Layout constants for dashboard grid
 */
export const dashboardLayout = {
  // Column configurations
  gridColumns: getGridColumns(),
  gridGap: getOptimalGridGap(),
  
  // Content widths
  maxWidth: getOptimalContainerWidth(),
  containerPadding: safeAreaPadding.horizontal,
  
  // Card sizing
  cardMinHeight: 100,
  cardMaxHeight: 300,
  
  // Spacing
  sectionGap: 24,
  itemGap: 12,
  
  // Safe area
  safeAreaTop: 0, // Will be set by app
  safeAreaBottom: 0, // Will be set by app
  
  // Header
  headerHeight: 60,
  tabBarHeight: 60,
};
