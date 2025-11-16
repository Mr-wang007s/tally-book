/**
 * Alert Component
 * 
 * Prominent alert messages for important notifications
 * Supports success, error, warning, and info types with optional actions
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  onDismiss?: () => void;
  actions?: Array<{
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  style?: ViewStyle;
  dismissible?: boolean;
}

const typeConfig = {
  success: {
    icon: '✓',
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
    textColor: '#047857',
    accentColor: '#10b981',
  },
  error: {
    icon: '✕',
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    textColor: '#991b1b',
    accentColor: '#ef4444',
  },
  warning: {
    icon: '⚠',
    backgroundColor: '#fffbeb',
    borderColor: '#f59e0b',
    textColor: '#92400e',
    accentColor: '#f59e0b',
  },
  info: {
    icon: 'ℹ',
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    textColor: '#1e40af',
    accentColor: '#3b82f6',
  },
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onDismiss,
  actions,
  style,
  dismissible = true,
}) => {
  const { theme } = useTheme();
  const config = typeConfig[type];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: config.backgroundColor,
      borderWidth: 1,
      borderColor: config.borderColor,
      borderRadius: theme.borderRadius.md,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
    },
    iconContainer: {
      marginRight: 12,
      paddingTop: 2,
    },
    icon: {
      fontSize: 20,
      color: config.accentColor,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: config.textColor,
      marginBottom: 4,
    },
    message: {
      fontSize: 14,
      color: config.textColor,
      lineHeight: 20,
      marginBottom: actions || dismissible ? 12 : 0,
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: dismissible ? 12 : 0,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.sm,
    },
    primaryAction: {
      backgroundColor: config.accentColor,
    },
    secondaryAction: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: config.borderColor,
    },
    actionText: {
      fontSize: 13,
      fontWeight: '600',
    },
    primaryActionText: {
      color: '#ffffff',
    },
    secondaryActionText: {
      color: config.accentColor,
    },
    dismissButton: {
      marginLeft: 8,
      padding: 4,
    },
    dismissIcon: {
      fontSize: 20,
      color: config.textColor,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{config.icon}</Text>
      </View>
      <View style={styles.content}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>
        {actions && actions.length > 0 && (
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <Pressable
                key={index}
                style={[
                  styles.actionButton,
                  action.variant === 'primary'
                    ? styles.primaryAction
                    : styles.secondaryAction,
                ]}
                onPress={action.onPress}
              >
                <Text
                  style={[
                    styles.actionText,
                    action.variant === 'primary'
                      ? styles.primaryActionText
                      : styles.secondaryActionText,
                  ]}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      {dismissible && (
        <Pressable style={styles.dismissButton} onPress={onDismiss}>
          <Text style={styles.dismissIcon}>×</Text>
        </Pressable>
      )}
    </View>
  );
};

Alert.displayName = 'Alert';
