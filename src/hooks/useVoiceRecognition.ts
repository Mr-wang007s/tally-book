/**
 * useVoiceRecognition Hook
 * 语音识别流程封装
 */

import { useState, useCallback } from 'react';
import {
  startRecording,
  stopRecording,
  cancelRecording,
  checkMicrophonePermission,
  requestMicrophonePermission,
  isVoiceRecognitionAvailable,
  PermissionStatus,
  VoiceRecognitionError,
  type RecognitionResult,
} from '@/services/voiceApi';
import { extractExpenseInfo, isResultValid, type NLPResult } from '@/services/nlpService';
import type { Category } from '@/types/category';

/**
 * 语音识别状态
 */
export enum RecognitionState {
  IDLE = 'idle', // 空闲
  CHECKING_PERMISSION = 'checking_permission', // 检查权限
  REQUESTING_PERMISSION = 'requesting_permission', // 请求权限
  RECORDING = 'recording', // 录音中
  PROCESSING = 'processing', // 处理中 (识别 + NLP)
  COMPLETED = 'completed', // 完成
  ERROR = 'error', // 错误
}

/**
 * useVoiceRecognition Hook 返回值
 */
export interface UseVoiceRecognitionResult {
  // 状态
  state: RecognitionState;
  isRecording: boolean;
  isProcessing: boolean;
  isAvailable: boolean;
  
  // 权限
  permissionStatus: PermissionStatus | null;
  
  // 识别结果
  recognizedText: string | null;
  nlpResult: NLPResult | null;
  
  // 错误
  error: string | null;
  
  // 方法
  startRecognition: () => Promise<void>;
  stopRecognition: () => Promise<void>;
  cancelRecognition: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  reset: () => void;
}

/**
 * useVoiceRecognition Hook
 * @param categories 可用类别列表
 * @param defaultCategoryId 默认类别 ID
 * @returns 语音识别状态和方法
 * 
 * @example
 * const {
 *   state,
 *   isRecording,
 *   recognizedText,
 *   nlpResult,
 *   startRecognition,
 *   stopRecognition,
 * } = useVoiceRecognition(categories, defaultCategoryId);
 */
export function useVoiceRecognition(
  categories: Category[],
  defaultCategoryId?: string
): UseVoiceRecognitionResult {
  // 状态
  const [state, setState] = useState<RecognitionState>(RecognitionState.IDLE);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [nlpResult, setNlpResult] = useState<NLPResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 检查是否可用
  const isAvailable = isVoiceRecognitionAvailable();
  
  // 衍生状态
  const isRecording = state === RecognitionState.RECORDING;
  const isProcessing = state === RecognitionState.PROCESSING;
  
  /**
   * 请求麦克风权限
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    setState(RecognitionState.REQUESTING_PERMISSION);
    setError(null);
    
    try {
      const status = await requestMicrophonePermission();
      setPermissionStatus(status);
      
      if (status === PermissionStatus.GRANTED) {
        setState(RecognitionState.IDLE);
        return true;
      } else {
        setState(RecognitionState.ERROR);
        setError('麦克风权限被拒绝');
        return false;
      }
    } catch (err) {
      setState(RecognitionState.ERROR);
      setError('请求权限失败');
      return false;
    }
  }, []);
  
  /**
   * 开始语音识别
   */
  const startRecognition = useCallback(async (): Promise<void> => {
    // 检查是否可用
    if (!isAvailable) {
      setState(RecognitionState.ERROR);
      setError('语音识别不可用');
      return;
    }
    
    // 重置状态
    setError(null);
    setRecognizedText(null);
    setNlpResult(null);
    
    // 检查权限
    setState(RecognitionState.CHECKING_PERMISSION);
    const status = await checkMicrophonePermission();
    setPermissionStatus(status);
    
    if (status !== PermissionStatus.GRANTED) {
      const granted = await requestPermission();
      if (!granted) {
        return;
      }
    }
    
    // 开始录音
    try {
      setState(RecognitionState.RECORDING);
      await startRecording();
    } catch (err) {
      setState(RecognitionState.ERROR);
      
      if (err instanceof VoiceRecognitionError) {
        if (err.code === 'PERMISSION_DENIED') {
          setError('麦克风权限被拒绝，请在设置中开启');
        } else if (err.code === 'NOT_AVAILABLE') {
          setError('语音识别功能不可用');
        } else {
          setError('录音失败: ' + err.message);
        }
      } else {
        setError('录音失败');
      }
    }
  }, [isAvailable, requestPermission]);
  
  /**
   * 停止语音识别
   */
  const stopRecognition = useCallback(async (): Promise<void> => {
    if (state !== RecognitionState.RECORDING) {
      return;
    }
    
    setState(RecognitionState.PROCESSING);
    
    try {
      // 停止录音并获取识别结果
      const result: RecognitionResult = await stopRecording();
      setRecognizedText(result.text);
      
      // NLP 提取支出信息
      const nlp = extractExpenseInfo(result.text, categories, defaultCategoryId);
      setNlpResult(nlp);
      
      // 检查结果有效性
      if (isResultValid(nlp)) {
        setState(RecognitionState.COMPLETED);
      } else {
        setState(RecognitionState.ERROR);
        setError(nlp.errors.join(', ') || '识别结果置信度较低，请重试');
      }
    } catch (err) {
      setState(RecognitionState.ERROR);
      
      if (err instanceof VoiceRecognitionError) {
        if (err.code === 'NETWORK_ERROR') {
          setError('网络错误，请检查网络连接');
        } else if (err.code === 'TIMEOUT') {
          setError('识别超时，请重试');
        } else {
          setError('识别失败: ' + err.message);
        }
      } else {
        setError('识别失败');
      }
    }
  }, [state, categories, defaultCategoryId]);
  
  /**
   * 取消语音识别
   */
  const cancelRecognition = useCallback(async (): Promise<void> => {
    if (state !== RecognitionState.RECORDING) {
      return;
    }
    
    try {
      await cancelRecording();
      setState(RecognitionState.IDLE);
      setError(null);
      setRecognizedText(null);
      setNlpResult(null);
    } catch (err) {
      console.error('Failed to cancel recording:', err);
      setState(RecognitionState.IDLE);
    }
  }, [state]);
  
  /**
   * 重置状态
   */
  const reset = useCallback((): void => {
    setState(RecognitionState.IDLE);
    setError(null);
    setRecognizedText(null);
    setNlpResult(null);
  }, []);
  
  return {
    // 状态
    state,
    isRecording,
    isProcessing,
    isAvailable,
    
    // 权限
    permissionStatus,
    
    // 识别结果
    recognizedText,
    nlpResult,
    
    // 错误
    error,
    
    // 方法
    startRecognition,
    stopRecognition,
    cancelRecognition,
    requestPermission,
    reset,
  };
}
