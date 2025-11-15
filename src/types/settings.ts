/**
 * Settings Types
 * 应用设置相关的类型定义
 */

/**
 * 应用设置实体
 */
export interface AppSettings {
  // 通用设置
  currency: string; // 货币符号 (默认 ¥)
  defaultCategoryId?: string; // 默认类别ID

  // 通知设置
  budgetAlertEnabled: boolean; // 预算提醒开关
  budgetAlertThreshold: number; // 预算提醒阈值 (百分比 0-100)

  // 隐私设置
  requireAuth: boolean; // 启动时需要认证 (Face ID / Touch ID)
  autoLockTimeout: number; // 自动锁定超时 (秒，0 表示禁用)

  // 数据设置
  autoBackupEnabled: boolean; // 自动备份开关
  lastBackupTime?: string; // 最后备份时间 (ISO 8601)

  // UI 设置
  theme: 'light' | 'dark' | 'auto'; // 主题模式
}

/**
 * 默认设置
 */
export const DEFAULT_SETTINGS: AppSettings = {
  currency: '¥',
  budgetAlertEnabled: true,
  budgetAlertThreshold: 80,
  requireAuth: false,
  autoLockTimeout: 0,
  autoBackupEnabled: false,
  theme: 'auto',
};

/**
 * 更新设置 DTO
 */
export type UpdateSettingsDTO = Partial<AppSettings>;
