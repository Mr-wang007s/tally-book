/**
 * Elevation System - 5 Levels of Depth
 * Consistent shadow definitions for visual hierarchy
 */

import { ViewStyle } from 'react-native';

export interface ElevationStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android elevation
}

/**
 * Elevation levels (0-5)
 */
export const elevation = {
  /**
   * Level 0: Flat surface, no elevation
   * Usage: Background, flat surfaces
   */
  0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  /**
   * Level 1: Subtle lift
   * Usage: Subtle list items, inline cards
   */
  1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  /**
   * Level 2: Standard cards
   * Usage: Summary cards, standard UI components
   */
  2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  /**
   * Level 3: Modals and sheets
   * Usage: Bottom sheets, modal dialogs
   */
  3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },

  /**
   * Level 4: Overlays
   * Usage: Alerts, overlays
   */
  4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },

  /**
   * Level 5: Popovers
   * Usage: Tooltips, popovers, floating menus
   */
  5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 48,
    elevation: 16,
  },
} as const;

/**
 * Get elevation style for a specific level
 */
export function getElevation(level: 0 | 1 | 2 | 3 | 4 | 5): ElevationStyle {
  return elevation[level];
}

/**
 * Apply elevation to a component style
 */
export function withElevation(
  level: 0 | 1 | 2 | 3 | 4 | 5,
  baseStyle?: ViewStyle
): ViewStyle {
  return {
    ...baseStyle,
    ...elevation[level],
  };
}
