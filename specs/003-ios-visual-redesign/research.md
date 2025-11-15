# Research: iOS 风格视觉改版技术调研

**Feature**: 003-ios-visual-redesign  
**Date**: 2025-11-15  
**Status**: Completed

## Overview

本文档记录 iOS 风格视觉改版的技术调研过程，包括关键技术选型、最佳实践研究和实施决策。所有 NEEDS CLARIFICATION 已在此阶段解决。

---

## 1. 毛玻璃效果实现方案

### 问题
需要为底部面板（FilterBottomSheet）、对话框（ConfirmDialog）、浮层菜单添加实时背景模糊效果（iOS 风格毛玻璃），同时保持 ≥55fps 性能。

### 调研方案

#### 方案 A: expo-blur
- **库**: `expo-blur` (Expo 官方维护)
- **API**: `<BlurView intensity={80} tint="light|dark|default">`
- **优势**:
  - Expo 官方支持，与 managed workflow 完美集成
  - 跨平台（iOS UIBlurEffect + Android RenderScript）
  - 自动适配深色模式（tint 参数）
  - 支持 Expo Go 预览
- **劣势**:
  - Android 模糊效果略逊于 iOS
  - intensity 参数在不同设备上表现可能不一致
- **性能**: iOS 原生 UIBlurEffect（GPU 加速），性能优秀

#### 方案 B: react-native-blur
- **库**: `@react-native-community/blur`
- **API**: `<BlurView blurType="light|dark" blurAmount={10}>`
- **优势**:
  - 社区成熟方案，文档完善
  - iOS 效果接近原生
- **劣势**:
  - 需要 Expo 裸工作流（bare workflow）或自定义开发客户端
  - 不支持 Expo Go
  - Android 需要额外配置
- **性能**: 与 expo-blur 相当

#### 方案 C: 自定义半透明实现
- **实现**: 使用 `backgroundColor: 'rgba(255, 255, 255, 0.8)'` + `backdropFilter`（Web）
- **优势**:
  - 无需额外依赖
  - 性能最佳（无模糊计算）
- **劣势**:
  - 视觉效果远不如真实毛玻璃
  - React Native 不支持 `backdropFilter`（仅 Web）
  - 不符合 iOS 设计语言

### 决策: 方案 A (expo-blur)

**理由**:
1. ✅ 符合 Expo managed workflow，无需切换到 bare workflow
2. ✅ 支持 Expo Go，方便开发和测试
3. ✅ 官方维护，与 Expo SDK 同步更新
4. ✅ 跨平台支持（iOS + Android）
5. ✅ 自动适配深色模式（tint="light|dark|default"）

**实施细节**:
```bash
# 安装命令
npx expo install expo-blur
```

```tsx
// 使用示例
import { BlurView } from 'expo-blur';

<BlurView
  intensity={80}              // 模糊强度 0-100
  tint={isDark ? 'dark' : 'light'}  // 自动适配主题
  style={StyleSheet.absoluteFill}
>
  {/* 面板内容 */}
</BlurView>
```

**降级策略**:
- 使用 `AccessibilityInfo.isReduceTransparencyEnabled()` 检测"减少透明度"设置
- 如果启用，改用不透明背景色（`colors.filterBackground`）
- 低端设备（通过检测动画 FPS < 45）自动降级

---

## 2. 动画性能优化策略

### 问题
需要实现流畅的 60fps 动画（底部面板弹簧动画、FAB 展开错开动画、卡片淡入淡出），同时在低端设备上保持可用性。

### 调研方案

#### 方案 A: react-native-reanimated 3 (UI 线程动画)
- **当前状态**: 已安装 `react-native-reanimated@3.10.1`
- **API**: `useSharedValue`, `useAnimatedStyle`, `withSpring`, `withTiming`
- **优势**:
  - 动画运行在 UI 线程（非 JS 线程），60fps 保证
  - 声明式 API，与 React Hooks 集成良好
  - 支持手势驱动动画（与 `react-native-gesture-handler` 配合）
  - 性能监控工具（Reanimated DevTools）
- **最佳实践**:
  - 使用 `withSpring` 实现弹簧动画（阻尼 0.8，响应度 0.5）
  - 使用 `withDelay` + `withSequence` 实现错开动画
  - 避免在动画中读取 JS 状态（使用 `runOnJS` 回调）

#### 方案 B: Animated API (React Native 内置)
- **API**: `Animated.Value`, `Animated.timing`, `Animated.spring`
- **劣势**:
  - 运行在 JS 线程，受主线程阻塞影响
  - 复杂动画可能掉帧
  - 不适合本次改版的高性能要求

