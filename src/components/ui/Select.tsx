import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export interface SelectOption {
  label: string;
  value: any;
}

export interface SelectProps {
  options: SelectOption[];
  value?: any;
  onValueChange: (value: any) => void;
  placeholder?: string;
  testID?: string;
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = '选择...',
  testID
}: SelectProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <View testID={testID}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: colors.surface
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16 }}>{selectedLabel}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={{ marginTop: 4, backgroundColor: colors.surface, borderRadius: 8 }}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              style={{ padding: 12, borderBottomWidth: 1, borderColor: colors.border }}
            >
              <Text style={{ color: colors.text }}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default Select;
