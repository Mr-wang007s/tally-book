/**
 * TimeRangeSelector Component
 * 时间范围选择器（日/周/月/年）
 * User Story 4: 支出趋势统计与可视化
 * 遵循 Constitution Principles I (HIG), IV (Accessibility)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { TimeRange } from '@/types/statistics';

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TIME_RANGES = [
  { value: TimeRange.DAY, label: '日' },
  { value: TimeRange.WEEK, label: '周' },
  { value: TimeRange.MONTH, label: '月' },
  { value: TimeRange.YEAR, label: '年' },
];

export function TimeRangeSelector({ selected, onChange }: TimeRangeSelectorProps) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={styles.container}>
      {TIME_RANGES.map((range) => {
        const isSelected = selected === range.value;
        return (
          <TouchableOpacity
            key={range.value}
            style={[
              styles.button,
              {
                backgroundColor: isSelected ? colors.primary : 'transparent',
                borderColor: colors.border,
              },
            ]}
            onPress={() => onChange(range.value)}
            accessibilityRole="button"
            accessibilityLabel={`选择${range.label}视图`}
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: isSelected ? colors.background : colors.text,
                  fontSize: typography.fontSize.subhead,
                },
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Constitution Principle IV: 触摸目标 ≥44pt
  },
  buttonText: {
    fontWeight: '600',
  },
});
