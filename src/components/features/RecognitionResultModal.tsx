/**
 * RecognitionResultModal Component
 * 语音识别结果确认模态框
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import type { NLPResult } from '@/services/nlpService';
import type { Category } from '@/types/category';
import { formatAmount } from '@/utils/formatting';

export interface RecognitionResultModalProps {
  /**
   * 是否可见
   */
  visible: boolean;
  
  /**
   * NLP 识别结果
   */
  result: NLPResult | null;
  
  /**
   * 类别列表 (用于显示类别名称)
   */
  categories: Category[];
  
  /**
   * 确认回调
   */
  onConfirm: () => void;
  
  /**
   * 修正回调
   */
  onEdit: () => void;
  
  /**
   * 取消回调
   */
  onCancel: () => void;
}

/**
 * RecognitionResultModal 组件
 */
export function RecognitionResultModal({
  visible,
  result,
  categories,
  onConfirm,
  onEdit,
  onCancel,
}: RecognitionResultModalProps) {
  const { colors } = useTheme();
  
  if (!result || !result.data) {
    return null;
  }
  
  // 查找类别
  const category = categories.find((cat) => cat.id === result.data?.categoryId);
  
  // 置信度颜色
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return colors.success;
    if (confidence >= 0.8) return colors.warning;
    return colors.error;
  };
  
  const confidenceColor = getConfidenceColor(result.confidence);
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* 标题 */}
          <View style={styles.header}>
            <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>
              识别结果
            </Text>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="关闭"
            >
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {/* 识别内容 */}
          <ScrollView style={styles.content}>
            {/* 原始文本 */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                识别文本
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                "{result.originalText}"
              </Text>
            </View>
            
            {/* 置信度 */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                置信度
              </Text>
              <View style={styles.confidenceContainer}>
                <View
                  style={[
                    styles.confidenceBar,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.confidenceFill,
                      {
                        width: `${result.confidence * 100}%`,
                        backgroundColor: confidenceColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.confidenceText, { color: confidenceColor }]}>
                  {(result.confidence * 100).toFixed(0)}%
                </Text>
              </View>
            </View>
            
            {/* 提取信息 */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                提取信息
              </Text>
              
              {/* 金额 */}
              {result.data.amount && (
                <View style={styles.infoRow}>
                  <Ionicons name="cash-outline" size={20} color={colors.primary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    金额:
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {formatAmount(result.data.amount)}
                  </Text>
                </View>
              )}
              
              {/* 类别 */}
              {category && (
                <View style={styles.infoRow}>
                  <Ionicons
                    name={category.icon as any}
                    size={20}
                    color={category.color}
                  />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    类别:
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {category.name}
                  </Text>
                </View>
              )}
              
              {/* 备注 */}
              {result.data.note && (
                <View style={styles.infoRow}>
                  <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    备注:
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {result.data.note}
                  </Text>
                </View>
              )}
            </View>
            
            {/* 错误提示 */}
            {result.errors.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.error }]}>
                  注意事项
                </Text>
                {result.errors.map((error, index) => (
                  <Text
                    key={index}
                    style={[styles.errorText, { color: colors.error }]}
                  >
                    • {error}
                  </Text>
                ))}
              </View>
            )}
            
            {/* 低置信度提示 */}
            {result.confidence < 0.8 && (
              <View
                style={[
                  styles.warningBox,
                  { backgroundColor: colors.warning + '20' },
                ]}
              >
                <Ionicons name="warning" size={20} color={colors.warning} />
                <Text style={[styles.warningText, { color: colors.warning }]}>
                  识别置信度较低，建议检查并修正信息
                </Text>
              </View>
            )}
          </ScrollView>
          
          {/* 操作按钮 */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onEdit}
              style={[
                styles.button,
                styles.editButton,
                { backgroundColor: colors.border },
              ]}
              accessibilityRole="button"
              accessibilityLabel="修正信息"
            >
              <Ionicons name="create-outline" size={20} color={colors.text} />
              <Text style={[styles.buttonText, { color: colors.text }]}>
                修正
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={onConfirm}
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: colors.primary },
              ]}
              accessibilityRole="button"
              accessibilityLabel="确认并保存"
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                确认
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  content: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: '600',
    width: 50,
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    width: 60,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 4,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: 14,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  editButton: {},
  confirmButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