### 决策: 方案 A (Reanimated 3)

**理由**:
1. ✅ 已安装并集成到项目中
2. ✅ UI 线程动画，性能最优
3. ✅ 支持弹簧动画（iOS 风格）
4. ✅ 与现有组件（FloatingActionButton、FilterBottomSheet）兼容

**动画配置标准**:

```typescript
// src/theme/animations.ts
export const animations = {
  // 动画时长
  duration: {
    instant: 0,       // 立即
    fast: 200,        // 0.2s - 快速反馈
    normal: 350,      // 0.35s - 标准过渡
    slow: 500,        // 0.5s - 慢速动画
  },

  // 缓动曲线（贝塞尔）
  easing: {
    easeInOut: [0.25, 0.1, 0.25, 1] as const,  // cubic-bezier
    easeOut: [0, 0, 0.2, 1] as const,
    easeIn: [0.4, 0, 1, 1] as const,
  },

  // 弹簧参数
  spring: {
    gentle: { damping: 15, stiffness: 150 },   // 柔和弹簧
    default: { damping: 20, stiffness: 200 },  // 标准弹簧
    bouncy: { damping: 10, stiffness: 100 },   // 弹性强
  },
};
```

**性能监控**:
- 使用 Expo Performance Monitor（开发模式下 Cmd+Shift+Z）
- 目标: ≥60fps（高端设备），≥55fps（中端设备）
- 低端设备降级: 检测到连续 3 帧 <45fps 时，禁用毛玻璃并简化动画

---

## 3. iOS 设计规范细节研究

### 8pt 网格系统

**调研来源**: Apple HIG Foundations - Layout

**应用规则**:
- 所有间距、边距、元素尺寸为 8 的倍数（8pt, 16pt, 24pt, 32pt...）
- 例外: 半间距 4pt（仅用于微调，如图标与文字间距）
- 当前项目状态: 已实现（`spacing.ts` 使用 8pt 基准单位）

**调整项**:
- ✅ 无需调整（现有 spacing 系统已符合）
- 验证: 所有组件间距使用 `spacing.sm/md/lg/xl`

### 圆角半径标准

**调研来源**: iOS 26 Liquid Glass 设计语言

**标准值**:
- **卡片/面板**: 12pt（中型组件）
- **按钮/输入框**: 8pt（小型组件）
- **图标背景**: 10pt（如分类图标）
- **全圆角**: 9999pt（圆形元素，如 FAB）

**当前项目状态**:
```typescript
// src/theme/spacing.ts (现有)
borderRadius: {
  sm: 4,   // 🔧 保持不变（用于小装饰元素）
  md: 8,   // ✅ 符合按钮标准
  lg: 12,  // ✅ 符合卡片标准
  xl: 16,  // 🔧 保持不变（用于大型卡片）
  full: 9999, // ✅ 符合圆形元素
}
```

**调整项**:
- ✅ 无需调整数值
- 应用规则: `Card` 使用 `borderRadius.lg` (12pt)，`Button` 使用 `borderRadius.md` (8pt)

### 阴影参数

**调研来源**: iOS HIG - Materials and Visual Effects

**标准值** (iOS 风格轻量阴影):
- **轻度阴影** (Elevation 1): 偏移 Y:1pt, 模糊 2pt, 不透明度 0.08
- **中度阴影** (Elevation 2): 偏移 Y:2pt, 模糊 4pt, 不透明度 0.12
- **重度阴影** (Elevation 3): 偏移 Y:4pt, 模糊 8pt, 不透明度 0.16

**当前项目状态**:
```typescript
// src/theme/spacing.ts (现有)
shadow: {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,  // 🔧 需调整为 0.08
    shadowRadius: 1,      // 🔧 需调整为 2
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,  // 🔧 需调整为 0.12
    shadowRadius: 2.5,    // 🔧 需调整为 4
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,   // 🔧 需调整为 0.16
    shadowRadius: 4.5,    // 🔧 需调整为 8
    elevation: 5,
  },
}
```

**决策**: 创建独立的 `shadows.ts` 文件

**理由**:
1. 阴影是独立的设计系统维度（与 spacing、colors 并列）
2. 便于统一管理浅色/深色模式的阴影变体
3. 提升代码可读性和可维护性

**新文件结构**:
```typescript
// src/theme/shadows.ts (新建)
export const shadows = {
  light: {  // 浅色模式阴影
    none: { /* ... */ },
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 2 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 3 },
  },
  dark: {  // 深色模式阴影（更重，增强对比）
    none: { /* ... */ },
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 2 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 3 },
  },
};
```

