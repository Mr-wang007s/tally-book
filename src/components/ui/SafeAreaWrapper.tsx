/**
 * SafeAreaWrapper Component
 * 遵循 Constitution Principle VII (Safe Areas)
 */

import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export interface SafeAreaWrapperProps extends ViewProps {
  children: React.ReactNode;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}

export function SafeAreaWrapper({
  children,
  edges = ['top', 'bottom'],
  style,
  ...props
}: SafeAreaWrapperProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor: colors.background }, style]}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
