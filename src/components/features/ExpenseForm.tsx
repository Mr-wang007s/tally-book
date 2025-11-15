/**
 * ExpenseForm Component
 * 支出表单组件 - 键盘输入记账
 * 遵循 Constitution Principles I (HIG), IV (Accessibility), VII (Keyboard)
 */

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CategoryPicker } from './CategoryPicker';
import { formatAmount, parseAmount } from '@/utils/formatting';
import { validateCreateExpenseDTO, isLargeAmount } from '@/utils/validation';
import { InputMethod } from '@/types/expense';
import type { CreateExpenseDTO } from '@/types/expense';
import type { Category } from '@/types/category';

export interface ExpenseFormProps {
  onSubmit: (dto: CreateExpenseDTO) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<CreateExpenseDTO>;
}

/**
 * ExpenseForm Ref 接口 (用于外部控制表单)
 */
export interface ExpenseFormRef {
  /**
   * 填充表单数据
   */
  fillForm: (data: Partial<CreateExpenseDTO>) => void;
  
  /**
   * 重置表单
   */
  reset: () => void;
}

export const ExpenseForm = forwardRef<ExpenseFormRef, ExpenseFormProps>(
  ({ onSubmit, onCancel, initialData }, ref) => {
    const { colors, typography, spacing } = useTheme();
    
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
    const [note, setNote] = useState(initialData?.note || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      fillForm: (data: Partial<CreateExpenseDTO>) => {
        if (data.amount !== undefined) {
          setAmount(data.amount.toString());
        }
        if (data.categoryId) {
          setCategoryId(data.categoryId);
        }
        if (data.note !== undefined) {
          setNote(data.note);
        }
      },
      reset: () => {
        setAmount('');
        setCategoryId('');
        setNote('');
        setErrors({});
      },
    }));

    // 金额格式化处理
    const handleAmountChange = (text: string) => {
      // 只允许数字和小数点
      const cleaned = text.replace(/[^0-9.]/g, '');
      setAmount(cleaned);
      
      // 清除金额错误
      if (errors.amount) {
        setErrors((prev) => ({ ...prev, amount: '' }));
      }
    };

    const handleAmountBlur = () => {
      if (amount) {
        const num = parseAmount(amount);
        setAmount(num.toFixed(2));
      }
    };

    const handleCategorySelect = (category: Category) => {
      setCategoryId(category.id);
      
      // 清除类别错误
      if (errors.categoryId) {
        setErrors((prev) => ({ ...prev, categoryId: '' }));
      }
    };

    const handleSubmit = async () => {
      const dto: CreateExpenseDTO = {
        amount: parseAmount(amount),
        categoryId,
        note: note.trim(),
        inputMethod: InputMethod.KEYBOARD,
      };

      // 验证
      const validationErrors = validateCreateExpenseDTO(dto);
      if (validationErrors.length > 0) {
        const errorMap: Record<string, string> = {};
        validationErrors.forEach((err) => {
          if (err.includes('金额')) errorMap.amount = err;
          if (err.includes('类别')) errorMap.categoryId = err;
          if (err.includes('备注')) errorMap.note = err;
        });
        setErrors(errorMap);
        return;
      }

      // 异常大额确认
      if (isLargeAmount(dto.amount)) {
        // TODO: 显示确认对话框
        // 暂时允许提交
      }

      setIsSubmitting(true);
      try {
        await onSubmit(dto);
        
        // 清空表单
        setAmount('');
        setCategoryId('');
        setNote('');
        setErrors({});
      } catch (error) {
        setErrors({
          submit: error instanceof Error ? error.message : '提交失败',
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    const isValid = amount && categoryId && !Object.keys(errors).length;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount Input */}
          <View style={styles.formGroup}>
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
              ]}
            >
              金额
            </Text>
            <Input
              value={amount}
              onChangeText={handleAmountChange}
              onBlur={handleAmountBlur}
              placeholder="0.00"
              keyboardType="decimal-pad"
              returnKeyType="next"
              error={errors.amount}
              accessibilityLabel="输入支出金额"
              accessibilityHint="使用数字键盘输入金额"
              leftIcon={
                <Text style={{ color: colors.textSecondary, fontSize: 18 }}>¥</Text>
              }
            />
            {amount && !errors.amount && (
              <Text
                style={[
                  styles.formattedAmount,
                  { color: colors.textSecondary, fontSize: typography.fontSize.footnote },
                ]}
              >
                {formatAmount(parseAmount(amount))}
              </Text>
            )}
          </View>

          {/* Category Picker */}
          <View style={styles.formGroup}>
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
              ]}
            >
              类别
            </Text>
            <CategoryPicker
              selectedCategoryId={categoryId}
              onSelectCategory={handleCategorySelect}
              placeholder="选择支出类别"
            />
            {errors.categoryId && (
              <Text
                style={[
                  styles.errorText,
                  { color: colors.error, fontSize: typography.fontSize.footnote },
                ]}
              >
                {errors.categoryId}
              </Text>
            )}
          </View>

          {/* Note Input */}
          <View style={styles.formGroup}>
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
              ]}
            >
              备注 (可选)
            </Text>
            <Input
              value={note}
              onChangeText={setNote}
              placeholder="添加备注..."
              maxLength={200}
              multiline
              numberOfLines={3}
              returnKeyType="done"
              error={errors.note}
              accessibilityLabel="输入备注"
            />
            <Text
              style={[
                styles.characterCount,
                { color: colors.textTertiary, fontSize: typography.fontSize.caption1 },
              ]}
            >
              {note.length}/200
            </Text>
          </View>

          {/* Submit Error */}
          {errors.submit && (
            <Text
              style={[
                styles.submitError,
                { color: colors.error, fontSize: typography.fontSize.body },
              ]}
            >
              {errors.submit}
            </Text>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            {onCancel && (
              <Button
                title="取消"
                variant="outline"
                onPress={onCancel}
                disabled={isSubmitting}
                style={styles.actionButton}
              />
            )}
            <Button
              title="保存"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
              style={styles.actionButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  formattedAmount: {
    marginTop: 4,
  },
  errorText: {
    marginTop: 4,
  },
  characterCount: {
    marginTop: 4,
    textAlign: 'right',
  },
  submitError: {
    marginBottom: 16,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
});
