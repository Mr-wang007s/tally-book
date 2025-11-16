import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export interface RadioProps {
  selected: boolean;
  onChange: (selected: boolean) => void;
  testID?: string;
}

export function Radio({ selected, onChange, testID }: RadioProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onChange(true)}
      testID={testID}
      style={{
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: selected ? colors.primary : colors.border,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {selected && (
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: colors.primary
          }}
        />
      )}
    </TouchableOpacity>
  );
}

export default Radio;
