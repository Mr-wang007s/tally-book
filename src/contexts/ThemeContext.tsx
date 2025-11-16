/**
 * Theme Context
 * Manages app theme (light/dark/auto) and provides color palette
 */

import React, { createContext, useState, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { getColors, ColorPalette } from '@/theme/colors';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeContextValue {
  // Current theme mode
  mode: ThemeMode;
  
  // Resolved theme ('light' or 'dark')
  theme: 'light' | 'dark';
  
  // Current color palette
  colors: ColorPalette;
  
  // Theme state
  isDark: boolean;
  
  // Theme actions
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = 'auto' }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  // Resolve theme based on mode
  const resolvedTheme: 'light' | 'dark' =
    mode === 'auto' ? (systemColorScheme || 'light') : mode;

  const colors = getColors(resolvedTheme);
  const isDark = resolvedTheme === 'dark';

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    // TODO: Persist to AsyncStorage
  };

  const toggleTheme = () => {
    if (mode === 'auto') {
      // If auto, switch to opposite of current system theme
      setMode(systemColorScheme === 'dark' ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setMode(mode === 'light' ? 'dark' : 'light');
    }
  };

  const value: ThemeContextValue = {
    mode,
    theme: resolvedTheme,
    colors,
    isDark,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}
