/**
 * Category Types and DTOs
 * 类别相关的类型定义
 */

/**
 * 类别类型枚举
 */
export enum CategoryType {
  DEFAULT = 'default', // 系统默认类别
  CUSTOM = 'custom', // 用户自定义类别
}

/**
 * 类别实体
 */
export interface Category {
  id: string; // UUID
  name: string; // 名称 (最大 20 字符，唯一)
  icon: string; // 图标名称 (@expo/vector-icons)
  color: string; // 颜色 (Hex 格式，如 #FF6B6B)
  type: CategoryType; // 类别类型
  budget?: number; // 预算 (可选，单位：元)
  sortOrder: number; // 排序顺序 (1-20)
  isActive: boolean; // 是否启用
  createdAt: string; // 创建时间 (ISO 8601)
}

/**
 * 创建类别 DTO
 */
export interface CreateCategoryDTO {
  name: string;
  icon: string;
  color: string;
  budget?: number;
  sortOrder?: number;
}

/**
 * 更新类别 DTO
 */
export interface UpdateCategoryDTO {
  name?: string;
  icon?: string;
  color?: string;
  budget?: number;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * 默认类别配置 (8个)
 */
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  {
    name: '餐饮',
    icon: 'restaurant',
    color: '#FF6B6B',
    type: CategoryType.DEFAULT,
    sortOrder: 1,
    isActive: true,
  },
  {
    name: '交通',
    icon: 'car',
    color: '#4ECDC4',
    type: CategoryType.DEFAULT,
    sortOrder: 2,
    isActive: true,
  },
  {
    name: '购物',
    icon: 'shopping-cart',
    color: '#FFE66D',
    type: CategoryType.DEFAULT,
    sortOrder: 3,
    isActive: true,
  },
  {
    name: '娱乐',
    icon: 'game-controller',
    color: '#A8E6CF',
    type: CategoryType.DEFAULT,
    sortOrder: 4,
    isActive: true,
  },
  {
    name: '医疗',
    icon: 'medkit',
    color: '#FF8B94',
    type: CategoryType.DEFAULT,
    sortOrder: 5,
    isActive: true,
  },
  {
    name: '教育',
    icon: 'school',
    color: '#95E1D3',
    type: CategoryType.DEFAULT,
    sortOrder: 6,
    isActive: true,
  },
  {
    name: '住房',
    icon: 'home',
    color: '#C7CEEA',
    type: CategoryType.DEFAULT,
    sortOrder: 7,
    isActive: true,
  },
  {
    name: '其他',
    icon: 'ellipsis-horizontal',
    color: '#B5B5B5',
    type: CategoryType.DEFAULT,
    sortOrder: 8,
    isActive: true,
  },
];
