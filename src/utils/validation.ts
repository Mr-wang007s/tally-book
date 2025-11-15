/**
 * Validation Utilities
 * 验证工具函数
 */

import type { CreateExpenseDTO, UpdateExpenseDTO } from '@/types/expense';
import type { CreateCategoryDTO, UpdateCategoryDTO } from '@/types/category';

/**
 * 金额范围常量
 */
export const AMOUNT_LIMITS = {
  MIN: 0.01,
  MAX: 1_000_000,
  LARGE_THRESHOLD: 10_000, // 异常大额阈值
} as const;

/**
 * 字符串长度限制
 */
export const STRING_LIMITS = {
  NOTE_MAX_LENGTH: 200,
  CATEGORY_NAME_MAX_LENGTH: 20,
} as const;

/**
 * 类别数量限制
 */
export const CATEGORY_LIMITS = {
  MAX_CUSTOM_CATEGORIES: 12, // 用户最多可创建 12 个自定义类别 (8默认 + 12自定义 = 20总数)
  MAX_TOTAL_CATEGORIES: 20,
} as const;

/**
 * 验证金额是否有效
 * @param amount 金额
 * @returns {boolean} 是否有效
 */
export function isValidAmount(amount: number): boolean {
  return (
    typeof amount === 'number' &&
    !isNaN(amount) &&
    amount >= AMOUNT_LIMITS.MIN &&
    amount <= AMOUNT_LIMITS.MAX
  );
}

/**
 * 验证金额是否为异常大额
 * @param amount 金额
 * @returns {boolean} 是否为异常大额
 */
export function isLargeAmount(amount: number): boolean {
  return amount >= AMOUNT_LIMITS.LARGE_THRESHOLD;
}

/**
 * 验证备注长度
 * @param note 备注
 * @returns {boolean} 是否有效
 */
export function isValidNote(note: string): boolean {
  return note.length <= STRING_LIMITS.NOTE_MAX_LENGTH;
}

/**
 * 验证类别名称
 * @param name 类别名称
 * @returns {boolean} 是否有效
 */
export function isValidCategoryName(name: string): boolean {
  return (
    name.trim().length > 0 &&
    name.length <= STRING_LIMITS.CATEGORY_NAME_MAX_LENGTH
  );
}

/**
 * 验证颜色格式 (Hex)
 * @param color 颜色字符串
 * @returns {boolean} 是否为有效的 Hex 颜色
 */
export function isValidColor(color: string): boolean {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
}

/**
 * 验证日期格式 (ISO 8601)
 * @param dateStr 日期字符串
 * @returns {boolean} 是否为有效日期
 */
export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * 验证 UUID 格式
 * @param uuid UUID 字符串
 * @returns {boolean} 是否为有效的 UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 验证创建支出 DTO
 * @param dto CreateExpenseDTO
 * @returns {string[]} 错误信息数组 (空数组表示验证通过)
 */
export function validateCreateExpenseDTO(dto: CreateExpenseDTO): string[] {
  const errors: string[] = [];

  if (!isValidAmount(dto.amount)) {
    errors.push(
      `金额必须在 ${AMOUNT_LIMITS.MIN} 到 ${AMOUNT_LIMITS.MAX.toLocaleString()} 之间`
    );
  }

  if (!dto.categoryId || !isValidUUID(dto.categoryId)) {
    errors.push('无效的类别ID');
  }

  if (dto.note && !isValidNote(dto.note)) {
    errors.push(`备注不能超过 ${STRING_LIMITS.NOTE_MAX_LENGTH} 个字符`);
  }

  if (dto.date && !isValidDate(dto.date)) {
    errors.push('无效的日期格式');
  }

  return errors;
}

/**
 * 验证更新支出 DTO
 * @param dto UpdateExpenseDTO
 * @returns {string[]} 错误信息数组
 */
export function validateUpdateExpenseDTO(dto: UpdateExpenseDTO): string[] {
  const errors: string[] = [];

  if (dto.amount !== undefined && !isValidAmount(dto.amount)) {
    errors.push(
      `金额必须在 ${AMOUNT_LIMITS.MIN} 到 ${AMOUNT_LIMITS.MAX.toLocaleString()} 之间`
    );
  }

  if (dto.categoryId && !isValidUUID(dto.categoryId)) {
    errors.push('无效的类别ID');
  }

  if (dto.note !== undefined && !isValidNote(dto.note)) {
    errors.push(`备注不能超过 ${STRING_LIMITS.NOTE_MAX_LENGTH} 个字符`);
  }

  if (dto.date && !isValidDate(dto.date)) {
    errors.push('无效的日期格式');
  }

  return errors;
}

/**
 * 验证创建类别 DTO
 * @param dto CreateCategoryDTO
 * @returns {string[]} 错误信息数组
 */
export function validateCreateCategoryDTO(dto: CreateCategoryDTO): string[] {
  const errors: string[] = [];

  if (!isValidCategoryName(dto.name)) {
    errors.push(
      `类别名称长度必须在 1-${STRING_LIMITS.CATEGORY_NAME_MAX_LENGTH} 个字符之间`
    );
  }

  if (!dto.icon || dto.icon.trim().length === 0) {
    errors.push('必须选择一个图标');
  }

  if (!isValidColor(dto.color)) {
    errors.push('无效的颜色格式 (必须为 Hex 格式，如 #FF6B6B)');
  }

  if (dto.budget !== undefined && dto.budget < 0) {
    errors.push('预算不能为负数');
  }

  return errors;
}

/**
 * 验证更新类别 DTO
 * @param dto UpdateCategoryDTO
 * @returns {string[]} 错误信息数组
 */
export function validateUpdateCategoryDTO(dto: UpdateCategoryDTO): string[] {
  const errors: string[] = [];

  if (dto.name !== undefined && !isValidCategoryName(dto.name)) {
    errors.push(
      `类别名称长度必须在 1-${STRING_LIMITS.CATEGORY_NAME_MAX_LENGTH} 个字符之间`
    );
  }

  if (dto.color && !isValidColor(dto.color)) {
    errors.push('无效的颜色格式 (必须为 Hex 格式，如 #FF6B6B)');
  }

  if (dto.budget !== undefined && dto.budget < 0) {
    errors.push('预算不能为负数');
  }

  return errors;
}
