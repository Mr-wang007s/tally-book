/**
 * Formatting Utilities
 * 格式化工具函数
 */

/**
 * 格式化金额为千分位分隔格式
 * @param amount 金额 (数字或字符串)
 * @param currency 货币符号 (默认 ¥)
 * @returns 格式化后的金额字符串 (如 ¥1,234.56)
 * 
 * @example
 * formatAmount(1234.56) // "¥1,234.56"
 * formatAmount(1000) // "¥1,000.00"
 * formatAmount("50.5") // "¥50.50"
 */
export function formatAmount(
  amount: number | string,
  currency: string = '¥'
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return `${currency}0.00`;
  }

  // 使用 toLocaleString 进行千分位格式化
  const formatted = num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currency}${formatted}`;
}

/**
 * 解析金额字符串为数字
 * @param amountStr 金额字符串 (如 "¥1,234.56" 或 "1234.56")
 * @returns 数字金额
 * 
 * @example
 * parseAmount("¥1,234.56") // 1234.56
 * parseAmount("1,000") // 1000
 */
export function parseAmount(amountStr: string): number {
  // 移除货币符号和千分位分隔符
  const cleaned = amountStr.replace(/[¥,$\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * 格式化日期为易读格式
 * @param date 日期 (Date 对象或 ISO 8601 字符串)
 * @param format 格式类型
 * @returns 格式化后的日期字符串
 * 
 * @example
 * formatDate(new Date('2025-11-15'), 'short') // "11-15"
 * formatDate(new Date('2025-11-15'), 'medium') // "11月15日"
 * formatDate(new Date('2025-11-15'), 'long') // "2025年11月15日"
 * formatDate(new Date('2025-11-15'), 'full') // "2025年11月15日 星期六"
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][
    dateObj.getDay()
  ];

  switch (format) {
    case 'short':
      return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    case 'medium':
      return `${month}月${day}日`;
    case 'long':
      return `${year}年${month}月${day}日`;
    case 'full':
      return `${year}年${month}月${day}日 ${weekday}`;
    default:
      return `${month}月${day}日`;
  }
}

/**
 * 格式化相对时间 (如 "刚刚", "3分钟前", "昨天")
 * @param date 日期 (Date 对象或 ISO 8601 字符串)
 * @returns 相对时间字符串
 * 
 * @example
 * formatRelativeTime(new Date()) // "刚刚"
 * formatRelativeTime(new Date(Date.now() - 5 * 60 * 1000)) // "5分钟前"
 * formatRelativeTime(new Date(Date.now() - 25 * 60 * 60 * 1000)) // "昨天"
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return formatDate(dateObj, 'medium');
  }
}

/**
 * 格式化时间 (HH:MM)
 * @param date 日期 (Date 对象或 ISO 8601 字符串)
 * @returns 时间字符串 (如 "14:30")
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 格式化百分比
 * @param value 数值 (0-100 或 0-1)
 * @param decimals 小数位数 (默认 1)
 * @returns 百分比字符串 (如 "85.5%")
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  // 如果值在 0-1 之间，转换为 0-100
  const percentage = value <= 1 ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
}
