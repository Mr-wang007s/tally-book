/**
 * Edit Transaction Screen
 * Allows users to edit or delete existing transactions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FormField } from '@/components/FormField';
import { Category } from '@/models/category';
import { Transaction, TransactionType, UpdateTransactionInput } from '@/models/transaction';
import {
  loadCategories,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '@/services/transactions';
import { showDeleteConfirm } from '@/components/Confirm';
import { colors, spacing, typography, radius } from '@/theme/tokens';
import { buttonA11y } from '@/components/A11y';

export default function EditTransactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const transactionId = params.id as string;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  const loadData = async () => {
    try {
      const [txn, cats] = await Promise.all([
        getTransactionById(transactionId),
        loadCategories(),
      ]);

      if (!txn) {
        Alert.alert('Error', 'Transaction not found', [{ text: 'OK', onPress: () => router.back() }]);
        return;
      }

      setTransaction(txn);
      setCategories(cats);

      // Initialize form
      setType(txn.type);
      setAmount(txn.amount.toString());
      setDate(txn.date);
      setCategoryId(txn.categoryId);
      setNote(txn.note || '');
      setPaymentMethod(txn.paymentMethod || '');
    } catch (error) {
      console.error('Error loading transaction:', error);
      Alert.alert('Error', 'Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const numAmount = parseFloat(amount);

    if (!numAmount || numAmount <= 0) {
      setErrors({ amount: 'Please enter a valid amount' });
      return;
    }
    if (!categoryId) {
      setErrors({ categoryId: 'Please select a category' });
      return;
    }

    const updates: UpdateTransactionInput = {
      type,
      amount: numAmount,
      date,
      categoryId,
      note: note || undefined,
      paymentMethod: paymentMethod || undefined,
    };

    try {
      await updateTransaction(transactionId, updates);
      Alert.alert('Success', 'Transaction updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update transaction');
    }
  };

  const handleDelete = () => {
    showDeleteConfirm('transaction', async () => {
      try {
        await deleteTransaction(transactionId);
        Alert.alert('Deleted', 'Transaction deleted successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } catch (error) {
        console.error('Error deleting transaction:', error);
        Alert.alert('Error', 'Failed to delete transaction');
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!transaction) {
    return null;
  }

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Type Toggle */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
            onPress={() => {
              setType('expense');
              setCategoryId('');
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
              setCategoryId('');
            }}
            {...buttonA11y('Income', 'Select income transaction type')}
          >
            <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <FormField
          label="Amount"
          required
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          error={errors.amount}
        />

        <FormField
          label="Date"
          required
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          error={errors.date}
        />

        {/* Category Selector */}
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

        <FormField
          label="Note"
          value={note}
          onChangeText={setNote}
          placeholder="Optional note"
          multiline
          numberOfLines={3}
        />

        <FormField
          label="Payment Method"
          value={paymentMethod}
          onChangeText={setPaymentMethod}
          placeholder="Cash, Card, etc."
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          {...buttonA11y('Save Changes', 'Save changes to this transaction')}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          {...buttonA11y('Delete Transaction', 'Delete this transaction permanently')}
        >
          <Text style={styles.deleteButtonText}>Delete Transaction</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
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
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonText: {
    ...typography.headline,
    color: colors.textOnPrimary,
  },
  deleteButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  deleteButtonText: {
    ...typography.headline,
    color: colors.textOnPrimary,
  },
});
