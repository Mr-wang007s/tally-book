/**
 * Design Tokens: Spacing
 * 
 * 8pt base grid system with optical adjustments.
 * Provides consistent spacing throughout the application.
 * 
 * @module src/tokens/spacing
 * @see https://spec.fm/specifics/8-pt-grid
 * @see https://developer.apple.com/design/human-interface-guidelines/layout
 */

/**
 * Spacing scale based on 8pt grid system
 * Each level represents a multiple of 4pt for fine tuning
 */
export const spacing = {
  /**
   * 2pt - Hairline spacing
   * Use for: Optical adjustments, SVG stroke widths
   */
  xxxs: 2,

  /**
   * 4pt - Tight spacing
   * Use for: Icon padding, minimal gaps
   */
  xxs: 4,

  /**
   * 8pt - Compact spacing
   * Use for: List item internal spacing, tight components
   * 1 grid unit
   */
  xs: 8,

  /**
   * 12pt - Small spacing
   * Use for: Form field gaps, close related elements
   * 1.5 grid units
   */
  sm: 12,

  /**
   * 16pt - Default spacing
   * Use for: Card padding, element margins
   * 2 grid units
   * ** MOST COMMON **
   */
  md: 16,

  /**
   * 24pt - Medium spacing
   * Use for: Section spacing, screen padding
   * 3 grid units
   */
  lg: 24,

  /**
   * 32pt - Large spacing
   * Use for: Screen margins, major sections
   * 4 grid units
   */
  xl: 32,

  /**
   * 48pt - Extra large spacing
   * Use for: Hero sections, empty states
   * 6 grid units
   */
  xxl: 48,

  /**
   * 64pt - Extreme spacing
   * Use for: Special layouts, onboarding
   * 8 grid units
   */
  xxxl: 64,
} as const;

/**
 * Screen margin/padding presets
 */
export const screenPadding = {
  horizontal: spacing.md,    // 16pt left/right
  vertical: spacing.lg,      // 24pt top/bottom
  compact: spacing.sm,       // 12pt for dense layouts
  comfortable: spacing.lg,   // 24pt for spacious layouts
} as const;

/**
 * Component-specific spacing patterns
 */
export const componentSpacing = {
  // List items
  listItemPadding: spacing.md,           // 16pt
  listItemGap: spacing.xs,               // 8pt between icon and text
  listItemVerticalGap: spacing.sm,       // 12pt between items

  // Cards
  cardPadding: spacing.md,               // 16pt
  cardGap: spacing.sm,                   // 12pt between elements
  cardShadowOffset: spacing.md,          // 16pt blur radius

  // Forms
  formFieldGap: spacing.md,              // 16pt between fields
  formLabelMargin: spacing.xxs,          // 4pt below label
  formErrorMargin: spacing.xxs,          // 4pt above error message
  formInputHeight: 44,                   // Touch target minimum

  // Buttons
  buttonPadding: spacing.md,             // 16pt horizontal
  buttonMinHeight: 44,                   // iOS HIG minimum
  buttonGap: spacing.md,                 // 16pt between button group

  // Navigation
  tabPadding: spacing.md,                // 16pt tab spacing
  navItemGap: spacing.lg,                // 24pt between nav items

  // Modals/Sheets
  sheetPadding: spacing.lg,              // 24pt padding
  sheetGap: spacing.md,                  // 16pt between items
  sheetCornerRadius: spacing.lg,         // 24pt radius
} as const;

/**
 * Touch target sizes (accessibility)
 * iOS HIG requires minimum 44pt
 */
export const touchTargets = {
  minimum: 44,              // 5.5 grid units - iOS minimum
  comfortable: 48,          // 6 grid units - recommended
  large: 56,                // 7 grid units - FAB/prominent buttons
  extraLarge: 64,           // 8 grid units - main CTA
} as const;

/**
 * Responsive spacing for different screen sizes
 * Used with breakpoints to adjust layout
 */
export const responsiveSpacing = {
  mobile: {
    padding: spacing.md,    // 16pt on mobile
    gap: spacing.sm,        // 12pt gaps
    margin: spacing.lg,     // 24pt margins
  },
  tablet: {
    padding: spacing.lg,    // 24pt on tablet
    gap: spacing.md,        // 16pt gaps
    margin: spacing.xl,     // 32pt margins
  },
  desktop: {
    padding: spacing.xl,    // 32pt on desktop
    gap: spacing.lg,        // 24pt gaps
    margin: spacing.xxl,    // 48pt margins
  },
} as const;

/**
 * Inset/padding presets for common layouts
 */
