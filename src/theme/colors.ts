/**
 * Color System - iOS 18 Inspired
 * Supports light and dark modes with true black optimization
 */

export interface ColorPalette {
  // Primary Colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Semantic Colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;

  // Borders & Dividers
  border: string;
  divider: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textOnPrimary: string;

  // Overlays
  overlay: string;
  scrim: string;
}

export const lightColors: ColorPalette = {
  // Primary - iOS Blue
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',

  // Semantic
  success: '#34C759', // iOS Green
  warning: '#FF9500', // iOS Orange
  error: '#FF3B30', // iOS Red
  info: '#5AC8FA', // iOS Light Blue

  // Backgrounds
  background: '#F2F2F7', // System Background
  backgroundSecondary: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Borders & Dividers
  border: '#C6C6C8',
  divider: '#E5E5EA',

  // Text
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textOnPrimary: '#FFFFFF',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.1)',
  scrim: 'rgba(0, 0, 0, 0.4)',
};

export const darkColors: ColorPalette = {
  // Primary - Lighter iOS Blue for dark mode
  primary: '#0A84FF',
  primaryLight: '#64D2FF',
  primaryDark: '#0077ED',

  // Semantic
  success: '#32D74B', // Lighter iOS Green
  warning: '#FF9F0A', // Lighter iOS Orange
  error: '#FF453A', // Lighter iOS Red
  info: '#64D2FF', // Lighter iOS Blue

  // Backgrounds - True Black for OLED
  background: '#000000', // True black
  backgroundSecondary: '#1C1C1E',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',

  // Borders & Dividers
  border: '#38383A',
  divider: '#2C2C2E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#48484A',
  textOnPrimary: '#FFFFFF',

  // Overlays
  overlay: 'rgba(255, 255, 255, 0.1)',
  scrim: 'rgba(0, 0, 0, 0.6)',
};

/**
 * Get color palette for current theme mode
 */
export function getColors(mode: 'light' | 'dark'): ColorPalette {
  return mode === 'dark' ? darkColors : lightColors;
}
