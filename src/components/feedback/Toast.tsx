/**
 * Toast Component
 * 
 * Non-intrusive notification toasts with auto-dismiss
 * Supports success, error, warning, and info types
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
  visible?: boolean;
}

const typeConfig = {
  success: { icon: '✓', color: '#10b981' },
  error: { icon: '✕', color: '#ef4444' },
  warning: { icon: '⚠', color: '#f59e0b' },
  info: { icon: 'ℹ', color: '#3b82f6' },
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  action,
  visible = true,
}) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(visible);
  const [slideAnim] = useState(new Animated.Value(0));

  const config = typeConfig[type];

  useEffect(() => {
    if (!visible) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, slideAnim]);

  const handleDismiss = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      onDismiss?.();
    });
  }, [slideAnim, onDismiss]);

  if (!isVisible) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: Platform.OS === 'android' ? 40 : 60,
      left: 12,
      right: 12,
      zIndex: 9999,
    },
    toast: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 'auto',
      borderLeftWidth: 4,
      borderLeftColor: config.color,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 5,
    },
    icon: {
      fontSize: 18,
      color: config.color,
      marginRight: 12,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
    },
    message: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
      marginRight: 8,
    },
    actionButton: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: theme.borderRadius.sm,
    },
    actionText: {
      fontSize: 13,
      color: config.color,
      fontWeight: '600',
    },
    closeButton: {
      marginLeft: 8,
      padding: 4,
    },
    closeIcon: {
      fontSize: 18,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.toast,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.icon}>{config.icon}</Text>
        <View style={styles.content}>
          <Text style={styles.message}>{message}</Text>
        </View>
        {action && (
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              action.onPress();
              handleDismiss();
            }}
          >
            <Text style={styles.actionText}>{action.label}</Text>
          </Pressable>
        )}
        <Pressable style={styles.closeButton} onPress={handleDismiss}>
          <Text style={styles.closeIcon}>×</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

Toast.displayName = 'Toast';