export const insets = {
  // All sides equal
  uniform: {
    xs: spacing.xs,         // 8pt
    sm: spacing.sm,         // 12pt
    md: spacing.md,         // 16pt (MOST COMMON)
    lg: spacing.lg,         // 24pt
    xl: spacing.xl,         // 32pt
  },
  
  // Horizontal and vertical
  symmetric: {
    xs: { horizontal: spacing.xs, vertical: spacing.xxs },     // 8pt / 4pt
    sm: { horizontal: spacing.sm, vertical: spacing.xs },      // 12pt / 8pt
    md: { horizontal: spacing.md, vertical: spacing.sm },      // 16pt / 12pt
    lg: { horizontal: spacing.lg, vertical: spacing.md },      // 24pt / 16pt
    xl: { horizontal: spacing.xl, vertical: spacing.lg },      // 32pt / 24pt
  },
  
  // Screen-level
  screen: { horizontal: spacing.md, vertical: spacing.lg },    // 16pt / 24pt
  
  // Dense
  dense: { horizontal: spacing.sm, vertical: spacing.xxs },    // 12pt / 4pt
  
  // Spacious
  spacious: { horizontal: spacing.lg, vertical: spacing.xl },  // 24pt / 32pt
} as const;

/**
 * Gap presets for flex/grid layouts
 */
export const gaps = {
  none: 0,
  hairline: spacing.xxxs,     // 2pt
  tight: spacing.xxs,         // 4pt
  compact: spacing.xs,        // 8pt
  comfortable: spacing.sm,    // 12pt
  standard: spacing.md,       // 16pt
  generous: spacing.lg,       // 24pt
  extra: spacing.xl,          // 32pt
} as const;

/**
 * Border radius presets (iOS-inspired)
 */
export const borderRadius = {
  none: 0,
  extraSmall: 4,             // Sharp corners
  small: 8,                  // Slightly rounded
  medium: 12,                // Standard rounded
  large: 16,                 // Generous rounding
  extraLarge: 20,            // Very rounded
  round: 999,                // Fully circular
} as const;

/**
 * Icon spacing standards
 */
export const iconSpacing = {
  tiny: spacing.xxxs,        // 2pt (for decorative)
  small: spacing.xxs,        // 4pt
  base: spacing.xs,          // 8pt (MOST COMMON)
  medium: spacing.sm,        // 12pt
  large: spacing.md,         // 16pt
} as const;

/**
 * Helper to scale spacing value
 * Useful for responsive layouts
 * 
 * @example
 * const scaledSpacing = scaleSpacing(spacing.md, 1.5); // 16 * 1.5 = 24
 */
export function scaleSpacing(value: number, scale: number): number {
  return Math.round(value * scale);
}

/**
 * Helper to create padding object
 * 
 * @example
 * const padding = createPadding(spacing.md);                    // All sides
 * const padding = createPadding(spacing.md, spacing.lg);       // V/H
 * const padding = createPadding(16, 24, 12, 8);               // T/R/B/L
 */
export function createPadding(
  topOrAll: number,
  rightOrH?: number,
  bottom?: number,
  left?: number
): {
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
} {
  if (rightOrH === undefined) {
    // All sides equal
    return { paddingVertical: topOrAll, paddingHorizontal: topOrAll };
  } else if (bottom === undefined) {
    // Vertical and horizontal
    return { paddingVertical: topOrAll, paddingHorizontal: rightOrH };
  } else {
    // Individual sides
    return {
      paddingTop: topOrAll,
      paddingRight: rightOrH,
      paddingBottom: bottom,
      paddingLeft: left ?? rightOrH,
    };
  }
}

/**
 * Helper to create margin object
 * Same signature as createPadding but for margins
 */
export function createMargin(
  topOrAll: number,
  rightOrH?: number,
  bottom?: number,
  left?: number
): {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginHorizontal?: number;
  marginVertical?: number;
} {
  if (rightOrH === undefined) {
    return { marginVertical: topOrAll, marginHorizontal: topOrAll };
  } else if (bottom === undefined) {
    return { marginVertical: topOrAll, marginHorizontal: rightOrH };
  } else {
    return {
      marginTop: topOrAll,
      marginRight: rightOrH,
      marginBottom: bottom,
      marginLeft: left ?? rightOrH,
    };
  }
}

/**
 * Type-safe spacing key selector
 */
export type SpacingKey = keyof typeof spacing;

/**
 * Get spacing value by key
 * 
 * @example
 * const value = getSpacing('md'); // 16
 */
export function getSpacing(key: SpacingKey): number {
  return spacing[key];
}
