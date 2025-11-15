/**
 * OCRResultModal Component
 * OCR 识别结果展示和确认模态框
 * User Story 3: 拍照识别账单
 * 遵循 Constitution Principles I (HIG), IV (Accessibility)
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { formatAmount } from '@/utils/formatting';
import type { OCRResult } from '@/services/ocrApi';
import type { CreateExpenseDTO } from '@/types/expense';
import type { Category } from '@/types/category';

interface OCRResultModalProps {
  visible: boolean;
  result: { data: CreateExpenseDTO; rawOCR?: OCRResult } | null;
  categories: Category[];
  photoUri?: string;
  onConfirm: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export function OCRResultModal({
  visible,
  result,
  categories,
  photoUri,
  onConfirm,
  onEdit,
  onCancel,
}: OCRResultModalProps) {
  const { colors, typography, spacing } = useTheme();

  if (!result?.data) return null;

  const { data, rawOCR } = result;
  const category = categories.find((c) => c.id === data.categoryId);
  const confidence = data.confidence || 0;
  const isLowConfidence = confidence < 0.8;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
      accessibilityViewIsModal={true}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* 标题栏 */}
          <View style={[styles.header, { borderBottomColor: colors.separator }]}>
            <Text
              style={[
                styles.title,
                { color: colors.text, fontSize: typography.fontSize.headline },
              ]}
            >
              识别结果
            </Text>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="关闭"
            >
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 置信度警告 */}
            {isLowConfidence && (
              <Card variant="outlined" style={styles.warningCard}>
                <View style={styles.warningRow}>
                  <Icon name="warning" size={20} color={colors.warning} />
                  <Text
                    style={[
                      styles.warningText,
                      { color: colors.warning, fontSize: typography.fontSize.footnote },
                    ]}
                  >
                    识别置信度较低（{(confidence * 100).toFixed(0)}%），请仔细检查
                  </Text>
                </View>
              </Card>
            )}

            {/* 照片预览 */}
            {photoUri && (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="contain" />
              </View>
            )}

            {/* 识别信息 */}
            <Card variant="elevated" style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
                  ]}
                >
                  金额
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    styles.amountValue,
                    { color: colors.error, fontSize: typography.fontSize.title1 },
                  ]}
                  accessibilityLabel={`金额${formatAmount(data.amount)}`}
                >
                  {formatAmount(data.amount)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
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
                      styles.infoValue,
                      { color: colors.text, fontSize: typography.fontSize.body },
                    ]}
                  >
                    {category?.name || '未知'}
                  </Text>
                </View>
              </View>

              {data.merchant && (
                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
                    ]}
                  >
                    商家
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: colors.text, fontSize: typography.fontSize.body },
                    ]}
                  >
                    {data.merchant}
                  </Text>
                </View>
              )}

              {rawOCR?.rawText && (
                <View style={styles.rawTextContainer}>
                  <Text
                    style={[
                      styles.rawTextLabel,
                      { color: colors.textSecondary, fontSize: typography.fontSize.caption1 },
                    ]}
                  >
                    原始文本
                  </Text>
                  <ScrollView style={styles.rawTextScroll} nestedScrollEnabled>
                    <Text
                      style={[
                        styles.rawText,
                        { color: colors.textTertiary, fontSize: typography.fontSize.caption2 },
                      ]}
                    >
                      {rawOCR.rawText}
                    </Text>
                  </ScrollView>
                </View>
              )}
            </Card>
          </ScrollView>

          {/* 操作按钮 */}
          <View style={styles.actions}>
            <Button
              variant="outlined"
              onPress={onEdit}
              style={styles.actionButton}
              accessibilityLabel="修正识别结果"
            >
              修正
            </Button>
            <Button
              variant="primary"
              onPress={onConfirm}
              style={styles.actionButton}
              accessibilityLabel="确认并保存"
            >
              确认
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '90%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  warningCard: {
    marginBottom: 12,
    padding: 12,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontWeight: '500',
  },
  photoContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    height: 200,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontWeight: '500',
  },
  infoValue: {
    fontWeight: '600',
  },
  amountValue: {
    fontWeight: '700',
  },
  categoryValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rawTextContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  rawTextLabel: {
    fontWeight: '500',
    marginBottom: 8,
  },
  rawTextScroll: {
    maxHeight: 100,
  },
  rawText: {
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
