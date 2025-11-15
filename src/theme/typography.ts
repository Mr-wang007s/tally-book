/**
 * Typography Scale - SF Pro Inspired
 * 11-level type scale matching iOS 18 design guidelines
 */

export interface TypographyStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '600' | '700';
  letterSpacing?: number;
}

export const typography = {
  // Display styles
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
  } as TypographyStyle,

  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  } as TypographyStyle,

  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  } as TypographyStyle,

  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600',
  } as TypographyStyle,

  // Content styles
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  } as TypographyStyle,

  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400',
  } as TypographyStyle,

  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
  } as TypographyStyle,

  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
  } as TypographyStyle,

  // Small text
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  } as TypographyStyle,

  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } as TypographyStyle,

  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400',
  } as TypographyStyle,
} as const;

/**
 * Font weight mapping
 */
export const fontWeights = {
  regular: '400',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Helper function to get text style
 */
export function getTextStyle(
  variant: keyof typeof typography,
  color?: string
): {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '600' | '700';
  color?: string;
} {
  const style = typography[variant];
  return color ? { ...style, color } : style;
}
