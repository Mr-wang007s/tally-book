/**
 * useResponsive Hook - Responsive design utilities
 * Provides reactive access to breakpoints and screen dimensions
 */

import { useState, useEffect, useCallback } from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import {
  breakpoints,
  gridColumns,
  getGridColumns,
  isTablet,
  isIPad,
  getOptimalGridGap,
  getOptimalContainerWidth,
  responsiveSize,
  layoutBreakpoints,
  getOrientationStyles,
} from '../theme/layout';

export type BreakpointKey = keyof typeof breakpoints;

export interface ResponsiveValues {
  screenWidth: number;
  screenHeight: number;
  breakpoint: BreakpointKey;
  gridColumns: number;
  gridGap: number;
  containerWidth: number;
  isTablet: boolean;
  isIPad: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isSmallPhone: boolean;
  isMediumPhone: boolean;
  isLargePhone: boolean;
  isExtraLargePhone: boolean;
}

/**
 * Hook for responsive design utilities
 * Updates on device orientation change
 */
export function useResponsive(): ResponsiveValues {
  const dimensions = useWindowDimensions();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const handleChange = ({ window }: { window: any }) => {
      const isPortrait = window.height > window.width;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
    };

    const subscription = Dimensions.addEventListener('change', handleChange);
    return () => subscription?.remove();
  }, []);

  // Determine breakpoint
  let breakpoint: BreakpointKey = 'xs';
  if (dimensions.width >= breakpoints['4xl']) breakpoint = '4xl';
  else if (dimensions.width >= breakpoints['3xl']) breakpoint = '3xl';
  else if (dimensions.width >= breakpoints['2xl']) breakpoint = '2xl';
  else if (dimensions.width >= breakpoints.xl) breakpoint = 'xl';
  else if (dimensions.width >= breakpoints.lg) breakpoint = 'lg';
  else if (dimensions.width >= breakpoints.md) breakpoint = 'md';
  else if (dimensions.width >= breakpoints.sm) breakpoint = 'sm';

  return {
    screenWidth: dimensions.width,
    screenHeight: dimensions.height,
    breakpoint,
    gridColumns: gridColumns[breakpoint],
    gridGap: getOptimalGridGap(),
    containerWidth: getOptimalContainerWidth(),
    isTablet: dimensions.width >= breakpoints['2xl'],
    isIPad: dimensions.width >= breakpoints['2xl'],
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    isSmallPhone: dimensions.width < 375,
    isMediumPhone: dimensions.width >= 375 && dimensions.width < 390,
    isLargePhone: dimensions.width >= 390 && dimensions.width < 428,
    isExtraLargePhone: dimensions.width >= 428 && dimensions.width < 768,
  };
}

/**
 * Hook to check if screen matches certain breakpoints
 */
export function useBreakpoint(
  breakpointKey: BreakpointKey
): { isAtLeast: boolean; isBelow: boolean } {
  const { breakpoint } = useResponsive();

  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const;
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  const targetIndex = breakpointOrder.indexOf(breakpointKey);

  return {
    isAtLeast: currentIndex >= targetIndex,
    isBelow: currentIndex < targetIndex,
  };
}

/**
 * Hook for responsive font size
 */
export function useResponsiveFontSize(
  baseSize: number,
  maxSize?: number,
  minSize?: number
): number {
  const { screenWidth } = useResponsive();
  const size = responsiveSize(baseSize, maxSize);

  if (minSize && size < minSize) {
    return minSize;
  }

  return size;
}

/**
 * Hook for responsive spacing
 */
export function useResponsiveSpacing(
  small: number,
  medium: number,
  large: number
): number {
  const { breakpoint } = useResponsive();

  if (breakpoint === 'xs' || breakpoint === 'sm') return small;
  if (breakpoint === 'md' || breakpoint === 'lg') return medium;
  return large;
}

/**
 * Hook for conditional rendering based on breakpoint
 */
export function useShowAtBreakpoint(
  breakpointKey: BreakpointKey,
  show: 'atLeast' | 'below' = 'atLeast'
): boolean {
  const breakpoint = useBreakpoint(breakpointKey);

  if (show === 'atLeast') {
    return breakpoint.isAtLeast;
  }
  return breakpoint.isBelow;
}

/**
 * Hook for getting optimal layout for current device
 */
export function useOptimalLayout() {
  const { screenWidth, breakpoint, isTablet: isTabletDevice } = useResponsive();

  const columns = gridColumns[breakpoint];
  const gap = getOptimalGridGap();
  const containerWidth = getOptimalContainerWidth();

  return {
    columns,
    gap,
    containerWidth,
    isTablet: isTabletDevice,
    breakpoint,
  };
}

/**
 * Hook to detect orientation changes
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const handleChange = ({ window }: { window: any }) => {
      const isPortrait = window.height > window.width;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
    };

    const subscription = Dimensions.addEventListener('change', handleChange);
    return () => subscription?.remove();
  }, []);

  return orientation;
}

/**
 * Hook to trigger callbacks on breakpoint changes
 */
export function useBreakpointChange(
  callback: (breakpoint: BreakpointKey) => void
): void {
  const { breakpoint } = useResponsive();

  useEffect(() => {
    callback(breakpoint);
  }, [breakpoint, callback]);
}

/**
 * Hook to get responsive conditional value
 */
export function useResponsiveValue<T>(
  values: Partial<Record<BreakpointKey, T>>,
  defaultValue: T
): T {
  const { breakpoint } = useResponsive();

  return values[breakpoint] ?? defaultValue;
}