### 动画时长和缓动曲线

**调研来源**: Apple HIG - Motion

**标准值**:
- **快速反馈**: 0.15-0.2s（按钮点击、触觉反馈）
- **标准过渡**: 0.3-0.4s（页面切换、面板展开）
- **慢速动画**: 0.5-0.6s（复杂转场）

**缓动曲线**:
- **Ease In Out**: `cubic-bezier(0.42, 0, 0.58, 1)` - 平滑过渡
- **Ease Out**: `cubic-bezier(0, 0, 0.2, 1)` - 进入动画
- **Spring**: 阻尼 0.8，响应度 0.5（Reanimated 参数）

**决策**: 使用 Reanimated 的 `withSpring` 和 `withTiming`

```typescript
// 弹簧动画（底部面板）
withSpring(targetValue, {
  damping: 20,      // 阻尼系数（越大越不弹）
  stiffness: 200,   // 刚度（越大越快）
  mass: 1,          // 质量
  overshootClamping: false,  // 允许超调
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
});

// 时序动画（卡片淡入）
withTiming(targetValue, {
  duration: 350,    // 0.35s
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
});
```

---

## 4. 辅助功能集成研究

### 问题
需要确保视觉改版符合 WCAG AA 标准，并支持 iOS 辅助功能设置（减少透明度、增强对比度）。

### 调研方案

#### 4.1 颜色对比度验证

**标准**: WCAG 2.1 AA
- 普通文字（<18pt）: ≥4.5:1
- 大号文字（≥18pt）: ≥3:1
- UI 组件: ≥3:1

**工具选型**:
- **方案 A**: 在线工具（WebAIM Contrast Checker）
  - 优势: 免费、无需安装
  - 劣势: 手动检查，无法自动化
  
- **方案 B**: Jest 测试（`jest-axe` 或自定义对比度计算）
  - 优势: 自动化，CI 集成
  - 劣势: 需要编写测试用例

**决策**: 方案 B（自动化测试）

**实施**:
```typescript
// __tests__/theme/colors.test.ts
import { lightTheme, darkTheme } from '@/theme/colors';

// 对比度计算函数（WCAG 公式）
function getContrastRatio(fg: string, bg: string): number {
  // 实现 WCAG 对比度计算
  // ...
}

describe('Color Contrast - WCAG AA', () => {
  it('light mode text should meet 4.5:1 ratio', () => {
    const ratio = getContrastRatio(lightTheme.text, lightTheme.background);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('dark mode text should meet 4.5:1 ratio', () => {
    const ratio = getContrastRatio(darkTheme.text, darkTheme.background);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
```

#### 4.2 减少透明度检测

**API**: `AccessibilityInfo.isReduceTransparencyEnabled()`

**实施**:
```typescript
// src/utils/accessibility.ts (新建)
import { AccessibilityInfo } from 'react-native';

export async function shouldDisableBlur(): Promise<boolean> {
  try {
    const isReduceTransparency = await AccessibilityInfo.isReduceTransparencyEnabled();
    return isReduceTransparency;
  } catch (error) {
    console.error('Failed to check reduce transparency:', error);
    return false; // 默认启用毛玻璃
  }
}
```

**使用场景**:
- FilterBottomSheet: 如果启用"减少透明度"，使用不透明背景色
- ConfirmDialog: 同上
- Toast: 同上

#### 4.3 增强对比度支持

**API**: `AccessibilityInfo.isReduceMotionEnabled()` + 手动检测

**实施**:
- 当用户开启"增强对比度"时，提高边框线和分隔线的不透明度
- 从 10% 提升至 30%
- 当前项目已定义 `border` 和 `separator` 颜色，无需额外调整

---

## 5. 触觉反馈实现

### 问题
需要为按钮点击、删除操作、面板展开等交互添加触觉反馈，提升 iOS 用户体验。

### 调研方案

**库选型**: `expo-haptics`

**API**:
```typescript
import * as Haptics from 'expo-haptics';

// 轻度冲击（按钮点击）
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// 中度冲击（删除操作）
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// 重度冲击（错误提示）
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// 通知反馈（成功/警告/错误）
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// 选择反馈（滚轮选择器）
Haptics.selectionAsync();
```

**触发时机**:
| 交互 | 反馈类型 | 理由 |
|------|---------|------|
| 按钮点击 | Light Impact | 轻量交互，避免过度反馈 |
| FAB 展开 | Medium Impact | 重要操作，需明确反馈 |
| 删除确认 | Warning Notification | 警示性操作 |
| 删除成功 | Success Notification | 操作完成 |
| 面板展开 | Light Impact | 轻量交互 |
| 筛选应用 | Selection | 选择确认 |

