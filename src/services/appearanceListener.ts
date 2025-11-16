/**
 * Appearance Listener Service
 * Manages system appearance changes and notifies subscribers
 * Centralizes handling of light/dark mode transitions
 */

import { Appearance, AppState, AppStateStatus } from 'react-native';

export type ColorScheme = 'light' | 'dark' | null;
export type AppearanceListener = (colorScheme: ColorScheme) => void;

interface AppearanceListenerState {
  currentScheme: ColorScheme;
  listeners: Set<AppearanceListener>;
  isMonitoring: boolean;
}

const state: AppearanceListenerState = {
  currentScheme: Appearance.getColorScheme(),
  listeners: new Set(),
  isMonitoring: false,
};

/**
 * Subscribe to appearance changes
 */
export function subscribeToAppearanceChanges(
  listener: AppearanceListener
): () => void {
  state.listeners.add(listener);
  startMonitoring();

  // Return unsubscribe function
  return () => {
    state.listeners.delete(listener);
    if (state.listeners.size === 0) {
      stopMonitoring();
    }
  };
}

/**
 * Get current appearance
 */
export function getCurrentAppearance(): ColorScheme {
  return state.currentScheme;
}

/**
 * Check if currently in dark mode
 */
export function isDarkMode(): boolean {
  return state.currentScheme === 'dark';
}

/**
 * Start monitoring appearance changes
 */
function startMonitoring(): void {
  if (state.isMonitoring) return;

  state.isMonitoring = true;

  // Listen for appearance changes
  const appearanceSubscription = Appearance.addChangeListener(
    (preferences: Appearance.AppearancePreferences) => {
      handleAppearanceChange(preferences.colorScheme);
    }
  );

  // Listen for app state changes to refresh appearance
  const appStateSubscription = AppState.addEventListener('change', (state) => {
    handleAppStateChange(state);
  });

  // Store subscriptions for cleanup
  (state as any).appearanceSubscription = appearanceSubscription;
  (state as any).appStateSubscription = appStateSubscription;
}

/**
 * Stop monitoring appearance changes
 */
function stopMonitoring(): void {
  if (!state.isMonitoring) return;

  state.isMonitoring = false;

  // Clean up subscriptions
  if ((state as any).appearanceSubscription) {
    (state as any).appearanceSubscription.remove();
  }
  if ((state as any).appStateSubscription) {
    (state as any).appStateSubscription.remove();
  }
}

/**
 * Handle appearance change event
 */
function handleAppearanceChange(colorScheme: ColorScheme): void {
  if (state.currentScheme === colorScheme) return;

  state.currentScheme = colorScheme;
  notifyListeners();
}

/**
 * Handle app state change (refresh appearance on foreground)
 */
function handleAppStateChange(appState: AppStateStatus): void {
  if (appState !== 'active') return;

  // Refresh appearance when app comes to foreground
  const currentScheme = Appearance.getColorScheme();
  if (state.currentScheme !== currentScheme) {
    state.currentScheme = currentScheme;
    notifyListeners();
  }
}

/**
 * Notify all listeners of appearance change
 */
function notifyListeners(): void {
  state.listeners.forEach((listener) => {
    try {
      listener(state.currentScheme);
    } catch (error) {
      console.warn('[AppearanceListener] Error in listener:', error);
    }
  });
}

/**
 * Force refresh appearance (for testing or manual refresh)
 */
export function refreshAppearance(): ColorScheme {
  const current = Appearance.getColorScheme();
  if (state.currentScheme !== current) {
    state.currentScheme = current;
    notifyListeners();
  }
  return state.currentScheme;
}

/**
 * Get listener count (for debugging)
 */
export function getListenerCount(): number {
  return state.listeners.size;
}

/**
 * Clear all listeners (for cleanup/testing)
 */
export function clearAllListeners(): void {
  state.listeners.clear();
  stopMonitoring();
}
