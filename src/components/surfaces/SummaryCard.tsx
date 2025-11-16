import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import Card from '../ui/Card';

export interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  type?: 'income' | 'expense' | 'balance';
}

export function SummaryCard({ title, value, subtitle, icon, type = 'balance' }: SummaryCardProps) {
  const { colors } = useTheme();

  const iconColor = {
    income: colors.success,
    expense: colors.error,
    balance: colors.primary
  }[type];

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {icon && <View style={{ tintColor: iconColor }}>{icon}</View>}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>{title}</Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
            {value}
          </Text>
          {subtitle && (
            <Text style={{ fontSize: 10, color: colors.textSecondary }}>{subtitle}</Text>
          )}
        </View>
      </View>
    </Card>
  );
}

export default SummaryCard;
