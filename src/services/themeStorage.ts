/**
 * Theme Storage Service
 * Persists and retrieves theme mode preferences to AsyncStorage
 * Survives app restarts while respecting system changes
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../context/ThemeContext';

const THEME_STORAGE_KEY = '@ledger_theme_mode';
const THEME_TIMESTAMP_KEY = '@ledger_theme_timestamp';

export interface ThemeStorageData {
  mode: ThemeMode;
  timestamp: number; // For debugging/analytics
}

/**
 * Save theme mode to AsyncStorage
 */
export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  try {
    const data: ThemeStorageData = {
      mode,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('[ThemeStorage] Failed to save theme mode:', error);
  }
}

/**
 * Load theme mode from AsyncStorage
 * Returns null if not found or default if corrupted
 */
export async function loadThemeMode(): Promise<ThemeMode | null> {
  try {
    const data = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as ThemeStorageData;
    
    // Validate mode
    if (parsed.mode && ['light', 'dark', 'system'].includes(parsed.mode)) {
      return parsed.mode as ThemeMode;
    }
    return null;
  } catch (error) {
    console.warn('[ThemeStorage] Failed to load theme mode:', error);
    return null;
  }
}

/**
 * Clear theme preference, falling back to system default
 */
export async function clearThemeMode(): Promise<void> {
  try {
    await AsyncStorage.removeItem(THEME_STORAGE_KEY);
    await AsyncStorage.removeItem(THEME_TIMESTAMP_KEY);
  } catch (error) {
    console.warn('[ThemeStorage] Failed to clear theme mode:', error);
  }
}

/**
 * Get all theme-related storage data (for debugging)
 */
export async function getThemeStorageInfo(): Promise<Record<string, unknown>> {
  try {
    const data = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (!data) return { stored: false };

    return {
      stored: true,
      data: JSON.parse(data),
    };
  } catch (error) {
    return { error: String(error) };
  }
}

/**
 * Hook-like function for theme initialization
 * Loads persisted theme on app startup
 */
export async function initializeThemeMode(): Promise<ThemeMode> {
  const saved = await loadThemeMode();
  
  // Return saved mode if available, otherwise use system
  if (saved) {
    return saved;
  }
  
  return 'system';
}

/**
 * Batch clear all theme and appearance data
 */
export async function resetThemeSettings(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      THEME_STORAGE_KEY,
      THEME_TIMESTAMP_KEY,
    ]);
  } catch (error) {
    console.warn('[ThemeStorage] Failed to reset theme settings:', error);
  }
}
