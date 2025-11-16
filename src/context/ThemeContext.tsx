/**
 * Theme Context - Global theme management
 * Provides theme mode (light/dark) and related utilities
 * Supports system detection, manual override, and persistence
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { ColorPalette, getColors, lightColors, darkColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { elevation } from '../theme/elevation';
import { radius } from '../theme/radius';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark'; // Actual mode after system detection
  colors: ColorPalette;
  typography: typeof typography;
  spacing: typeof spacing;
  elevation: typeof elevation;
  radius: typeof radius;
}

export interface ThemeContextType {
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isSystemMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook to use theme context
 * Must be used within ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * Provider component - wrap your root component with this
 */
export function ThemeProvider({
  children,
  initialMode = 'system',
}: {
  children: ReactNode;
  initialMode?: ThemeMode;
}): React.ReactElement {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(initialMode);
  const [systemColorScheme, setSystemColorScheme] = React.useState<'light' | 'dark'>('light');

  // Resolve actual mode
  const resolvedMode: 'light' | 'dark' =
    themeMode === 'system' ? systemColorScheme : themeMode;

  const theme: Theme = {
    mode: themeMode,
    resolvedMode,
    colors: getColors(resolvedMode),
    typography,
    spacing,
    elevation,
    radius,
  };

  const contextValue: ThemeContextType = {
    theme,
    setThemeMode,
    toggleTheme: () => {
      setThemeMode((prev) => {
        if (prev === 'light') return 'dark';
        if (prev === 'dark') return 'light';
        return resolvedMode === 'light' ? 'dark' : 'light';
      });
    },
    isDark: resolvedMode === 'dark',
    isSystemMode: themeMode === 'system',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * HOC to wrap components with theme provider
 */
export function withTheme<P extends object>(
  Component: React.ComponentType<P>,
  initialMode?: ThemeMode
): React.ComponentType<P> {
  return (props: P) => (
    <ThemeProvider initialMode={initialMode}>
      <Component {...props} />
    </ThemeProvider>
  );
}
