/**
 * Accessibility Helpers
 * Provides utility functions for improved accessibility across the app
 */

export interface A11yProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?:
    | 'none'
    | 'button'
    | 'link'
    | 'search'
    | 'image'
    | 'text'
    | 'adjustable'
    | 'header'
    | 'summary'
    | 'imagebutton'
    | 'keyboardkey'
    | 'menubar'
    | 'menuitem'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'scrollbar'
    | 'spinbutton'
    | 'switch'
    | 'tab'
    | 'tablist'
    | 'timer'
    | 'toolbar';
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
}

/**
 * Creates accessibility props for a button
 */
export function buttonA11y(label: string, hint?: string): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'button',
  };
}

/**
 * Creates accessibility props for text input
 */
export function inputA11y(label: string, hint?: string): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
  };
}

/**
 * Creates accessibility props for headings
 */
export function headingA11y(label: string): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: 'header',
  };
}

/**
 * Formats currency for screen readers
 */
export function formatCurrencyA11y(amount: number, currency: string = 'USD'): string {
  return `${amount.toFixed(2)} ${currency}`;
}

/**
 * Formats date for screen readers
 */
export function formatDateA11y(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
