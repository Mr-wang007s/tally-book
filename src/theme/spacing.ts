/**
 * Spacing System
 * 基于 8px 网格系统，遵循 iOS 设计规范
 */

export const spacing = {
  // Base spacing unit: 8px
  xs: 4, // 0.5 × base
  sm: 8, // 1 × base
  md: 16, // 2 × base
  lg: 24, // 3 × base
  xl: 32, // 4 × base
  xxl: 48, // 6 × base
  xxxl: 64, // 8 × base

  // Touch targets (iOS HIG minimum: 44pt)
  touchTarget: 44,
  touchTargetLarge: 56,

  // Screen margins
  screenHorizontal: 16,
  screenVertical: 16,

  // Card and component spacing
  cardPadding: 16,
  cardMargin: 12,
  sectionSpacing: 24,

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999, // For circular elements
  },

  // Border width
  borderWidth: {
    thin: 0.5, // iOS thin border
    regular: 1,
    thick: 2,
  },


} as const;

export type Spacing = typeof spacing;
