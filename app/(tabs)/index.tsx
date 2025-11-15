/**
 * HomeScreen - 记账主页
 * User Story 1: 快速键盘输入记账
 * User Story 2: 语音输入记账
 * 遵循 Constitution Principles I (HIG), IV (Accessibility), VII (Safe Areas)
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { Card } from '@/components/ui/Card';
import { ExpenseForm } from '@/components/features/ExpenseForm';
import { VoiceRecorder } from '@/components/features/VoiceRecorder';
import { RecognitionResultModal } from '@/components/features/RecognitionResultModal';
import { useTheme } from '@/hooks/useTheme';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { useVoiceRecognition, RecognitionState } from '@/hooks/useVoiceRecognition';
import { formatAmount } from '@/utils/formatting';
import { initDatabase } from '@/services/database';
import type { CreateExpenseDTO } from '@/types/expense';
import type { ExpenseFormRef } from '@/components/features/ExpenseForm';

export default function HomeScreen() {
  const { colors, typography, spacing } = useTheme();
  const { expenses, addExpense } = useExpenses();
  const { categories } = useCategories();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  
  // ExpenseForm ref
  const formRef = useRef<ExpenseFormRef>(null);
  
  // 获取默认类别 (其他)
  const defaultCategory = categories.find((cat) => cat.name === '其他');
  
  // 语音识别 Hook
  const {
    state: voiceState,
    isRecording,
    isProcessing,
    isAvailable: isVoiceAvailable,
    recognizedText,
    nlpResult,
    error: voiceError,
    startRecognition,
    stopRecognition,
    cancelRecognition,
    reset: resetVoice,
  } = useVoiceRecognition(categories, defaultCategory?.id);

  // 初始化数据库
  useEffect(() => {
    initDatabase()
      .then(() => setIsInitialized(true))
      .catch((error) => {
        console.error('Failed to initialize database:', error);
        Alert.alert('错误', '数据库初始化失败');
      });
  }, []);
  
  // 处理语音识别完成
  useEffect(() => {
    if (voiceState === RecognitionState.COMPLETED && nlpResult?.data) {
      setShowResultModal(true);
    } else if (voiceState === RecognitionState.ERROR && voiceError) {
      Alert.alert('识别失败', voiceError);
      resetVoice();
    }
  }, [voiceState, nlpResult, voiceError, resetVoice]);

  // 计算今日支出总计
  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter((exp) =>
    exp.date.startsWith(today)
  );
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleSubmit = async (dto: CreateExpenseDTO) => {
    try {
      await addExpense(dto);
      Alert.alert('成功', '支出已保存');
    } catch (error) {
      console.error('Failed to add expense:', error);
      throw error;
    }
  };
  
  // 处理语音识别结果确认
  const handleConfirmVoiceResult = async () => {
    if (!nlpResult?.data) return;
    
    try {
      await addExpense({
        ...nlpResult.data,
        inputMethod: InputMethod.VOICE,
      });
      
      setShowResultModal(false);
      resetVoice();
      Alert.alert('成功', '支出已保存');
    } catch (error) {
      console.error('Failed to save expense:', error);
      Alert.alert('错误', '保存失败');
    }
  };
  
  // 处理修正语音识别结果
  const handleEditVoiceResult = () => {
    if (!nlpResult?.data) return;
    
    // 填充表单
    formRef.current?.fillForm(nlpResult.data);
    
    // 关闭模态框并重置语音状态
    setShowResultModal(false);
    resetVoice();
  };
  
  // 处理取消语音识别结果
  const handleCancelVoiceResult = () => {
    setShowResultModal(false);
    resetVoice();
  };

  if (!isInitialized) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.loading, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>加载中...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Today's Total */}
        <Card variant="elevated" style={styles.totalCard}>
          <Text
            style={[
              styles.totalLabel,
              { color: colors.textSecondary, fontSize: typography.fontSize.subhead },
            ]}
          >
            今日支出
          </Text>
          <Text
            style={[
              styles.totalAmount,
              { color: colors.error, fontSize: typography.fontSize.largeTitle },
            ]}
          >
            {formatAmount(todayTotal)}
          </Text>
          <Text
            style={[
              styles.totalCount,
              { color: colors.textTertiary, fontSize: typography.fontSize.footnote },
            ]}
          >
            {todayExpenses.length} 笔记录
          </Text>
        </Card>

        {/* Voice Recorder */}
        {isVoiceAvailable && (
          <View style={styles.voiceRecorderContainer}>
            <VoiceRecorder
              state={voiceState}
              isRecording={isRecording}
              isProcessing={isProcessing}
              onStart={startRecognition}
              onStop={stopRecognition}
              onCancel={cancelRecognition}
            />
            {isRecording && (
              <Text
                style={[
                  styles.voiceHint,
                  { color: colors.textSecondary, fontSize: typography.fontSize.footnote },
                ]}
              >
                {isRecording ? '正在录音... 点击停止' : '点击开始语音输入'}
              </Text>
            )}
          </View>
        )}

        {/* Expense Form */}
        <View style={styles.formContainer}>
          <ExpenseForm ref={formRef} onSubmit={handleSubmit} />
        </View>
        
        {/* Recognition Result Modal */}
        <RecognitionResultModal
          visible={showResultModal}
          result={nlpResult}
          categories={categories}
          onConfirm={handleConfirmVoiceResult}
          onEdit={handleEditVoiceResult}
          onCancel={handleCancelVoiceResult}
        />
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  totalCard: {
    margin: 16,
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: '500',
    marginBottom: 8,
  },
  totalAmount: {
    fontWeight: '700',
    marginBottom: 4,
  },
  totalCount: {
    marginTop: 4,
  },
  voiceRecorderContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  voiceHint: {
    marginTop: 12,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
});
