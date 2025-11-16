/**
 * useTheme Hook - Advanced theme utilities
 * Extends basic ThemeContext with convenience methods
 */

import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '../context/ThemeContext';
import { ColorPalette } from '../theme/colors';

export interface UseThemeReturn extends ThemeContextType {
  // Convenience methods
  getColor: (colorKey: keyof ColorPalette) => string;
  getContrastText: (backgroundColor: string) => string;
}

/**
 * Hook to access theme with extended utilities
 */
export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return {
    ...context,

    /**
     * Get color from theme palette
     */
    getColor: (colorKey: keyof ColorPalette) => {
      return context.theme.colors[colorKey];
    },

    /**
     * Determine contrast color (white/black) for text on background
     * Uses relative luminance calculation for WCAG compliance
     */
    getContrastText: (backgroundColor: string): string => {
      // Parse hex color to RGB
      const hex = backgroundColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      // Calculate relative luminance (WCAG formula)
      const luminance =
        0.2126 * (r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)) +
        0.7152 * (g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)) +
        0.0722 * (b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4));

      // Return white text for dark backgrounds, black for light
      return luminance > 0.5
        ? context.theme.colors.textPrimary // Light bg → dark text
        : context.theme.colors.textOnPrimary; // Dark bg → light text
    },
  };
}
