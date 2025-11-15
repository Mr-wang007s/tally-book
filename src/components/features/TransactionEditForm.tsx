/**
 * TransactionEditForm Component
 * 
 * Form component for creating and editing transactions
 * Supports Light/Dark Mode, validation, and image picker
 * 
 * @module TransactionEditForm
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type {
  TransactionEditFormProps,
  TransactionType,
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@/types/transaction';

export function TransactionEditForm({
  transaction,
  accounts,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}: TransactionEditFormProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Form state
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
  const [type, setType] = useState<TransactionType>(transaction?.type || 'expense');
  const [fromAccount, setFromAccount] = useState(transaction?.fromAccount || null);
  const [toAccount, setToAccount] = useState(transaction?.toAccount || null);
  const [category, setCategory] = useState(transaction?.category || '');
  const [description, setDescription] = useState(transaction?.description || '');
  const [attachments, setAttachments] = useState<string[]>(transaction?.attachments || []);
  const [errors, setErrors] = useState<string[]>([]);

  const colors = {
    background: isDark ? '#000000' : '#FFFFFF',
    cardBackground: isDark ? '#1C1C1E' : '#F2F2F7',
    inputBackground: isDark ? '#2C2C2E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#000000',
    secondaryText: isDark ? '#AEAEB2' : '#6C6C70',
    border: isDark ? '#38383A' : '#E5E5EA',
    primary: isDark ? '#0A84FF' : '#007AFF',
    error: isDark ? '#FF453A' : '#FF3B30',
    success: isDark ? '#30D158' : '#34C759',
  };

  // Handle image picker
  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAttachments([...attachments, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Handle submit
  const handleSubmit = async () => {
    setErrors([]);

    // Basic validation
    const validationErrors: string[] = [];
    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      validationErrors.push('请输入有效的金额');
    }

    if (!category) {
      validationErrors.push('请选择分类');
    }

    // Account validation based on type
    if (type === 'income' && !toAccount) {
      validationErrors.push('收入交易需要选择收款账户');
    }
    if (type === 'expense' && !fromAccount) {
      validationErrors.push('支出交易需要选择付款账户');
    }
    if (type === 'transfer' && (!fromAccount || !toAccount)) {
      validationErrors.push('转账交易需要选择转出和转入账户');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Build input object
    const input: CreateTransactionInput | UpdateTransactionInput = transaction
      ? {
          id: transaction.id,
          amount: amountNum,
          type,
          fromAccount,
          toAccount,
          category,
          description: description.trim() || undefined,
          attachments: attachments.length > 0 ? attachments : undefined,
        }
      : {
          amount: amountNum,
          type,
          fromAccount,
          toAccount,
          category,
          description: description.trim() || undefined,
          attachments: attachments.length > 0 ? attachments : undefined,
        };

    try {
      await onSubmit(input);
    } catch (error) {
      setErrors([(error as Error).message || '保存失败']);
    }
  };

  // Filter accounts based on type
  const availableFromAccounts = type !== 'income' ? accounts : [];
  const availableToAccounts = type !== 'expense' ? accounts : [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onCancel}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="取消"
        >
          <Text style={[styles.headerButton, { color: colors.primary }]}>
            取消
          </Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {transaction ? '编辑交易' : '新建交易'}
        </Text>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="保存"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.headerButton, { color: colors.primary }]}>
              保存
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Errors */}
      {errors.length > 0 && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          {errors.map((error, index) => (
            <Text key={index} style={[styles.errorText, { color: colors.error }]}>
              • {error}
            </Text>
          ))}
        </View>
      )}

      {/* Amount */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.secondaryText }]}>
          金额 *
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={colors.secondaryText}
          accessibilityLabel="交易金额"
          allowFontScaling
          maxFontSizeMultiplier={2}
        />
      </View>

      {/* Type */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.secondaryText }]}>
          类型 *
        </Text>
        <View style={styles.typeButtonGroup}>
          {(['income', 'expense', 'transfer'] as TransactionType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeButton,
                type === t && { backgroundColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => setType(t)}
              accessibilityRole="button"
              accessibilityLabel={
                t === 'income' ? '收入' : t === 'expense' ? '支出' : '转账'
              }
            >
              <Text
                style={[
                  styles.typeButtonText,
                  { color: type === t ? '#FFFFFF' : colors.text },
                ]}
              >
                {t === 'income' ? '收入' : t === 'expense' ? '支出' : '转账'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Accounts */}
      {type !== 'income' && (
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>
            付款账户 *
          </Text>
          <View style={styles.accountButtons}>
            {availableFromAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountButton,
                  fromAccount === account.id && {
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary,
                  },
                  { borderColor: colors.border, backgroundColor: colors.inputBackground },
                ]}
                onPress={() => setFromAccount(account.id)}
              >
                <Text style={[styles.accountButtonText, { color: colors.text }]}>
                  {account.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {type !== 'expense' && (
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>
            收款账户 *
          </Text>
          <View style={styles.accountButtons}>
            {availableToAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountButton,
                  toAccount === account.id && {
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary,
                  },
                  { borderColor: colors.border, backgroundColor: colors.inputBackground },
                ]}
                onPress={() => setToAccount(account.id)}
              >
                <Text style={[styles.accountButtonText, { color: colors.text }]}>
                  {account.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Category */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.secondaryText }]}>
          分类 *
        </Text>
        <View style={styles.accountButtons}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.accountButton,
                category === cat.id && {
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary,
                },
                { borderColor: colors.border, backgroundColor: colors.inputBackground },
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Text style={[styles.accountButtonText, { color: colors.text }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.secondaryText }]}>
          描述
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: colors.inputBackground,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="添加备注..."
          placeholderTextColor={colors.secondaryText}
          multiline
          numberOfLines={4}
          accessibilityLabel="交易描述"
          allowFontScaling
          maxFontSizeMultiplier={2}
        />
      </View>

      {/* Attachments */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.secondaryText }]}>
          附件
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {attachments.map((uri, index) => (
            <View key={index} style={styles.attachmentContainer}>
              <Image source={{ uri }} style={styles.attachment} />
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: colors.error }]}
                onPress={() => handleRemoveImage(index)}
                accessibilityRole="button"
                accessibilityLabel="删除附件"
              >
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.addAttachmentButton, { borderColor: colors.border }]}
            onPress={handleAddImage}
            accessibilityRole="button"
            accessibilityLabel="添加附件"
          >
            <Ionicons name="add" size={32} color={colors.secondaryText} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerButton: {
    fontSize: 17,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 17,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  typeButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  accountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  accountButton: {
    paddingHorizontal: 16,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountButtonText: {
    fontSize: 15,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
  attachmentContainer: {
    marginRight: 12,
    position: 'relative',
  },
  attachment: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAttachmentButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
