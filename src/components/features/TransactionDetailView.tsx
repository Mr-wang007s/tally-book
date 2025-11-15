/**
 * TransactionDetailView Component
 * 
 * Presentational component that displays transaction details
 * Supports Light/Dark Mode and full accessibility
 * 
 * @module TransactionDetailView
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TransactionDetailViewProps } from '@/types/transaction';

export function TransactionDetailView({
  transaction,
  accounts,
  categories,
  onEdit,
  onDelete,
  onBack,
  onAttachmentPress,
}: TransactionDetailViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#000000' : '#FFFFFF',
    cardBackground: isDark ? '#1C1C1E' : '#F2F2F7',
    text: isDark ? '#FFFFFF' : '#000000',
    secondaryText: isDark ? '#AEAEB2' : '#6C6C70',
    border: isDark ? '#38383A' : '#E5E5EA',
    primary: isDark ? '#0A84FF' : '#007AFF',
    income: isDark ? '#30D158' : '#34C759',
    expense: isDark ? '#FF453A' : '#FF3B30',
    transfer: isDark ? '#0A84FF' : '#007AFF',
  };

  // Get transaction type color
  const typeColor =
    transaction.type === 'income'
      ? colors.income
      : transaction.type === 'expense'
      ? colors.expense
      : colors.transfer;

  // Format timestamp
  const date = new Date(transaction.timestamp);
  const dateStr = date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Get account and category names
  const fromAccountName = transaction.fromAccount
    ? accounts[transaction.fromAccount]?.name || 'Unknown'
    : null;
  const toAccountName = transaction.toAccount
    ? accounts[transaction.toAccount]?.name || 'Unknown'
    : null;
  const categoryData = categories[transaction.category];
  const categoryName = categoryData?.name || 'Unknown';

  // Type label
  const typeLabel =
    transaction.type === 'income'
      ? '收入'
      : transaction.type === 'expense'
      ? '支出'
      : '转账';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="返回"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>交易详情</Text>

        <TouchableOpacity
          onPress={onDelete}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="删除交易"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={24} color={colors.expense} />
        </TouchableOpacity>
      </View>

      {/* Amount */}
      <View style={styles.amountSection}>
        <Text style={[styles.amountLabel, { color: colors.secondaryText }]}>
          {typeLabel}金额
        </Text>
        <Text
          style={[styles.amount, { color: typeColor }]}
          accessibilityLabel={`${typeLabel}金额 ${transaction.amount} 元`}
          allowFontScaling
          maxFontSizeMultiplier={2}
        >
          ¥{transaction.amount.toFixed(2)}
        </Text>
      </View>

      {/* Details Card */}
      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        {/* Date & Time */}
        <DetailRow
          label="日期"
          value={dateStr}
          colors={colors}
          accessibilityLabel={`日期 ${dateStr}`}
        />
        <DetailRow
          label="时间"
          value={timeStr}
          colors={colors}
          accessibilityLabel={`时间 ${timeStr}`}
        />

        {/* Type */}
        <DetailRow
          label="类型"
          value={typeLabel}
          colors={colors}
          valueColor={typeColor}
          accessibilityLabel={`类型 ${typeLabel}`}
        />

        {/* Accounts */}
        {fromAccountName && (
          <DetailRow
            label="从账户"
            value={fromAccountName}
            colors={colors}
            accessibilityLabel={`从账户 ${fromAccountName}`}
          />
        )}
        {toAccountName && (
          <DetailRow
            label="到账户"
            value={toAccountName}
            colors={colors}
            accessibilityLabel={`到账户 ${toAccountName}`}
          />
        )}

        {/* Category */}
        <DetailRow
          label="分类"
          value={categoryName}
          colors={colors}
          accessibilityLabel={`分类 ${categoryName}`}
        />

        {/* Description */}
        {transaction.description && (
          <View style={styles.descriptionRow}>
            <Text style={[styles.label, { color: colors.secondaryText }]}>
              描述
            </Text>
            <Text
              style={[styles.description, { color: colors.text }]}
              accessibilityLabel={`描述 ${transaction.description}`}
              allowFontScaling
              maxFontSizeMultiplier={2}
            >
              {transaction.description}
            </Text>
          </View>
        )}
      </View>

      {/* Attachments */}
      {transaction.attachments && transaction.attachments.length > 0 && (
        <View style={styles.attachmentsSection}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            附件
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {transaction.attachments.map((uri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onAttachmentPress?.(uri, index)}
                accessibilityRole="button"
                accessibilityLabel={`查看附件 ${index + 1}`}
              >
                <Image
                  source={{ uri }}
                  style={styles.attachment}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Edit Button */}
      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: colors.primary }]}
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel="编辑交易"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.editButtonText}>编辑</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  colors: any;
  valueColor?: string;
  accessibilityLabel?: string;
}

function DetailRow({ label, value, colors, valueColor, accessibilityLabel }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.label, { color: colors.secondaryText }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.value,
          { color: valueColor || colors.text },
        ]}
        accessibilityLabel={accessibilityLabel}
        allowFontScaling
        maxFontSizeMultiplier={2}
      >
        {value}
      </Text>
    </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 15,
    marginBottom: 8,
  },
  amount: {
    fontSize: 48,
    fontWeight: '700',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  descriptionRow: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 15,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  attachmentsSection: {
    marginBottom: 24,
  },
  attachment: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  editButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
