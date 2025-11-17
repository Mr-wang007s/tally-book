/**
 * TransactionForm: Add/Edit transaction form using i18n and unified FormField
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from '@/i18n/useTranslation';
import { FormField } from './FormField';
import Button from '../ui/Button';
import Select, { SelectOption } from '../ui/Select';
import { validateAmount, validateDate, validateCategory, validateType } from './FormValidation';

export interface TransactionFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialValues?: any;
  isLoading?: boolean;
}

export function TransactionForm({
  onSubmit,
  initialValues = {},
  isLoading = false
}: TransactionFormProps) {
  const { t } = useTranslation();
  
  const [type, setType] = useState<'income' | 'expense'>(initialValues.type || 'expense');
  const [amount, setAmount] = useState(String(initialValues.amount || ''));
  const [date, setDate] = useState<Date>(initialValues.date || new Date());
  const [category, setCategory] = useState(initialValues.categoryId || '');
  const [note, setNote] = useState(initialValues.note || '');
  const [paymentMethod, setPaymentMethod] = useState(initialValues.paymentMethod || 'cash');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const typeOptions: SelectOption[] = [
    { label: t('transactions.types.income'), value: 'income' },
    { label: t('transactions.types.expense'), value: 'expense' }
  ];

  const categoryOptions: SelectOption[] = type === 'income'
    ? [
        { label: t('categories.income.salary'), value: 'salary' },
        { label: t('categories.income.bonus'), value: 'bonus' },
        { label: t('categories.income.investment'), value: 'investment' },
        { label: t('categories.income.other'), value: 'other' }
      ]
    : [
        { label: t('categories.expense.food'), value: 'food' },
        { label: t('categories.expense.transportation'), value: 'transportation' },
        { label: t('categories.expense.shopping'), value: 'shopping' },
        { label: t('categories.expense.entertainment'), value: 'entertainment' },
        { label: t('categories.expense.utilities'), value: 'utilities' },
        { label: t('categories.expense.healthcare'), value: 'healthcare' },
        { label: t('categories.expense.education'), value: 'education' },
        { label: t('categories.expense.other'), value: 'other' }
      ];

  const paymentOptions: SelectOption[] = [
    { label: t('transactions.paymentMethods.cash'), value: 'cash' },
    { label: t('transactions.paymentMethods.creditCard'), value: 'creditCard' },
    { label: t('transactions.paymentMethods.debitCard'), value: 'debitCard' },
    { label: t('transactions.paymentMethods.bankTransfer'), value: 'bankTransfer' },
    { label: t('transactions.paymentMethods.mobilePayment'), value: 'mobilePayment' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const typeValidation = validateType(type);
    if (!typeValidation.isValid) {
      newErrors.type = typeValidation.error || '';
    }

    const amountValidation = validateAmount(amount);
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.error || '';
    }

    const dateValidation = validateDate(date);
    if (!dateValidation.isValid) {
      newErrors.date = dateValidation.error || '';
    }

    const categoryValidation = validateCategory(category);
    if (!categoryValidation.isValid) {
      newErrors.category = categoryValidation.error || '';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Haptic warning for validation errors
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch (e) {}
      return;
    }

    try {
      await onSubmit({
        type,
        amount: parseFloat(amount),
        date,
        categoryId: category,
        note,
        paymentMethod
      });

      // Haptic success feedback
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {}
    } catch (error) {
      console.error('Form submission error:', error);
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (e) {}
    }
  };

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <View>
        <Select
          options={typeOptions}
          value={type}
          onValueChange={(val) => {
            setType(val);
            setCategory(''); // Reset category when type changes
          }}
        />
      </View>

      <FormField
        label={t('transactions.fields.amount')}
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
        error={errors.amount}
        isRequired
      />

      <FormField
        label={t('transactions.fields.date')}
        value={date.toLocaleDateString('zh-CN')}
        onChangeText={() => {}}
        isDisabled
        error={errors.date}
        isRequired
      />

      <View>
        <Select
          options={categoryOptions}
          value={category}
          onValueChange={setCategory}
          placeholder={t('common.select')}
        />
      </View>

      <FormField
        label={t('transactions.fields.note')}
        value={note}
        onChangeText={setNote}
        placeholder={t('transactions.fields.note')}
        multiline
        maxLength={500}
      />

      <View>
        <Select
          options={paymentOptions}
          value={paymentMethod}
          onValueChange={setPaymentMethod}
        />
      </View>

      <Button
        title={isLoading ? t('common.loading') : t('common.save')}
        onPress={handleSubmit}
        isLoading={isLoading}
        isDisabled={isLoading}
        variant="primary"
      />
    </View>
  );
}

export default TransactionForm;
