import React from 'react';
import { TouchableOpacity, Animated, View } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  testID?: string;
}

export function Switch({ value, onChange, testID }: SwitchProps) {
  const { colors } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      testID={testID}
      style={{
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: value ? colors.primary : colors.border,
        padding: 2,
        justifyContent: 'center'
      }}
    >
      <Animated.View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: 'white',
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 22]
              })
            }
          ]
        }}
      />
    </TouchableOpacity>
  );
}

export default Switch;
