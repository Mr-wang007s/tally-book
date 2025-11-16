/**
 * Design Tokens: Typography
 * 
 * SF Pro-inspired type scale optimized for React Native.
 * Based on iOS 18 typography guidelines.
 * 
 * @module src/tokens/typography
 * @see https://developer.apple.com/design/human-interface-guidelines/typography
 */

import { TextStyle } from 'react-native';

/**
 * Typography scale following iOS 18 standards
 * 11 weight levels from large titles to minimal captions
 */
export const typography = {
  /**
   * Large Title (34pt, Bold)
   * Use for: Screen headers, hero text
   * Line height: 41pt (1.2x multiplier)
   */
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: 0.36,
  } as TextStyle,

  /**
   * Title 1 (28pt, Bold)
   * Use for: Section headers, major breaks
   * Line height: 34pt (1.21x multiplier)
   */
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.36,
  } as TextStyle,

  /**
   * Title 2 (22pt, Bold)
   * Use for: Card headers, subsection titles
   * Line height: 28pt (1.27x multiplier)
   */
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.32,
  } as TextStyle,

  /**
   * Title 3 (20pt, Semibold)
   * Use for: List section headers
   * Line height: 25pt (1.25x multiplier)
   */
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600',
    letterSpacing: -0.32,
  } as TextStyle,

  /**
   * Headline (17pt, Semibold)
   * Use for: Emphasis, strong text within body
   * Line height: 22pt (1.29x multiplier)
   */
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.41,
  } as TextStyle,

  /**
   * Body (17pt, Regular)
   * Use for: Primary content, most text
   * Line height: 22pt (1.29x multiplier)
   * ** MOST COMMON - Use this as default **
   */
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.41,
  } as TextStyle,

  /**
   * Callout (16pt, Regular)
   * Use for: Secondary emphasis, supporting text
   * Line height: 21pt (1.31x multiplier)
   */
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: -0.32,
  } as TextStyle,

  /**
   * Subhead (15pt, Regular)
   * Use for: Metadata, labels, secondary info
   * Line height: 20pt (1.33x multiplier)
   */
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: -0.24,
  } as TextStyle,

  /**
   * Footnote (13pt, Regular)
   * Use for: Captions, disclaimers, helper text
   * Line height: 18pt (1.38x multiplier)
   */
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: -0.08,
  } as TextStyle,

  /**
   * Caption 1 (12pt, Regular)
   * Use for: Small labels, icons + text
   * Line height: 16pt (1.33x multiplier)
   */
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0,
  } as TextStyle,

  /**
   * Caption 2 (11pt, Regular)
   * Use for: Minimal text, extreme labels
   * Line height: 13pt (1.18x multiplier)
   * Minimum size - consider accessibility
   */
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400',
    letterSpacing: 0.06,
  } as TextStyle,
} as const;

/**
 * Font weight constants for semantic use
 */
export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

/**
 * Line height multipliers for consistency
 * All typography uses 1.2x minimum for readability
 */
export const lineHeightMultipliers = {
  tight: 1.2,      // Comfortable minimum
  normal: 1.29,    // Default for body text
  relaxed: 1.38,   // For captions and labels
  loose: 1.5,      // For accessibility/readability
} as const;

/**
 * Letter spacing adjustments (optical tracking)
 */
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  loose: 0.5,
} as const;

/**
 * Dynamic type scale for accessibility support
 * Maps font sizes for system text scaling (iOS Dynamic Type)
 * 
 * @example
 * const scaledTypography = scaledTypography[sizeCategory]; // 'xSmall' | 'small' | etc
 */
