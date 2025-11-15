/**
 * VoiceRecorder Component
 * 语音录音组件 - 录音按钮、动画、识别状态展示
 */

import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { RecognitionState } from '@/hooks/useVoiceRecognition';

export interface VoiceRecorderProps {
  /**
   * 识别状态
   */
  state: RecognitionState;
  
  /**
   * 是否正在录音
   */
  isRecording: boolean;
  
  /**
   * 是否正在处理
   */
  isProcessing: boolean;
  
  /**
   * 开始录音回调
   */
  onStart: () => void;
  
  /**
   * 停止录音回调
   */
  onStop: () => void;
  
  /**
   * 取消录音回调
   */
  onCancel?: () => void;
  
  /**
   * 是否禁用
   */
  disabled?: boolean;
  
  /**
   * 自定义样式
   */
  style?: any;
}

/**
 * VoiceRecorder 组件
 */
export function VoiceRecorder({
  state,
  isRecording,
  isProcessing,
  onStart,
  onStop,
  onCancel,
  disabled = false,
  style,
}: VoiceRecorderProps) {
  const { colors } = useTheme();
  
  // 脉冲动画
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  // 录音时播放脉冲动画
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);
  
  // 处理按钮点击
  const handlePress = () => {
    if (disabled) return;
    
    if (isRecording) {
      onStop();
    } else if (!isProcessing) {
      onStart();
    }
  };
  
  // 处理长按取消
  const handleLongPress = () => {
    if (isRecording && onCancel) {
      onCancel();
    }
  };
  
  // 确定按钮颜色和图标
  const getButtonStyle = () => {
    if (isRecording) {
      return {
        backgroundColor: colors.error,
        icon: 'stop' as const,
      };
    } else if (isProcessing) {
      return {
        backgroundColor: colors.textSecondary,
        icon: 'mic' as const,
      };
    } else {
      return {
        backgroundColor: colors.primary,
        icon: 'mic' as const,
      };
    }
  };
  
  const buttonStyle = getButtonStyle();
  
  return (
    <View style={[styles.container, style]}>
      {/* 录音按钮 */}
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={disabled || isProcessing}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          isRecording ? '停止录音' : isProcessing ? '识别中' : '开始语音输入'
        }
        accessibilityHint={isRecording ? '点击停止，长按取消' : '点击开始语音输入'}
      >
        <Animated.View
          style={[
            styles.button,
            { backgroundColor: buttonStyle.backgroundColor },
            isRecording && {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {isProcessing ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <Ionicons name={buttonStyle.icon} size={32} color="#FFFFFF" />
          )}
        </Animated.View>
      </TouchableOpacity>
      
      {/* 录音提示波纹 */}
      {isRecording && (
        <Animated.View
          style={[
            styles.ripple,
            {
              borderColor: colors.error,
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0.5, 0],
              }),
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ripple: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    pointerEvents: 'none',
  },
});
