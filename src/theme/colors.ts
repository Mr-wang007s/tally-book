/**
 * Theme Colors - Light and Dark Mode Support
 * 遵循 Apple HIG 色彩指南和 WCAG AA 对比度标准 (4.5:1)
 */

export const lightTheme = {
  // Primary colors
  primary: '#007AFF', // iOS Blue
  primaryDark: '#0051D5',
  primaryLight: '#4CA2FF',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7', // iOS System Gray 6
  backgroundTertiary: '#E5E5EA', // iOS System Gray 5

  // Text colors
  text: '#000000',
  textSecondary: '#3C3C43', // iOS Label Secondary (60% opacity on white)
  textTertiary: '#3C3C4399', // iOS Label Tertiary (30% opacity)
  textDisabled: '#3C3C434D', // iOS Label Quaternary (18% opacity)

  // UI colors
  border: '#C6C6C8', // iOS Separator
  separator: '#3C3C4329', // iOS Separator (15% opacity)
  card: '#FFFFFF',
  shadow: '#00000029', // 16% opacity

  // Status colors
  success: '#34C759', // iOS Green
  error: '#FF3B30', // iOS Red
  warning: '#FF9500', // iOS Orange
  info: '#5856D6', // iOS Purple

  // Category colors (8 default categories)
  categoryColors: {
    food: '#FF6B6B', // 餐饮 - Red
    transport: '#4ECDC4', // 交通 - Teal
    shopping: '#FFE66D', // 购物 - Yellow
    entertainment: '#A8E6CF', // 娱乐 - Mint
    medical: '#FF8B94', // 医疗 - Pink
    education: '#95E1D3', // 教育 - Aqua
    housing: '#C7CEEA', // 住房 - Lavender
    other: '#B5B5B5', // 其他 - Gray
  },
} as const;

export const darkTheme = {
  // Primary colors
  primary: '#0A84FF', // iOS Blue (Dark Mode)
  primaryDark: '#409CFF',
  primaryLight: '#0051D5',

  // Background colors
  background: '#000000',
  backgroundSecondary: '#1C1C1E', // iOS System Gray 6 (Dark)
  backgroundTertiary: '#2C2C2E', // iOS System Gray 5 (Dark)

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#EBEBF599', // iOS Label Secondary (60% opacity on black)
  textTertiary: '#EBEBF54D', // iOS Label Tertiary (30% opacity)
  textDisabled: '#EBEBF52E', // iOS Label Quaternary (18% opacity)

  // UI colors
  border: '#38383A', // iOS Separator (Dark)
  separator: '#54545899', // iOS Separator (60% opacity in dark mode)
  card: '#1C1C1E',
  shadow: '#00000080', // 50% opacity for dark mode

  // Status colors
  success: '#30D158', // iOS Green (Dark Mode)
  error: '#FF453A', // iOS Red (Dark Mode)
  warning: '#FF9F0A', // iOS Orange (Dark Mode)
  info: '#5E5CE6', // iOS Purple (Dark Mode)

  // Category colors (8 default categories - adjusted for dark mode)
  categoryColors: {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    shopping: '#FFD93D', // Slightly darker yellow for better contrast
    entertainment: '#A8E6CF',
    medical: '#FF8B94',
    education: '#95E1D3',
    housing: '#C7CEEA',
    other: '#9E9E9E', // Lighter gray for dark mode
  },
} as const;

export type ThemeColors = typeof lightTheme;
export type ColorScheme = 'light' | 'dark';
