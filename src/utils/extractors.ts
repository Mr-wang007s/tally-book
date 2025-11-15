/**
 * NLP Extractors
 * 文本提取工具 (正则表达式 + 规则引擎)
 * 用于从语音识别和 OCR 结果中提取金额和类别
 */

import type { ExtractedExpenseData } from '@/types/offlineTask';

/**
 * 金额提取正则表达式
 * 支持格式: "15块", "50元", "100.5", "1,234.56"
 */
const AMOUNT_PATTERNS = [
  /(\d+(?:\.\d{1,2})?)\s*(?:元|块|圆)/gi, // "50元", "15块"
  /(?:共|总共|总计|合计|一共)?\s*(\d+(?:\.\d{1,2})?)/gi, // "总共50", "100.5"
  /¥\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/gi, // "¥1,234.56"
];

/**
 * 类别关键词映射
 * 从文本中匹配关键词，映射到对应的类别名称
 */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  餐饮: [
    '吃饭', '早餐', '午餐', '晚餐', '面包', '牛奶', '咖啡', '奶茶', '餐厅',
    '食堂', '外卖', '快餐', '火锅', '烧烤', '饭', '菜', '肉', '水果', '零食',
  ],
  交通: [
    '打车', '出租车', '滴滴', '公交', '地铁', '火车', '高铁', '飞机', '机票',
    '车票', '加油', '停车', '过路费', '高速', '油费',
  ],
  购物: [
    '超市', '商场', '淘宝', '京东', '拼多多', '买', '购买', '商品', '衣服',
    '鞋子', '包包', '化妆品', '日用品', '电器', '手机', '电脑',
  ],
  娱乐: [
    '电影', 'KTV', '游戏', '唱歌', '旅游', '景点', '门票', '酒吧', '夜店',
    '健身', '游泳', '运动', '球赛', '演唱会',
  ],
  医疗: [
    '医院', '看病', '药店', '药', '挂号', '检查', '治疗', '体检', '牙医',
    '医生', '诊所', '手术', '住院',
  ],
  教育: [
    '学费', '培训', '课程', '书', '文具', '补习', '辅导', '学校', '大学',
    '网课', '教材', '考试', '证书',
  ],
  住房: [
    '房租', '水费', '电费', '燃气', '物业费', '房贷', '装修', '家具', '维修',
    '租金', '房子',
  ],
};

/**
 * 从文本中提取金额
 * @param text 输入文本
 * @returns 提取的金额 (如果未找到返回 null)
 * 
 * @example
 * extractAmount("午餐花了50元") // 50
 * extractAmount("总共100.5") // 100.5
 * extractAmount("¥1,234.56") // 1234.56
 */
export function extractAmount(text: string): number | null {
  if (!text || text.trim().length === 0) {
    return null;
  }

  // 尝试每个模式
  for (const pattern of AMOUNT_PATTERNS) {
    const match = pattern.exec(text);
    if (match && match[1]) {
      // 移除千分位分隔符并转换为数字
      const amountStr = match[1].replace(/,/g, '');
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }

  return null;
}

/**
 * 从文本中提取类别名称
 * @param text 输入文本
 * @param categories 可用类别列表 (包含 name 字段)
 * @returns 匹配的类别名称 (如果未找到返回 null)
 * 
 * @example
 * extractCategory("早餐面包牛奶15块", categories) // "餐饮"
 * extractCategory("打车花了30元", categories) // "交通"
 */
export function extractCategory(
  text: string,
  categories: Array<{ name: string }>
): string | null {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const lowerText = text.toLowerCase();

  // 遍历类别关键词映射
  for (const [categoryName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    // 检查该类别是否存在于可用类别中
    const categoryExists = categories.some((cat) => cat.name === categoryName);
    if (!categoryExists) {
      continue;
    }

    // 检查文本是否包含任何关键词
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return categoryName;
      }
    }
  }

  return null;
}

/**
 * 从文本中提取备注
 * @param text 输入文本
 * @returns 清理后的备注 (移除金额和类别关键词)
 * 
 * @example
 * extractNote("午餐花了50元买面包") // "买面包"
 */
export function extractNote(text: string): string {
  if (!text || text.trim().length === 0) {
    return '';
  }

  let note = text;

  // 移除金额相关文本
  for (const pattern of AMOUNT_PATTERNS) {
    note = note.replace(pattern, '');
  }

  // 移除类别关键词
  for (const keywords of Object.values(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi');
      note = note.replace(regex, '');
    }
  }

  // 清理多余空格和标点符号
  note = note.replace(/\s+/g, ' ').trim();
  note = note.replace(/^[，。、；：！？\s]+/, '');
  note = note.replace(/[，。、；：！？\s]+$/, '');

  return note.length > 200 ? note.substring(0, 200) : note;
}

/**
 * 从文本中提取完整的支出数据
 * @param text 输入文本
 * @param categories 可用类别列表
 * @param defaultCategoryId 默认类别ID (如果未识别到类别)
 * @returns 提取的支出数据
 * 
 * @example
 * extractExpenseInfo("早餐面包牛奶15块", categories, defaultId)
 * // { amount: 15, categoryId: "xxx", note: "" }
 */
export function extractExpenseInfo(
  text: string,
  categories: Array<{ id: string; name: string }>,
  defaultCategoryId?: string
): ExtractedExpenseData | null {
  const amount = extractAmount(text);
  
  if (amount === null) {
    return null; // 无法提取金额，返回 null
  }

  const categoryName = extractCategory(text, categories);
  const category = categories.find((cat) => cat.name === categoryName);
  const categoryId = category?.id || defaultCategoryId;

  if (!categoryId) {
    return null; // 无法确定类别，返回 null
  }

  const note = extractNote(text);

  return {
    amount,
    categoryId,
    note: note || undefined,
  };
}

/**
 * 计算提取置信度 (0-1)
 * @param text 原始文本
 * @param extracted 提取的数据
 * @returns 置信度分数
 */
export function calculateConfidence(
  text: string,
  extracted: ExtractedExpenseData | null
): number {
  if (!extracted) {
    return 0;
  }

  let confidence = 0;

  // 成功提取金额: +0.5
  if (extracted.amount) {
    confidence += 0.5;
  }

  // 成功提取类别: +0.3
  if (extracted.categoryId) {
    confidence += 0.3;
  }

  // 成功提取备注: +0.2
  if (extracted.note && extracted.note.length > 0) {
    confidence += 0.2;
  }

  return Math.min(confidence, 1);
}
