/**
 * Loading Component
 * 
 * Loading states with spinner, skeleton screens, and progress indicators
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface LoadingProps {
  visible?: boolean;
  message?: string;
  type?: 'spinner' | 'skeleton' | 'progress';
  progress?: number;
  containerStyle?: ViewStyle;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  visible = true,
  message,
  type = 'spinner',
  progress,
  containerStyle,
  fullScreen = false,
}) => {
  const { theme } = useTheme();

  if (!visible) return null;

  const styles = StyleSheet.create({
    container: fullScreen
      ? {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }
      : {
          padding: 32,
          justifyContent: 'center',
          alignItems: 'center',
        },
    spinnerContainer: {
      alignItems: 'center',
    },
    message: {
      marginTop: 16,
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    progressContainer: {
      width: '100%',
      maxWidth: 200,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      overflow: 'hidden',
      marginBottom: 12,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    progressText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (type === 'progress' && progress !== undefined) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(Math.max(progress, 0), 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginBottom: message ? 12 : 0 }}
        />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

Loading.displayName = 'Loading';
