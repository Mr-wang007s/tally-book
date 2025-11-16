import React from 'react';
import { View, ViewStyle } from 'react-native';

export interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Container({ children, style }: ContainerProps) {
  return (
    <View style={{ padding: 16, ...style }}>
      {children}
    </View>
  );
}

export default Container;
