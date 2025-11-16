/**
 * useHaptics Hook
 * Provides haptic feedback utilities with graceful fallback
 */

import { hapticsService, HapticStyle, NotificationType } from '@/services/haptics';

/**
 * Hook for haptic feedback
 */
export function useHaptics() {
  return {
    /**
     * Trigger impact haptic
     */
    impact: async (style: HapticStyle = 'medium') => {
      await hapticsService.impact(style);
    },

    /**
     * Trigger notification haptic
     */
    notify: async (type: NotificationType = 'success') => {
      await hapticsService.notification(type);
    },

    /**
     * Trigger selection haptic (light tap)
     */
    select: async () => {
      await hapticsService.selection();
    },

    /**
     * Trigger custom pattern
     */
    pattern: async (pattern: HapticStyle[]) => {
      await hapticsService.feedback(pattern);
    },

    /**
     * Check if haptics supported
     */
    isSupported: () => hapticsService.isSupported(),
  };
}
