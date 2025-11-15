/**
 * Theme System Type Definitions
 * iOS 风格视觉改版 - 主题系统类型契约
 * 
 * 本文件定义所有主题相关的 TypeScript 类型
 * 遵循 Constitution Principle II (TypeScript strict mode)
 */

// ============================================================================
// Shadow Types (阴影类型)
// ============================================================================

/**
 * 单个阴影样式定义
 */
export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;  // 0-1
  shadowRadius: number;   // pt
  elevation: number;      // Android 层级 0-5
}

/**
 * 阴影级别集合（none, sm, md, lg）
 */
export interface ShadowSet {
  none: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
}

/**
 * 完整阴影系统（浅色/深色模式）
 */
export interface Shadows {
  light: ShadowSet;
  dark: ShadowSet;
}

// ============================================================================
// Animation Types (动画类型)
// ============================================================================

/**
 * 动画时长配置（毫秒）
 */
export interface DurationConfig {
  instant: 0;
  fast: 200;
  normal: 350;
  slow: 500;
}

/**
 * 贝塞尔缓动曲线（4 个控制点）
 */
export type BezierCurve = readonly [number, number, number, number];

/**
 * 缓动曲线配置
 */
export interface EasingConfig {
  easeInOut: BezierCurve;  // [0.25, 0.1, 0.25, 1]
  easeOut: BezierCurve;    // [0, 0, 0.2, 1]
  easeIn: BezierCurve;     // [0.4, 0, 1, 1]
}

/**
 * 弹簧动画参数
 */
export interface SpringParams {
  damping: number;    // 阻尼系数 (>0)
  stiffness: number;  // 刚度 (>0)
}

/**
 * 弹簧配置集合
 */
export interface SpringConfig {
  gentle: SpringParams;   // 柔和弹簧
  default: SpringParams;  // 标准弹簧
  bouncy: SpringParams;   // 弹性强
}

/**
 * 完整动画配置
 */
export interface Animations {
  duration: DurationConfig;
  easing: EasingConfig;
  spring: SpringConfig;
}

// ============================================================================
// Blur Material Types (毛玻璃材质类型)
// ============================================================================

/**
 * 毛玻璃色调
 */
export type BlurTint = 'light' | 'dark' | 'default';

/**
 * 毛玻璃材质定义
 */
export interface BlurMaterial {
  intensity: number;       // 模糊强度 0-100
  tint: BlurTint;         // 色调
  fallbackColor: string;   // 降级时的纯色背景
}

/**
 * 毛玻璃材质预设
 */
export interface BlurMaterials {
  regular: BlurMaterial;    // 标准模糊（底部面板、对话框）
  prominent: BlurMaterial;  // 强模糊（全屏遮罩）
  thin: BlurMaterial;       // 轻模糊（Toast）
}

// ============================================================================
// Card Style Types (卡片样式类型)
// ============================================================================

/**
 * 卡片样式定义
 */
export interface CardStyle {
  backgroundColor: string;
  borderRadius: number;
  padding: number;
  shadow: ShadowStyle;
  borderWidth?: number;
  borderColor?: string;
}

/**
 * 卡片预设类型
 */
export type CardPreset = 'default' | 'elevated' | 'flat' | 'compact';

// ============================================================================
// Haptics Types (触觉反馈类型)
// ============================================================================

/**
 * Impact 反馈强度
 */
export type ImpactFeedbackStyle = 'light' | 'medium' | 'heavy';

/**
 * Notification 反馈类型
 */
export type NotificationFeedbackType = 'success' | 'warning' | 'error';

/**
 * 触觉反馈配置
 */
export interface HapticsConfig {
  type: 'impact' | 'notification' | 'selection';
  style?: ImpactFeedbackStyle;      // impact 专用
  feedback?: NotificationFeedbackType;  // notification 专用
}

// ============================================================================
// Extended Theme Types (扩展主题类型)
// ============================================================================

/**
 * 扩展后的完整主题系统
 * 在现有 Theme 基础上添加 shadows, animations, blurMaterials
 */