**实施**:
```typescript
// src/hooks/useHaptics.ts (新建)
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function useHaptics() {
  const triggerLight = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const triggerMedium = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const triggerSuccess = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const triggerWarning = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return { triggerLight, triggerMedium, triggerSuccess, triggerWarning };
}
```

**安装命令**:
```bash
npx expo install expo-haptics
```

---

## 6. 深色模式配色调整

### 问题
当前深色模式配色使用 `#000000` 背景，需调整为 iOS 风格的 elevated 颜色系统。

### iOS 深色模式标准

**调研来源**: Apple HIG - Dark Mode

**标准配色**:
- **System Background**: `#000000`（最底层背景）
- **Elevated Background**: `#1C1C1E`（卡片、面板背景）
- **Elevated 2**: `#2C2C2E`（嵌套卡片）
- **Separator**: `#38383A`（分隔线）

**当前项目状态**:
```typescript
// src/theme/colors.ts (现有)
export const darkTheme = {
  background: '#000000',              // ✅ 符合标准
  backgroundSecondary: '#1C1C1E',     // ✅ 符合标准
  backgroundTertiary: '#2C2C2E',      // ✅ 符合标准
  card: '#1C1C1E',                    // ✅ 符合标准
  border: '#38383A',                  // ✅ 符合标准
  // ...
};
```

**决策**: ✅ 无需调整

**理由**: 当前深色模式配色已符合 iOS 标准。仅需验证实际应用效果（卡片是否使用 `card` 颜色）。

---

## 7. 性能降级策略

### 问题
低端设备（如 iPhone 8）可能无法在启用毛玻璃效果时保持 ≥55fps，需要自动降级策略。

### 降级触发条件

1. **设备检测**: 
   - 使用 `expo-device` 获取设备型号
   - iPhone 8 及以下、Android 低端设备（内存 <2GB）

2. **运行时 FPS 检测**:
   - 使用 Reanimated 的 `useFrameCallback` 监控 FPS
   - 连续 3 帧 <45fps 时触发降级

3. **用户设置检测**:
   - "减少透明度"启用时强制降级
   - "减少动效"启用时简化动画

### 降级方案

| 功能 | 正常模式 | 降级模式 |
|------|---------|---------|
| 毛玻璃背景 | `<BlurView intensity={80}>` | 不透明背景色 `backgroundColor: colors.card` |
| 底部面板动画 | 弹簧动画（0.35s） | 线性动画（0.25s） |
| FAB 展开动画 | 错开动画（每个 50ms 延迟） | 同时展开（0.2s） |
| 卡片阴影 | 标准阴影 | 轻量阴影或无阴影 |

### 实施

```typescript
// src/utils/performance.ts (新建)
import { useRef, useEffect, useState } from 'react';
import { useFrameCallback } from 'react-native-reanimated';

export function usePerformanceMonitor() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const frameTimestamps = useRef<number[]>([]);

  useFrameCallback((frameInfo) => {
    const now = frameInfo.timestamp;
    frameTimestamps.current.push(now);

    // 保留最近 10 帧
    if (frameTimestamps.current.length > 10) {
      frameTimestamps.current.shift();
    }

    // 计算平均 FPS
    if (frameTimestamps.current.length >= 10) {
      const duration = now - frameTimestamps.current[0];
      const fps = (frameTimestamps.current.length / duration) * 1000;

      if (fps < 45) {
        setIsLowPerformance(true);
      }
    }
  });

  return isLowPerformance;
}
```

---

## Summary of Decisions

| 决策项 | 选择方案 | 理由 |
|--------|---------|------|
| 毛玻璃效果 | `expo-blur` | Expo 官方支持，managed workflow 兼容 |
| 动画库 | Reanimated 3 | UI 线程动画，性能最优 |
| 圆角半径 | 保持现有配置（12pt/8pt） | 已符合 iOS 标准 |
| 阴影定义 | 创建独立 `shadows.ts` | 统一管理浅色/深色阴影 |
| 对比度测试 | Jest 自动化测试 | CI 集成，持续验证 |
| 触觉反馈 | `expo-haptics` | Expo 官方库，API 简洁 |
| 深色模式配色 | 保持现有配色 | 已符合 iOS 标准 |
| 性能降级 | 运行时 FPS 检测 + 用户设置 | 自动化降级，保证可用性 |

**所有 NEEDS CLARIFICATION 已解决** ✅

下一步: 执行 Phase 1（设计数据模型和契约）
