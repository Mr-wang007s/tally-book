/**
 * TransactionForm Component
 * Form fields for creating/editing transactions
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FormField } from './FormField';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { TransactionType, CreateTransactionInput } from '@/models/transaction';
import { Category } from '@/models/category';
import { buttonA11y } from './A11y';

export interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: CreateTransactionInput) => void;
  initialType?: TransactionType;
}

export function TransactionForm({ categories, onSubmit, initialType = 'expense' }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount <= 0) {
      setErrors({ amount: 'Please enter a valid amount' });
      return;
    }
    if (!categoryId) {
      setErrors({ categoryId: 'Please select a category' });
      return;
    }

    const input: CreateTransactionInput = {
      type,
      amount: numAmount,
      date,
      categoryId,
      note: note || undefined,
      paymentMethod: paymentMethod || undefined,
    };

    onSubmit(input);
  };

  return (
    <View style={styles.container}>
      {/* Type Toggle */}
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
          onPress={() => {
            setType('expense');
            setCategoryId(''); // Reset category when type changes
          }}
          {...buttonA11y('Expense', 'Select expense transaction type')}
        >
          <Text
            style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}
          >
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
          onPress={() => {
            setType('income');
            setCategoryId(''); // Reset category when type changes
          }}
          {...buttonA11y('Income', 'Select income transaction type')}
        >
          <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Field */}
      <FormField
        label="Amount"
        required
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0.00"
        error={errors.amount}
      />

      {/* Date Field */}
      <FormField
        label="Date"
        required
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        error={errors.date}
      />

      {/* Category Picker (Simplified) */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Category <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.categoryGrid}>
          {filteredCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, categoryId === cat.id && styles.categoryChipActive]}
              onPress={() => setCategoryId(cat.id)}
              {...buttonA11y(cat.name, `Select ${cat.name} category`)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  categoryId === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.categoryId && <Text style={styles.error}>{errors.categoryId}</Text>}
      </View>

      {/* Note Field */}
      <FormField
        label="Note"
        value={note}
        onChangeText={setNote}
        placeholder="Optional note"
        multiline
        numberOfLines={3}
      />

      {/* Payment Method Field */}
      <FormField
        label="Payment Method"
        value={paymentMethod}
        onChangeText={setPaymentMethod}
        placeholder="Cash, Card, etc."
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        {...buttonA11y('Save Transaction', 'Save this transaction')}
      >
        <Text style={styles.submitButtonText}>Save Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  typeToggle: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    ...typography.subhead,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: colors.textOnPrimary,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.subhead,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  required: {
    color: colors.error,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    ...typography.callout,
    color: colors.textPrimary,
  },
  categoryChipTextActive: {
    color: colors.textOnPrimary,
  },
  error: {
    ...typography.caption1,
    color: colors.error,
    marginTop: spacing.xs,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  submitButtonText: {
    ...typography.headline,
    color: colors.textOnPrimary,
  },
});
