/**
 * useOCR Hook
 * 封装 OCR 识别流程
 * User Story 3: 拍照识别账单
 * 遵循 Constitution Principle II (Code Quality - Hook Separation)
 */

import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { recognizeReceipt, isOCRAvailable, OCRResult } from '@/services/ocrApi';
import { extractCategoryFromText } from '@/utils/extractors';
import type { Category } from '@/types/category';
import type { CreateExpenseDTO, InputMethod } from '@/types/expense';

export enum OCRState {
  IDLE = 'idle',
  SELECTING_IMAGE = 'selecting_image',
  RECOGNIZING = 'recognizing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface OCRHookResult {
  state: OCRState;
  isProcessing: boolean;
  isAvailable: boolean;
  ocrResult: OCRResult | null;
  expenseData: CreateExpenseDTO | null;
  error: string | null;
  recognizeFromCamera: () => Promise<void>;
  recognizeFromGallery: () => Promise<void>;
  reset: () => void;
}

/**
 * useOCR Hook
 */
export function useOCR(
  categories: Category[],
  defaultCategoryId?: string
): OCRHookResult {
  const [state, setState] = useState<OCRState>(OCRState.IDLE);
  const [ocrResult, setOCRResult] = useState<OCRResult | null>(null);
  const [expenseData, setExpenseData] = useState<CreateExpenseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  // 检查 OCR 服务可用性
  useState(() => {
    isOCRAvailable().then(setIsAvailable);
  });

  /**
   * 处理图片识别
   */
  const processImage = useCallback(
    async (imageUri: string, photoUri?: string) => {
      try {
        setState(OCRState.RECOGNIZING);
        setError(null);

        // 调用 OCR 识别
        const result = await recognizeReceipt(imageUri);
        setOCRResult(result);

        // 如果没有识别到金额，抛出错误
        if (!result.amount) {
          throw new Error('未能识别到金额，请重试或手动输入');
        }

        // 提取类别
        const categoryId = extractCategoryFromText(result.rawText, categories) || defaultCategoryId;

        if (!categoryId) {
          throw new Error('未能识别类别');
        }

        // 构建支出数据
        const expense: CreateExpenseDTO = {
          amount: result.amount,
          categoryId,
          inputMethod: InputMethod.PHOTO,
          rawText: result.rawText,
          merchant: result.merchant,
          photoUri,
          confidence: result.confidence,
          timestamp: Date.now(),
        };

        setExpenseData(expense);
        setState(OCRState.COMPLETED);
      } catch (err) {
        console.error('OCR processing failed:', err);
        const errorMessage = err instanceof Error ? err.message : '识别失败';
        setError(errorMessage);
        setState(OCRState.ERROR);
      }
    },
    [categories, defaultCategoryId]
  );

  /**
   * 从相机拍照识别
   */
  const recognizeFromCamera = useCallback(async () => {
    try {
      setState(OCRState.SELECTING_IMAGE);

      // 请求相机权限
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('需要相机权限才能拍照');
      }

      // 打开相机
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (result.canceled) {
        setState(OCRState.IDLE);
        return;
      }

      const imageUri = result.assets[0].uri;
      await processImage(imageUri, imageUri);
    } catch (err) {
      console.error('Camera capture failed:', err);
      const errorMessage = err instanceof Error ? err.message : '拍照失败';
      setError(errorMessage);
      setState(OCRState.ERROR);
    }
  }, [processImage]);

  /**
   * 从相册选择照片识别
   */
  const recognizeFromGallery = useCallback(async () => {
    try {
      setState(OCRState.SELECTING_IMAGE);

      // 请求相册权限
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('需要相册权限才能选择照片');
      }

      // 打开相册
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (result.canceled) {
        setState(OCRState.IDLE);
        return;
      }

      const imageUri = result.assets[0].uri;
      await processImage(imageUri, imageUri);
    } catch (err) {
      console.error('Gallery selection failed:', err);
      const errorMessage = err instanceof Error ? err.message : '选择照片失败';
      setError(errorMessage);
      setState(OCRState.ERROR);
    }
  }, [processImage]);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState(OCRState.IDLE);
    setOCRResult(null);
    setExpenseData(null);
    setError(null);
  }, []);

  return {
    state,
    isProcessing: state === OCRState.RECOGNIZING || state === OCRState.SELECTING_IMAGE,
    isAvailable,
    ocrResult,
    expenseData,
    error,
    recognizeFromCamera,
    recognizeFromGallery,
    reset,
  };
}