export interface ExtendedTheme {
  colors: ThemeColors;        // 现有颜色系统
  typography: Typography;     // 现有字体系统
  spacing: Spacing;           // 现有间距系统
  shadows: Shadows;           // 新增：阴影系统
  animations: Animations;     // 新增：动画配置
  blurMaterials: BlurMaterials;  // 新增：毛玻璃材质
  colorScheme: 'light' | 'dark';
  isDark: boolean;
}

// ============================================================================
// Helper Functions Types (辅助函数类型)
// ============================================================================

/**
 * 获取卡片样式函数签名
 */
export type GetCardStyleFn = (
  preset: CardPreset,
  theme: ExtendedTheme
) => CardStyle;

/**
 * 检测是否应禁用毛玻璃效果
 */
export type ShouldDisableBlurFn = () => Promise<boolean>;

/**
 * 获取当前主题的阴影集合
 */
export type GetShadowSetFn = (isDark: boolean, shadows: Shadows) => ShadowSet;

// ============================================================================
// Re-export existing types (重新导出现有类型)
// ============================================================================

/**
 * 注意: 以下类型定义在现有主题系统中，此处仅作为引用
 * 实际使用时从 @/theme/* 导入
 */

/**
 * 颜色系统（现有）
 * @see src/theme/colors.ts
 */
export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;

  // UI colors
  border: string;
  separator: string;
  card: string;
  shadow: string;

  // Status colors
  success: string;
  error: string;
  warning: string;
  info: string;

  // Transaction colors
  income: string;
  expense: string;
  transfer: string;

  // FAB colors
  fabPrimary: string;
  fabIncome: string;
  fabExpense: string;
  fabTransfer: string;

  // Filter panel
  filterBackground: string;
  filterCard: string;
  filterBorder: string;
  filterSelected: string;

  // Category colors
  categoryColors: {
    food: string;
    transport: string;
    shopping: string;
    entertainment: string;
    medical: string;
    education: string;
    housing: string;
    other: string;
  };
}

/**
 * 字体系统（现有）
 * @see src/theme/typography.ts
 */
export interface Typography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSize: {
    largeTitle: number;
    title1: number;
    title2: number;
    title3: number;
    headline: number;
    body: number;
    callout: number;
    subhead: number;
    footnote: number;
    caption1: number;
    caption2: number;
  };
  fontWeight: {
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
  };
  lineHeight: {
    largeTitle: number;
    title1: number;
    title2: number;
    title3: number;
    headline: number;
    body: number;
    callout: number;
    subhead: number;
    footnote: number;
    caption1: number;
    caption2: number;
  };
  letterSpacing: {
    tight: number;
    normal: number;
    wide: number;
  };
}

/**
 * 间距系统（现有）
 * @see src/theme/spacing.ts
 */
export interface Spacing {
  // Base spacing
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;

  // Touch targets
  touchTarget: number;
  touchTargetLarge: number;

  // Screen margins
  screenHorizontal: number;
  screenVertical: number;

  // Card spacing
  cardPadding: number;
  cardMargin: number;
  sectionSpacing: number;

  // Border radius
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };

  // Border width
  borderWidth: {
    thin: number;
    regular: number;
    thick: number;
  };

  // Shadow (将被移除，迁移到 Shadows 类型)
  shadow: {
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
  };
}

// ============================================================================
// Export all types
// ============================================================================

export type {
  ShadowStyle,
  ShadowSet,
  Shadows,
  DurationConfig,
  BezierCurve,
  EasingConfig,
  SpringParams,
  SpringConfig,
  Animations,
  BlurTint,
  BlurMaterial,
  BlurMaterials,
  CardStyle,
  CardPreset,
  ImpactFeedbackStyle,
  NotificationFeedbackType,
  HapticsConfig,
  ExtendedTheme,
  GetCardStyleFn,
  ShouldDisableBlurFn,
  GetShadowSetFn,
  ThemeColors,
  Typography,
  Spacing,
};
