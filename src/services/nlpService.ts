/**
 * NLP Service
 * 自然语言处理服务 - 从语音/OCR文本中提取支出信息
 */

import {
  extractAmount,
  extractCategory,
  extractNote,
  extractExpenseInfo as utilExtractExpenseInfo,
  calculateConfidence,
} from '@/utils/extractors';
import type { Category } from '@/types/category';
import type { ExtractedExpenseData } from '@/types/offlineTask';

/**
 * NLP 提取结果
 */
export interface NLPResult {
  data: ExtractedExpenseData | null; // 提取的支出数据
  confidence: number; // 置信度 (0-1)
  originalText: string; // 原始文本
  errors: string[]; // 错误信息
}

/**
 * 从文本中提取支出信息
 * @param text 输入文本 (语音识别或 OCR 结果)
 * @param categories 可用类别列表
 * @param defaultCategoryId 默认类别 ID (如果未识别到类别)
 * @returns NLP 提取结果
 * 
 * @example
 * const result = extractExpenseInfo("早餐面包牛奶15块", categories, defaultId);
 * // {
 * //   data: { amount: 15, categoryId: "xxx", note: "" },
 * //   confidence: 0.8,
 * //   originalText: "早餐面包牛奶15块",
 * //   errors: []
 * // }
 */
export function extractExpenseInfo(
  text: string,
  categories: Category[],
  defaultCategoryId?: string
): NLPResult {
  const errors: string[] = [];
  
  // 验证输入
  if (!text || text.trim().length === 0) {
    errors.push('输入文本为空');
    return {
      data: null,
      confidence: 0,
      originalText: text,
      errors,
    };
  }
  
  if (!categories || categories.length === 0) {
    errors.push('类别列表为空');
    return {
      data: null,
      confidence: 0,
      originalText: text,
      errors,
    };
  }
  
  // 调用工具函数提取数据
  const data = utilExtractExpenseInfo(text, categories, defaultCategoryId);
  
  // 计算置信度
  const confidence = calculateConfidence(text, data);
  
  // 收集错误信息
  if (!data) {
    errors.push('无法提取有效的支出信息');
  } else {
    if (!data.amount) {
      errors.push('未识别到金额');
    }
    if (!data.categoryId) {
      errors.push('未识别到类别');
    }
  }
  
  return {
    data,
    confidence,
    originalText: text,
    errors,
  };
}

/**
 * 仅提取金额
 * @param text 输入文本
 * @returns 提取的金额
 */
export function extractAmountOnly(text: string): number | null {
  return extractAmount(text);
}

/**
 * 仅提取类别
 * @param text 输入文本
 * @param categories 可用类别列表
 * @returns 提取的类别 ID
 */
export function extractCategoryOnly(
  text: string,
  categories: Category[]
): string | null {
  const categoryName = extractCategory(text, categories);
  if (!categoryName) {
    return null;
  }
  
  const category = categories.find((cat) => cat.name === categoryName);
  return category?.id || null;
}

/**
 * 仅提取备注
 * @param text 输入文本
 * @returns 提取的备注
 */
export function extractNoteOnly(text: string): string {
  return extractNote(text);
}

/**
 * 验证提取结果是否可用 (置信度 >= 阈值)
 * @param result NLP 提取结果
 * @param threshold 置信度阈值 (默认 0.8)
 * @returns 是否可用
 */
export function isResultValid(result: NLPResult, threshold = 0.8): boolean {
  return result.data !== null && result.confidence >= threshold;
}

/**
 * 格式化提取结果为用户友好的消息
 * @param result NLP 提取结果
 * @returns 格式化的消息
 */
export function formatResultMessage(result: NLPResult): string {
  if (!result.data) {
    return '抱歉，无法识别您的输入。请重试或手动输入。';
  }
  
  const messages: string[] = [];
  
  if (result.confidence < 0.8) {
    messages.push('识别置信度较低，请确认以下信息：');
  } else {
    messages.push('识别成功：');
  }
  
  if (result.data.amount) {
    messages.push(`金额: ¥${result.data.amount.toFixed(2)}`);
  }
  
  if (result.errors.length > 0) {
    messages.push('');
    messages.push('提示: ' + result.errors.join(', '));
  }
  
  return messages.join('\n');
}

/**
 * 批量提取支出信息 (用于处理多条语音/OCR结果)
 * @param texts 输入文本数组
 * @param categories 可用类别列表
 * @param defaultCategoryId 默认类别 ID
 * @returns NLP 提取结果数组
 */
export function batchExtractExpenseInfo(
  texts: string[],
  categories: Category[],
  defaultCategoryId?: string
): NLPResult[] {
  return texts.map((text) =>
    extractExpenseInfo(text, categories, defaultCategoryId)
  );
}

/**
 * 合并多个提取结果 (选择置信度最高的)
 * @param results NLP 提取结果数组
 * @returns 最佳结果
 */
export function mergeBestResult(results: NLPResult[]): NLPResult | null {
  if (results.length === 0) {
    return null;
  }
  
  // 按置信度降序排序
  const sorted = [...results].sort((a, b) => b.confidence - a.confidence);
  
  return sorted[0];
}
