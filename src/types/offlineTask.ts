/**
 * Offline Task Types
 * 离线任务队列相关的类型定义
 */

/**
 * 任务类型枚举
 */
export enum TaskType {
  VOICE_RECOGNITION = 'voice_recognition', // 语音识别
  OCR_RECOGNITION = 'ocr_recognition', // OCR 识别
}

/**
 * 任务状态枚举
 */
export enum TaskStatus {
  PENDING = 'pending', // 等待处理
  PROCESSING = 'processing', // 处理中
  COMPLETED = 'completed', // 已完成
  FAILED = 'failed', // 失败
}

/**
 * 离线任务实体
 */
export interface OfflineTask {
  id: string; // UUID
  type: TaskType; // 任务类型
  status: TaskStatus; // 任务状态
  payload: VoiceTaskPayload | OCRTaskPayload; // 任务数据
  result?: TaskResult; // 任务结果 (完成后)
  error?: string; // 错误信息 (失败后)
  retryCount: number; // 重试次数
  createdAt: string; // 创建时间 (ISO 8601)
  processedAt?: string; // 处理时间 (ISO 8601)
}

/**
 * 语音识别任务数据
 */
export interface VoiceTaskPayload {
  audioPath: string; // 音频文件路径
  duration: number; // 录音时长 (秒)
}

/**
 * OCR 识别任务数据
 */
export interface OCRTaskPayload {
  imagePath: string; // 图片文件路径
  imageSize: number; // 图片大小 (bytes)
}

/**
 * 任务结果
 */
export interface TaskResult {
  recognizedText: string; // 识别文本
  extractedData?: ExtractedExpenseData; // 提取的支出数据
  confidence?: number; // 识别置信度 (0-1)
}

/**
 * 提取的支出数据
 */
export interface ExtractedExpenseData {
  amount: number;
  categoryId?: string;
  note?: string;
}

/**
 * 创建离线任务 DTO
 */
export interface CreateOfflineTaskDTO {
  type: TaskType;
  payload: VoiceTaskPayload | OCRTaskPayload;
}
