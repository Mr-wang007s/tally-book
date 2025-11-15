/**
 * ExpenseDetailScreen - 支出详情页
 * User Story 3: 拍照识别账单 - 照片查看
 * 遵循 Constitution Principles I (HIG), VII (Safe Areas)
 */

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useTheme } from '@/hooks/useTheme';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { formatAmount, formatDate } from '@/utils/formatting';
import { InputMethod } from '@/types/expense';

export default function ExpenseDetailScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { expenses, deleteExpense } = useExpenses();
  const { categories } = useCategories();

  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>支出记录不存在</Text>
          <Button variant="primary" onPress={() => router.back()} style={styles.backButton}>
            返回
          </Button>
        </View>
      </SafeAreaWrapper>
    );
  }

  const category = categories.find((c) => c.id === expense.categoryId);

  const inputMethodLabels = {
    [InputMethod.KEYBOARD]: '键盘输入',
    [InputMethod.VOICE]: '语音输入',
    [InputMethod.PHOTO]: '拍照识别',
  };

  const handleDelete = () => {
    Alert.alert('确认删除', '确定要删除这笔支出吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExpense(expense.id);
            router.back();
          } catch (error) {
            Alert.alert('错误', '删除失败');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 照片（如果有）*/}
        {expense.photoUri && (
          <Card variant="flat" style={styles.photoCard}>
            <Image source={{ uri: expense.photoUri }} style={styles.photo} resizeMode="contain" />
          </Card>
        )}

        {/* 金额卡片 */}
        <Card variant="elevated" style={styles.amountCard}>
          <Text
            style={[
              styles.amountLabel,
              { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
            ]}
          >
            支出金额
          </Text>
          <Text
            style={[
              styles.amountValue,
              { color: colors.error, fontSize: typography.fontSize.largeTitle },
            ]}
            accessibilityLabel={`支出金额${formatAmount(expense.amount)}`}
          >
            {formatAmount(expense.amount)}
          </Text>
        </Card>

        {/* 详细信息卡片 */}
        <Card variant="outlined" style={styles.detailsCard}>
          {/* 类别 */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
              ]}
            >
              类别
            </Text>
            <View style={styles.categoryValue}>
              <Icon
                name={category?.icon || 'help-circle'}
                size={20}
                color={category?.color || colors.textSecondary}
              />
              <Text
                style={[
                  styles.detailValue,
                  { color: colors.text, fontSize: typography.fontSize.body },
                ]}
              >
                {category?.name || '未知'}
              </Text>
            </View>
          </View>

          {/* 时间 */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
              ]}
            >
              时间
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: colors.text, fontSize: typography.fontSize.body },
              ]}
            >
              {formatDate(new Date(expense.timestamp))}
            </Text>
          </View>

          {/* 输入方式 */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
              ]}
            >
              输入方式
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: colors.text, fontSize: typography.fontSize.body },
              ]}
            >
              {inputMethodLabels[expense.inputMethod]}
            </Text>
          </View>

          {/* 商家（如果有）*/}
          {expense.merchant && (
            <View style={styles.detailRow}>
              <Text
                style={[
                  styles.detailLabel,
                  { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
                ]}
              >
                商家
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: colors.text, fontSize: typography.fontSize.body },
                ]}
              >
                {expense.merchant}
              </Text>
            </View>
          )}

          {/* 备注（如果有）*/}
          {expense.note && (
            <View style={[styles.detailRow, styles.noteRow]}>
              <Text
                style={[
                  styles.detailLabel,
                  { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
                ]}
              >
                备注
              </Text>
              <Text
                style={[
                  styles.noteValue,
                  { color: colors.text, fontSize: typography.fontSize.body },
                ]}
              >
                {expense.note}
              </Text>
            </View>
          )}

          {/* 识别置信度（如果有）*/}
          {expense.confidence !== undefined && (
            <View style={styles.detailRow}>
              <Text
                style={[
                  styles.detailLabel,
                  { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
                ]}
              >
                识别置信度
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: colors.text, fontSize: typography.fontSize.body },
                ]}
              >
                {(expense.confidence * 100).toFixed(0)}%
              </Text>
            </View>
          )}
        </Card>

        {/* 原始识别文本（如果有）*/}
        {expense.rawText && (
          <Card variant="outlined" style={styles.rawTextCard}>
            <Text
              style={[
                styles.rawTextLabel,
                { color: colors.textSecondary, fontSize: typography.fontSize.caption1 },
              ]}
            >
              原始识别文本
            </Text>
            <Text
              style={[
                styles.rawText,
                { color: colors.textTertiary, fontSize: typography.fontSize.caption2 },
              ]}
            >
              {expense.rawText}
            </Text>
          </Card>
        )}

        {/* 删除按钮 */}
        <Button variant="destructive" onPress={handleDelete} style={styles.deleteButton}>
          删除此记录
        </Button>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    marginTop: 16,
  },
  photoCard: {
    marginBottom: 16,
    height: 250,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  amountCard: {
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
  },
  amountLabel: {
    fontWeight: '500',
    marginBottom: 8,
  },
  amountValue: {
    fontWeight: '700',
  },
  detailsCard: {
    marginBottom: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  noteRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontWeight: '500',
  },
  detailValue: {
    fontWeight: '600',
  },
  categoryValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noteValue: {
    marginTop: 8,
    lineHeight: 20,
  },
  rawTextCard: {
    marginBottom: 16,
    padding: 16,
  },
  rawTextLabel: {
    fontWeight: '500',
    marginBottom: 8,
  },
  rawText: {
    lineHeight: 18,
  },
  deleteButton: {
    marginBottom: 24,
  },
});
