import React from 'react';
import { View } from 'react-native';
import SummaryCard from './SummaryCard';

export interface SummaryCardsProps {
  income: number;
  expense: number;
  balance: number;
}

export function SummaryCards({ income, expense, balance }: SummaryCardsProps) {
  return (
    <View style={{ gap: 12 }}>
      <SummaryCard
        title="总收入"
        value={`¥${income.toFixed(2)}`}
        type="income"
      />
      <SummaryCard
        title="总支出"
        value={`¥${expense.toFixed(2)}`}
        type="expense"
      />
      <SummaryCard
        title="余额"
        value={`¥${balance.toFixed(2)}`}
        type="balance"
      />
    </View>
  );
}

export default SummaryCards;
