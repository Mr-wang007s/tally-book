import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ label, variant = 'primary', size = 'md' }: BadgeProps) {
  const { colors } = useTheme();

  const bgColor = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error
  }[variant];

  const containerStyle: ViewStyle = {
    backgroundColor: bgColor,
    borderRadius: size === 'sm' ? 4 : size === 'lg' ? 12 : 8,
    paddingHorizontal: size === 'sm' ? 6 : size === 'lg' ? 12 : 8,
    paddingVertical: size === 'sm' ? 2 : size === 'lg' ? 6 : 4
  };

  const textStyle: TextStyle = {
    color: 'white',
    fontSize: size === 'sm' ? 12 : size === 'lg' ? 16 : 14,
    fontWeight: '600'
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

export default Badge;