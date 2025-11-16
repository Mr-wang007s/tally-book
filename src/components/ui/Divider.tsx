import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export interface DividerProps {
  style?: ViewStyle;
}

export function Divider({ style }: DividerProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.border,
        ...style
      }}
    />
  );
}

export default Divider;
