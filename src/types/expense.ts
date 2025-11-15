/**
 * Expense Types and DTOs
 * 支出记录相关的类型定义
 */

/**
 * 输入方式枚举
 */
export enum InputMethod {
  KEYBOARD = 'keyboard', // 键盘输入
  VOICE = 'voice', // 语音识别
  OCR = 'ocr', // 拍照识别
}

/**
 * 支出记录实体
 */
export interface Expense {
  id: string; // UUID
  amount: number; // 金额 (单位：元，范围 0.01-1,000,000)
  categoryId: string; // 类别ID (外键)
  note: string; // 备注 (最大 200 字符)
  date: string; // 日期 (ISO 8601 格式)
  inputMethod: InputMethod; // 输入方式
  photoPath?: string; // 照片路径 (仅 OCR 方式)
  recognizedText?: string; // 识别文本 (语音/OCR 原始结果)
  createdAt: string; // 创建时间 (ISO 8601)
  updatedAt: string; // 更新时间 (ISO 8601)
}

/**
 * 创建支出 DTO
 */
export interface CreateExpenseDTO {
  amount: number;
  categoryId: string;
  note?: string;
  date?: string; // 默认为当前日期
  inputMethod: InputMethod;
  photoPath?: string;
  recognizedText?: string;
}

/**
 * 更新支出 DTO
 */
export interface UpdateExpenseDTO {
  amount?: number;
  categoryId?: string;
  note?: string;
  date?: string;
}

/**
 * 支出列表查询参数
 */
export interface ExpenseQueryParams {
  startDate?: string; // 起始日期
  endDate?: string; // 结束日期
  categoryId?: string; // 类别筛选
  minAmount?: number; // 最小金额
  maxAmount?: number; // 最大金额
  limit?: number; // 分页限制
  offset?: number; // 分页偏移
}
