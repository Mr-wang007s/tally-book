/**
 * Toast Notification Component
 * Simple toast notification for user feedback
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from './Icon';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
}

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onHide,
}: ToastProps) {
  const { colors, typography, spacing } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Fade out after duration
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        onHide?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onHide, opacity]);

  const iconName =
    type === 'success'
      ? 'checkmark-circle'
      : type === 'error'
      ? 'close-circle'
      : type === 'warning'
      ? 'warning'
      : 'information-circle';

  const backgroundColor =
    type === 'success'
      ? colors.success
      : type === 'error'
      ? colors.error
      : type === 'warning'
      ? colors.warning
      : colors.info;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          borderRadius: spacing.borderRadius.md,
          padding: spacing.md,
          opacity,
        },
      ]}
    >
      <Icon name={iconName} color="#FFFFFF" size={20} />
      <Text
        style={[
          styles.message,
          {
            color: '#FFFFFF',
            fontSize: typography.fontSize.body,
            marginLeft: spacing.sm,
          },
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    flex: 1,
    fontWeight: '500',
  },
});
