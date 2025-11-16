/**
 * Design Tokens: Elevation & Shadows
 * 
 * 5-level elevation system with platform-specific shadow properties.
 * Provides depth perception and visual hierarchy.
 * 
 * @module src/tokens/elevation
 * @see https://developer.apple.com/design/human-interface-guidelines/shadows
 */

import { ViewStyle } from 'react-native';

/**
 * Elevation level 0: No shadow (flat surface)
 * Use for: Backgrounds, flat elements
 */
export const elevation0: ViewStyle = {
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
} as ViewStyle;

/**
 * Elevation level 1: Subtle shadow (minimal lift)
 * Use for: Subtle list items, inline cards
 * Shadow: 1pt offset, 2pt blur
 */
export const elevation1: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 2,
  elevation: 1,
} as ViewStyle;

/**
 * Elevation level 2: Standard shadow (default)
 * Use for: Cards, summary widgets
 * Shadow: 2pt offset, 8pt blur
 * ** MOST COMMON **
 */
export const elevation2: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
} as ViewStyle;

/**
 * Elevation level 3: Raised shadow (medium lift)
 * Use for: Modals, bottom sheets
 * Shadow: 4pt offset, 16pt blur
 */
export const elevation3: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 4,
} as ViewStyle;

/**
 * Elevation level 4: High shadow (high lift)
 * Use for: Overlays, dialogs
 * Shadow: 8pt offset, 24pt blur
 */
export const elevation4: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.16,
  shadowRadius: 24,
  elevation: 8,
} as ViewStyle;

/**
 * Elevation level 5: Maximum shadow (floating element)
 * Use for: Popovers, tooltips, FAB
 * Shadow: 16pt offset, 48pt blur
 */
export const elevation5: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: 0.24,
  shadowRadius: 48,
  elevation: 16,
} as ViewStyle;

/**
 * Elevation levels indexed array for easy access
 */
export const elevations = [
  elevation0,
  elevation1,
  elevation2,
  elevation3,
  elevation4,
  elevation5,
] as const;

/**
 * Elevation type for arrays and mappings
 */
export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Component-specific elevation presets
 */
export const componentElevations = {
  // Surfaces
  flat: elevation0,              // No shadow
  surface: elevation1,           // Minimal lift
  card: elevation2,              // Standard (MOST COMMON)
  elevated: elevation3,          // Raised
  
  // Overlays
  modal: elevation3,             // Modal dialog
  sheet: elevation4,             // Bottom sheet
  popover: elevation5,           // Floating popover
  tooltip: elevation5,           // Floating tooltip
  
  // Interactive
  button: elevation0,            // No shadow at rest
  buttonHover: elevation2,       // Shadow on hover
  buttonPressed: elevation1,     // Shadow on press (lifted then pushed)
  
  // Lists
  listItem: elevation0,          // Flat on list
  listItemHover: elevation1,     // Subtle on hover
  
  // Headers
  header: elevation2,            // Standard header shadow
  sticky: elevation3,            // Sticky header (more prominent)
  
  // Navigation
  tabBar: elevation2,            // Tab bar bottom shadow
  navBar: elevation2,            // Navigation bar shadow
  
  // Input
  input: elevation0,             // Flat input
  inputFocus: elevation1,        // Subtle shadow on focus
  
  // Badges
  badge: elevation0,             // Flat badge
  
  // Shadows for special effects
  drop: elevation3,              // Drop shadow effect
  inset: elevation0,             // For inset shadows (custom)
} as const;

/**
 * Dark mode elevation adjustments
 * Shadows may need to be more pronounced or softer in dark mode
 */
export const darkModeElevations = {
  // In dark mode, increase opacity for better visibility
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,        // Increased from 0.08
    shadowRadius: 8,
    elevation: 4,               // Increased from 2
  } as ViewStyle,
  
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,        // Increased from 0.12
    shadowRadius: 16,
    elevation: 6,               // Increased from 4
  } as ViewStyle,
  
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,        // Increased from 0.16
    shadowRadius: 24,
    elevation: 12,              // Increased from 8
  } as ViewStyle,
} as const;

/**
 * Glassmorphism effect (blur + semi-transparent overlay)
 * Used for modern frosted glass appearance
 */
export const glassmorphism = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
  },
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
  },
} as const;

/**
 * Inset shadow effect (for depressed/sunken appearance)
 * Note: React Native doesn't support inset shadows natively
 * Use border or overlay approach instead
 */
export const insetShadow = {
  // Approximate inset shadow with border
  slight: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  moderate: {
    borderTopWidth: 2,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
} as const;

/**
 * Shadow for specific use cases
 */
export const shadowEffects = {
  // Floating action button
  fab: elevation4,
  
  // Sticky header
  stickyHeader: elevation3,
  
  // Active state indication
  active: elevation2,
  
  // Hover state
  hover: elevation1,
  
  // Focus state
  focus: elevation2,
  
  // Pressed state (lifted briefly)
  pressed: elevation0,
} as const;

/**
 * Get elevation by level
 * 
 * @example
 * const style = getElevation(2);
 */
export function getElevation(level: ElevationLevel): ViewStyle {
  return elevations[level];
}

/**
 * Combine elevation with other styles
 * 
 * @example
 * const combined = combineWithElevation({ padding: 16 }, 2);
 */
export function combineWithElevation(
  baseStyle: ViewStyle,
  elevationLevel: ElevationLevel
): ViewStyle {
  return {
    ...baseStyle,
    ...elevations[elevationLevel],
  };
}

/**
 * Get appropriate elevation for dark mode
 * 
 * @example
 * const darkElevation = getDarkModeElevation('card');
 */
export function getDarkModeElevation(
  component: keyof typeof darkModeElevations
): ViewStyle {
  return darkModeElevations[component];
}

/**
 * Create custom shadow style
 * Useful for fine-tuning shadows
 * 
 * @example
 * const custom = createShadow(0, 4, 0.1, 12);
 */
export function createShadow(
  offsetY: number,
  blur: number,
  opacity: number,
  elevation?: number
): ViewStyle {
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation: elevation ?? Math.min(blur / 4, 12),
  } as ViewStyle;
}

/**
 * Elevation usage guidelines
 * 
 * Level 0: Backgrounds, flat surfaces, no hierarchy
 * Level 1: Subtle lift - list items, inline content
 * Level 2: Standard - cards, widgets, most components (MOST COMMON)
 * Level 3: Raised - modals, bottom sheets, important dialogs
 * Level 4: High - overlays, popups, floating elements
 * Level 5: Maximum - FAB, popovers, extreme cases
 */

/**
 * Accessibility note:
 * - Ensure color contrast is maintained (shadows shouldn't obscure text)
 * - Avoid relying solely on shadows for important information
 * - Consider reduced-motion preference (disable drop shadows if needed)
 */
