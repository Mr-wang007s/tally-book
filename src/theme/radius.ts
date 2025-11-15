/**
 * Border Radius System
 * Consistent corner rounding for UI elements
 */

export const radius = {
  /**
   * Extra small radius
   * Usage: Small buttons, tags
   */
  xs: 4,

  /**
   * Small radius
   * Usage: Input fields, small cards
   */
  sm: 8,

  /**
   * Medium radius
   * Usage: Standard cards, containers
   */
  md: 12,

  /**
   * Large radius
   * Usage: Large cards, prominent containers
   */
  lg: 16,

  /**
   * Extra large radius
   * Usage: Hero cards, special containers
   */
  xl: 20,

  /**
   * Full radius (pill shape)
   * Usage: Pills, FAB, circular buttons
   */
  full: 9999,
} as const;

/**
 * Helper function to get border radius
 */
export function getRadius(size: keyof typeof radius): number {
  return radius[size];
}

/**
 * Create rounded corners for specific sides
 */
export function getRoundedCorners(options: {
  topLeft?: keyof typeof radius;
  topRight?: keyof typeof radius;
  bottomLeft?: keyof typeof radius;
  bottomRight?: keyof typeof radius;
}): {
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
} {
  return {
    borderTopLeftRadius: options.topLeft ? radius[options.topLeft] : undefined,
    borderTopRightRadius: options.topRight ? radius[options.topRight] : undefined,
    borderBottomLeftRadius: options.bottomLeft ? radius[options.bottomLeft] : undefined,
    borderBottomRightRadius: options.bottomRight ? radius[options.bottomRight] : undefined,
  };
}
