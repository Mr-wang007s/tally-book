/**
 * Haptics Service Wrapper
 * Cross-platform haptic feedback using expo-haptics
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticStyle = 'light' | 'medium' | 'heavy';
export type NotificationType = 'success' | 'warning' | 'error';

/**
 * Haptics service with cross-platform support
 */
export const hapticsService = {
  /**
   * Impact haptic feedback
   */
  async impact(style: HapticStyle = 'medium'): Promise<void> {
    try {
      const styleMap = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      };
      await Haptics.impactAsync(styleMap[style]);
    } catch (error) {
      // Gracefully fail on unsupported platforms (web, older devices)
      console.debug('Haptics not supported:', error);
    }
  },

  /**
   * Notification haptic feedback
   */
  async notification(type: NotificationType = 'success'): Promise<void> {
    try {
      const typeMap = {
        success: Haptics.NotificationFeedbackType.Success,
        warning: Haptics.NotificationFeedbackType.Warning,
        error: Haptics.NotificationFeedbackType.Error,
      };
      await Haptics.notificationAsync(typeMap[type]);
    } catch (error) {
      console.debug('Haptics not supported:', error);
    }
  },

  /**
   * Selection haptic feedback (light tap)
   */
  async selection(): Promise<void> {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.debug('Haptics not supported:', error);
    }
  },

  /**
   * Composite feedback for sequences
   */
  async feedback(pattern: HapticStyle[]): Promise<void> {
    for (const style of pattern) {
      await this.impact(style);
      // Small delay between haptics
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  },

  /**
   * Custom vibration pattern (Android fallback)
   * Duration in milliseconds
   */
  async vibrate(duration: number = 100): Promise<void> {
    if (Platform.OS === 'android') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.debug('Vibration not supported:', error);
      }
    }
  },

  /**
   * Check if haptics are supported
   */
  isSupported(): boolean {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  },
};

export default hapticsService;
