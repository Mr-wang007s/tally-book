import React from 'react';
import { View, Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 30, color }: SpinnerProps) {
  const { colors } = useTheme();
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: (color || colors.primary) + '30',
        borderTopColor: color || colors.primary,
        transform: [{ rotate: spin }]
      }}
    />
  );
}

export default Spinner;
