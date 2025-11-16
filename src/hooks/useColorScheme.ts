/**
 * useColorScheme Hook - System appearance detection
 * Monitors system color scheme changes in real-time
 */

import { useEffect, useState, useCallback } from 'react';
import { Appearance, AppState, AppStateStatus } from 'react-native';

export type ColorScheme = 'light' | 'dark' | null;

export interface UseColorSchemeReturn {
  colorScheme: ColorScheme;
  isDark: boolean;
  isLight: boolean;
  isUndetermined: boolean;
}

/**
 * Hook to detect system color scheme (light/dark mode)
 * Updates automatically when system appearance changes
 * Handles app state changes and system setting updates
 */
export function useColorScheme(): UseColorSchemeReturn {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    Appearance.getColorScheme()
  );

  const isDark = colorScheme === 'dark';
  const isLight = colorScheme === 'light';
  const isUndetermined = colorScheme === null;

  // Handle system appearance changes
  const handleAppearanceChange = useCallback((preferences: Appearance.AppearancePreferences) => {
    setColorScheme(preferences.colorScheme);
  }, []);

  // Handle app state changes (to refresh on foreground)
  const handleAppStateChange = useCallback((state: AppStateStatus) => {
    if (state === 'active') {
      setColorScheme(Appearance.getColorScheme());
    }
  }, []);

  useEffect(() => {
    // Subscribe to appearance changes
    const subscription = Appearance.addChangeListener(handleAppearanceChange);

    // Subscribe to app state changes for refreshing when foregrounded
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, [handleAppearanceChange, handleAppStateChange]);

  return {
    colorScheme,
    isDark,
    isLight,
    isUndetermined,
  };
}

/**
 * Alternative hook that auto-toggles between detected system scheme
 * Useful for testing or when you want explicit scheme awareness
 */
export function useSystemColorScheme(override?: 'light' | 'dark'): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>(Appearance.getColorScheme());

  useEffect(() => {
    if (override) {
      setScheme(override);
      return;
    }

    const handleChange = (preferences: Appearance.AppearancePreferences) => {
      setScheme(preferences.colorScheme);
    };

    const subscription = Appearance.addChangeListener(handleChange);
    return () => subscription.remove();
  }, [override]);

  return scheme;
}
