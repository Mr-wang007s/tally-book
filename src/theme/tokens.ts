/**
 * Design Tokens
 * Aligned to iOS visual language for consistency and premium feel
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const colors = {
  // Primary palette
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',

  // Semantic colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',

  // Neutrals
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  surface: '#FFFFFF',
  border: '#C6C6C8',
  divider: '#E5E5EA',

  // Text
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textOnPrimary: '#FFFFFF',

  // Dark mode (iOS dark palette)
  darkBackground: '#000000',
  darkBackgroundSecondary: '#1C1C1E',
  darkSurface: '#2C2C2E',
  darkBorder: '#38383A',
  darkTextPrimary: '#FFFFFF',
  darkTextSecondary: '#8E8E93',
} as const;

export const typography = {
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600' as const,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400' as const,
  },
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400' as const,
  },
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