export const dynamicTypeScales = {
  xSmall: {
    largeTitle: { fontSize: 26, lineHeight: 32 },
    title1: { fontSize: 20, lineHeight: 25 },
    body: { fontSize: 13, lineHeight: 18 },
  },
  small: {
    largeTitle: { fontSize: 28, lineHeight: 34 },
    title1: { fontSize: 22, lineHeight: 28 },
    body: { fontSize: 15, lineHeight: 20 },
  },
  medium: {
    largeTitle: { fontSize: 34, lineHeight: 41 },
    title1: { fontSize: 28, lineHeight: 34 },
    body: { fontSize: 17, lineHeight: 22 },
  },
  large: {
    largeTitle: { fontSize: 40, lineHeight: 48 },
    title1: { fontSize: 32, lineHeight: 39 },
    body: { fontSize: 19, lineHeight: 24 },
  },
  xLarge: {
    largeTitle: { fontSize: 48, lineHeight: 58 },
    title1: { fontSize: 38, lineHeight: 46 },
    body: { fontSize: 21, lineHeight: 26 },
  },
  xxLarge: {
    largeTitle: { fontSize: 56, lineHeight: 67 },
    title1: { fontSize: 44, lineHeight: 53 },
    body: { fontSize: 23, lineHeight: 29 },
  },
  xxxLarge: {
    largeTitle: { fontSize: 64, lineHeight: 77 },
    title1: { fontSize: 52, lineHeight: 63 },
    body: { fontSize: 28, lineHeight: 34 },
  },
} as const;

/**
 * Pre-composed typography variants for common use cases
 */
export const typographyVariants = {
  // Headings
  screenTitle: typography.largeTitle,
  sectionTitle: typography.title2,
  cardTitle: typography.headline,
  label: typography.subhead,

  // Body text
  bodyText: typography.body,
  secondaryText: typography.callout,
  smallText: typography.footnote,
  tinyText: typography.caption2,

  // Form
  formLabel: { ...typography.subhead, fontWeight: '600' } as TextStyle,
  formPlaceholder: typography.body,
  formError: { ...typography.caption1, fontWeight: '600' } as TextStyle,

  // Numbers
  price: { ...typography.headline, fontWeight: '600' } as TextStyle,
  largeNumber: { ...typography.title2, fontWeight: '700' } as TextStyle,

  // Interactive
  buttonText: { ...typography.headline, fontWeight: '600' } as TextStyle,
  linkText: { ...typography.body, fontWeight: '600' } as TextStyle,

  // Metadata
  timestamp: typography.footnote,
  caption: typography.caption1,
  badge: typography.caption2,
} as const;

/**
 * Minimum touch target requirements
 * iOS HIG recommends 44pt minimum height
 */
export const touchTargets = {
  minimum: 44,     // iOS HIG minimum
  comfortable: 48, // Recommended
  large: 56,       // FAB size
} as const;

/**
 * Accessibility helpers for text sizing
 */
export const accessibilityTextSizes = {
  // Minimum sizes for different text types
  minimum: {
    body: 16,      // Minimum for body text (accessibility standard)
    caption: 12,   // Minimum for captions/small text
  },
  // Recommended sizes
  recommended: {
    body: 17,      // Standard body text
    headline: 20,  // Headers
    caption: 13,   // Captions and helper text
  },
} as const;

/**
 * Type-safe typography selector
 * Helps prevent typos when selecting typography styles
 */
export type TypographyKey = keyof typeof typography;
export type TypographyVariantKey = keyof typeof typographyVariants;

/**
 * Helper to get typography style with fallback
 * 
 * @example
 * const style = getTypography('body'); // TextStyle
 */
export function getTypography(key: TypographyKey): TextStyle {
  return typography[key];
}

/**
 * Helper to get typography variant with fallback
 * 
 * @example
 * const style = getVariant('screenTitle'); // TextStyle
 */
export function getVariant(key: TypographyVariantKey): TextStyle {
  return typographyVariants[key];
}

/**
 * Combine typography with color for semantic text styles
 * 
 * @example
 * const style = combineStyles(typography.body, colors.textPrimary);
 */
export function combineStyles(
  typographyStyle: TextStyle,
  color: string
): TextStyle {
  return {
    ...typographyStyle,
    color,
  };
}
