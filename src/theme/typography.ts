/**
 * Typography System
 * 遵循 iOS Human Interface Guidelines 字体规范
 * 支持动态字体缩放 (Dynamic Type)
 */

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System', // iOS 系统字体
    medium: 'System', // 使用 fontWeight 区分
    bold: 'System',
  },

  // Font sizes (based on iOS Text Styles)
  fontSize: {
    largeTitle: 34, // iOS Large Title
    title1: 28, // iOS Title 1
    title2: 22, // iOS Title 2
    title3: 20, // iOS Title 3
    headline: 17, // iOS Headline (semibold)
    body: 17, // iOS Body (regular)
    callout: 16, // iOS Callout
    subhead: 15, // iOS Subhead
    footnote: 13, // iOS Footnote
    caption1: 12, // iOS Caption 1
    caption2: 11, // iOS Caption 2
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line heights (1.2x font size for readability)
  lineHeight: {
    largeTitle: 41,
    title1: 34,
    title2: 28,
    title3: 25,
    headline: 22,
    body: 22,
    callout: 21,
    subhead: 20,
    footnote: 18,
    caption1: 16,
    caption2: 13,
  },

  // Letter spacing (iOS default is 0, adjusted for specific cases)
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

export type Typography = typeof typography;
