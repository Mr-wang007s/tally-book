/**
 * Settings Store (Zustand)
 * 应用设置状态管理
 */

import { create } from 'zustand';
import type { AppSettings, UpdateSettingsDTO } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';
import * as storage from '@/services/storage';

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (updates: UpdateSettingsDTO) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const saved = await storage.getSettings();
      set({
        settings: saved || DEFAULT_SETTINGS,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load settings',
        isLoading: false,
        settings: DEFAULT_SETTINGS,
      });
    }
  },

  updateSettings: async (updates: UpdateSettingsDTO) => {
    set({ isLoading: true, error: null });
    try {
      const current = get().settings;
      const updated = { ...current, ...updates };
      await storage.saveSettings(updated);
      set({ settings: updated, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update settings',
        isLoading: false,
      });
      throw error;
    }
  },

  resetSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      await storage.saveSettings(DEFAULT_SETTINGS);
      set({ settings: DEFAULT_SETTINGS, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reset settings',
        isLoading: false,
      });
      throw error;
    }
  },
}));
