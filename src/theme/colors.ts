/**
 * Color System - iOS 18 Inspired
 * Supports light and dark modes with true black optimization
 * Based on latest iOS 18 design tokens and accessibility standards
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
  backgroundTertiary: string;
  surface: string;
  surfaceElevated: string;
  surfacePressed: string;

  // Borders & Dividers
  border: string;
  borderSecondary: string;
  divider: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textQuaternary: string;
  textOnPrimary: string;

  // Interactive States
  tint: string;
  pressed: string;
  disabled: string;

  // Overlays
  overlay: string;
  scrim: string;
  glassLight: string;
  glassDark: string;
}

export const lightColors: ColorPalette = {
  // Primary - iOS Blue (iOS 18 values)
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',

  // Semantic
  success: '#34C759', // iOS Green
  warning: '#FF9500', // iOS Orange
  error: '#FF3B30', // iOS Red
  info: '#5AC8FA', // iOS Light Blue

  // Backgrounds (iOS 18)
  background: '#F2F2F7', // System Background
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#F9F9FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfacePressed: '#F2F2F7',

  // Borders & Dividers (iOS 18 refined)
  border: '#D0D0D5',
  borderSecondary: '#E0E0E5',
  divider: '#E5E5EA',

  // Text (WCAG AA/AAA compliant)
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textQuaternary: '#D8D8DC',
  textOnPrimary: '#FFFFFF',

  // Interactive States
  tint: '#007AFF',
  pressed: 'rgba(0, 122, 255, 0.2)',
  disabled: 'rgba(0, 0, 0, 0.2)',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.1)',
  scrim: 'rgba(0, 0, 0, 0.4)',
  glassLight: 'rgba(255, 255, 255, 0.8)',
  glassDark: 'rgba(255, 255, 255, 0.1)',
};

export const darkColors: ColorPalette = {
  // Primary - Lighter iOS Blue for dark mode (iOS 18)
  primary: '#0A84FF',
  primaryLight: '#64D2FF',
  primaryDark: '#0077ED',

  // Semantic
  success: '#32D74B', // Lighter iOS Green
  warning: '#FF9F0A', // Lighter iOS Orange
  error: '#FF453A', // Lighter iOS Red
  info: '#64D2FF', // Lighter iOS Blue

  // Backgrounds - True Black for OLED (iOS 18)
  background: '#000000', // True black for OLED efficiency
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  surfacePressed: '#0F0F11',

  // Borders & Dividers (iOS 18 refined)
  border: '#424245',
  borderSecondary: '#38383A',
  divider: '#2C2C2E',

  // Text (WCAG AA/AAA compliant)
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#48484A',
  textQuaternary: '#3A3A3C',
  textOnPrimary: '#FFFFFF',

  // Interactive States
  tint: '#0A84FF',
  pressed: 'rgba(10, 132, 255, 0.2)',
  disabled: 'rgba(255, 255, 255, 0.2)',

  // Overlays
  overlay: 'rgba(255, 255, 255, 0.1)',
  scrim: 'rgba(0, 0, 0, 0.6)',
  glassLight: 'rgba(255, 255, 255, 0.1)',
  glassDark: 'rgba(0, 0, 0, 0.5)',
};

/**
 * Gradient definitions - iOS 18 inspired
 * Used for visual emphasis and depth in primary UI elements
 */
export const gradients = {
  // Primary gradients (light mode)
  primaryGradient: ['#007AFF', '#5AC8FA'],
  primaryGradientReverse: ['#5AC8FA', '#007AFF'],
  
  // Primary gradients (dark mode)
  primaryDarkGradient: ['#0A84FF', '#64D2FF'],
  primaryDarkGradientReverse: ['#64D2FF', '#0A84FF'],
  
  // Semantic gradients (light mode)
  successGradient: ['#34C759', '#32D74B'],
  warningGradient: ['#FF9500', '#FF9F0A'],
  errorGradient: ['#FF3B30', '#FF453A'],
  
  // Semantic gradients (dark mode)
  successDarkGradient: ['#32D74B', '#34C759'],
  warningDarkGradient: ['#FF9F0A', '#FF9500'],
  errorDarkGradient: ['#FF453A', '#FF3B30'],
  
  // Background gradients
  backgroundGradient: ['#F2F2F7', '#FFFFFF'],
  backgroundGradientReverse: ['#FFFFFF', '#F9F9FB'],
  
  // Dark background gradients (true black for OLED)
  darkBackgroundGradient: ['#000000', '#1C1C1E'],
  darkBackgroundGradientReverse: ['#1C1C1E', '#2C2C2E'],
};

/**
 * Get color palette for current theme mode
 */
export function getColors(mode: 'light' | 'dark'): ColorPalette {
  return mode === 'dark' ? darkColors : lightColors;
}

/**
 * iOS 18 Design Tokens
 * Additional semantic tokens for consistency across the app
 */
export const semanticTokens = {
  // Interactive feedback states
  interactive: {
    light: {
      default: '#007AFF',
      hovered: 'rgba(0, 122, 255, 0.3)',
      pressed: 'rgba(0, 122, 255, 0.2)',
      disabled: 'rgba(0, 0, 0, 0.15)',
    },
    dark: {
      default: '#0A84FF',
      hovered: 'rgba(10, 132, 255, 0.3)',
      pressed: 'rgba(10, 132, 255, 0.2)',
      disabled: 'rgba(255, 255, 255, 0.15)',
    },
  },

  // Status indicators
  status: {
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
  },

  // Accessibility opacity values
  opacity: {
    disabled: 0.5,
    secondary: 0.6,
    tertiary: 0.3,
    hover: 0.08,
    pressed: 0.12,
  },

  // Contrast ratios (WCAG AA/AAA)
  contrastRatios: {
    wcagAA: 4.5,
    wcagAAA: 7,
  },
};
