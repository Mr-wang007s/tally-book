import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  testID?: string;
}

export function Checkbox({ checked, onChange, testID }: CheckboxProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onChange(!checked)}
      testID={testID}
      style={{
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: checked ? colors.primary : colors.border,
        borderRadius: 4,
        backgroundColor: checked ? colors.primary : 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {checked && <View style={{ width: 12, height: 12, backgroundColor: 'white' }} />}
    </TouchableOpacity>
  );
}

export default Checkbox;
