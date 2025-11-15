# Data Model: iOS 风格视觉改版主题系统

**Feature**: 003-ios-visual-redesign  
**Date**: 2025-11-15  
**Status**: Draft

## Overview

本文档定义 iOS 风格视觉改版的核心数据模型，包括扩展的主题系统（Theme）、阴影配置（Shadow）、动画配置（Animation）、毛玻璃材质（BlurMaterial）等实体。

所有实体遵循 TypeScript strict mode 类型定义，支持浅色/深色模式动态切换，满足 Constitution Principle II（代码质量）和 Principle VI（深色模式）要求。

---

## 1. Theme（主题系统）

### 实体定义

**Theme** 是应用的完整视觉系统，包含颜色、字体、间距、阴影、动画等所有设计维度。

### 字段

| 字段 | 类型 | 说明 | 示例值 |
|------|------|------|--------|
| `colors` | `ThemeColors` | 颜色系统（语义化颜色定义） | `{ primary: '#007AFF', background: '#FFFFFF', ... }` |
| `typography` | `Typography` | 字体系统（字号、字重、行高） | `{ fontSize: { body: 17 }, fontWeight: { regular: '400' }, ... }` |
| `spacing` | `Spacing` | 间距系统（8pt 网格、圆角、边距） | `{ sm: 8, md: 16, borderRadius: { md: 8, lg: 12 }, ... }` |
| `shadows` | `Shadows` | 阴影系统（浅色/深色模式阴影） | `{ light: { sm: {...}, md: {...} }, dark: {...} }` |
| `animations` | `Animations` | 动画配置（时长、缓动、弹簧参数） | `{ duration: { normal: 350 }, spring: { default: {...} }, ... }` |
| `colorScheme` | `'light' \| 'dark'` | 当前主题模式 | `'light'` 或 `'dark'` |
| `isDark` | `boolean` | 是否为深色模式 | `true` 或 `false` |

### 关系

- **Theme** 由多个子系统组成（Colors, Typography, Spacing, Shadows, Animations）
- 每个子系统独立定义，通过 `useTheme` hook 统一访问
- 子系统之间互不依赖（松耦合设计）

### 验证规则

- `colorScheme` 必须为 `'light'` 或 `'dark'`
- `colors` 必须包含所有语义化颜色（`primary`, `background`, `text` 等）
- `spacing` 的基础单位必须为 8 的倍数
- `shadows` 必须包含浅色和深色模式的所有级别（`none`, `sm`, `md`, `lg`）

### 使用示例

```typescript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { colors, spacing, shadows, animations, isDark } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.card,
      padding: spacing.md,
      borderRadius: spacing.borderRadius.lg,
      ...shadows[isDark ? 'dark' : 'light'].md,
    }}>
      {/* 内容 */}
    </View>
  );
}
```

---

## 2. Shadow（阴影配置）

### 实体定义

**Shadow** 定义组件的阴影样式，支持浅色/深色模式自动适配，遵循 iOS 设计语言的轻量阴影风格。

### 字段

| 字段 | 类型 | 说明 | 示例值 |
|------|------|------|--------|
| `shadowColor` | `string` | 阴影颜色（十六进制） | `'#000000'` |
| `shadowOffset` | `{ width: number; height: number }` | 阴影偏移（pt） | `{ width: 0, height: 2 }` |
| `shadowOpacity` | `number` | 阴影不透明度（0-1） | `0.12` |
| `shadowRadius` | `number` | 阴影模糊半径（pt） | `4` |
| `elevation` | `number` | Android 阴影层级（1-5） | `2` |

### 阴影级别

**浅色模式** (`shadows.light`):

| 级别 | 偏移 Y | 模糊半径 | 不透明度 | 使用场景 |
|------|--------|---------|---------|---------|
| `none` | 0 | 0 | 0 | 无阴影（平面元素） |
| `sm` | 1pt | 2pt | 0.08 | 轻度浮起（列表项） |
| `md` | 2pt | 4pt | 0.12 | 中度浮起（卡片） |
| `lg` | 4pt | 8pt | 0.16 | 重度浮起（对话框、FAB） |

**深色模式** (`shadows.dark`):

| 级别 | 偏移 Y | 模糊半径 | 不透明度 | 说明 |
|------|--------|---------|---------|------|
| `none` | 0 | 0 | 0 | 无阴影 |
| `sm` | 1pt | 2pt | 0.3 | 深色模式阴影更重（增强对比） |
| `md` | 2pt | 4pt | 0.4 | 中度阴影 |
| `lg` | 4pt | 8pt | 0.5 | 重度阴影 |

### 验证规则

- `shadowOpacity` 必须在 0-1 之间
- `shadowRadius` 必须 ≥0
- `elevation` 必须在 0-5 之间（Android 限制）
- 深色模式阴影不透明度 ≥ 浅色模式（增强对比）

### 使用示例

```typescript
import { useTheme } from '@/hooks/useTheme';

function Card({ children }) {
  const { colors, spacing, shadows, isDark } = useTheme();

  return (
    <View style={[
      {
        backgroundColor: colors.card,
        borderRadius: spacing.borderRadius.lg,
        padding: spacing.md,
      },
      shadows[isDark ? 'dark' : 'light'].md,  // 自动适配模式
    ]}>
      {children}
    </View>
  );
}
```

---

## 3. Animation（动画配置）

### 实体定义

**Animation** 定义应用的标准动画参数，包括时长、缓动曲线和弹簧动画参数，确保全局动画风格一致。

### 字段

| 字段 | 类型 | 说明 | 示例值 |
|------|------|------|--------|
| `duration` | `DurationConfig` | 动画时长配置（ms） | `{ instant: 0, fast: 200, normal: 350, slow: 500 }` |
| `easing` | `EasingConfig` | 缓动曲线配置 | `{ easeInOut: [0.25, 0.1, 0.25, 1] }` |
| `spring` | `SpringConfig` | 弹簧动画参数 | `{ default: { damping: 20, stiffness: 200 } }` |

### 子类型定义

#### DurationConfig（时长配置）

| 字段 | 值（ms） | 使用场景 |
|------|---------|---------|
| `instant` | 0 | 立即执行（无动画） |
| `fast` | 200 | 快速反馈（按钮点击、触觉反馈） |
| `normal` | 350 | 标准过渡（面板展开、卡片淡入） |
| `slow` | 500 | 慢速动画（复杂转场、图表更新） |

#### EasingConfig（缓动曲线）

| 字段 | 贝塞尔值 | 说明 |
|------|---------|------|
| `easeInOut` | `[0.25, 0.1, 0.25, 1]` | 平滑过渡（标准曲线） |
| `easeOut` | `[0, 0, 0.2, 1]` | 减速进入（元素出现） |
| `easeIn` | `[0.4, 0, 1, 1]` | 加速退出（元素消失） |

#### SpringConfig（弹簧参数）

| 字段 | 参数 | 使用场景 |
|------|------|---------|
| `gentle` | `{ damping: 15, stiffness: 150 }` | 柔和弹簧（装饰性动画） |
| `default` | `{ damping: 20, stiffness: 200 }` | 标准弹簧（底部面板、对话框） |
| `bouncy` | `{ damping: 10, stiffness: 100 }` | 弹性强（强调性动画、错误提示） |

### 验证规则

- `duration` 所有值必须 ≥0
- `easing` 数组必须包含 4 个元素（贝塞尔曲线）
- `spring.damping` 必须 >0（避免无限振荡）
- `spring.stiffness` 必须 >0

### 使用示例（Reanimated 3）

```typescript
import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

function AnimatedCard() {
  const { animations } = useTheme();
  const translateY = useSharedValue(100);

  // 弹簧动画
  const slideIn = () => {
    translateY.value = withSpring(0, animations.spring.default);
  };

  // 时序动画
  const fadeOut = () => {
    opacity.value = withTiming(0, {
      duration: animations.duration.normal,
      easing: animations.easing.easeOut,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{/* 内容 */}</Animated.View>;
}
```

---

## 4. BlurMaterial（毛玻璃材质）

### 实体定义

**BlurMaterial** 定义毛玻璃效果的材质参数，支持浅色/深色模式和性能降级。

### 字段

| 字段 | 类型 | 说明 | 示例值 |
|------|------|------|--------|
| `intensity` | `number` | 模糊强度（0-100） | `80` |
| `tint` | `'light' \| 'dark' \| 'default'` | 色调（自动适配主题） | `'light'` 或 `'dark'` |
| `fallbackColor` | `string` | 降级时的纯色背景 | `'#FFFFFFCC'`（浅色）或 `'#1C1C1ECC'`（深色） |

### 材质类型

| 类型 | 强度 | 色调 | 使用场景 |
|------|------|------|---------|
| `regular` | 80 | 自动 | 底部面板、对话框背景 |
| `prominent` | 95 | 自动 | 全屏遮罩、重要提示 |
| `thin` | 50 | 自动 | 轻量浮层、Toast |

### 降级策略

当满足以下任一条件时，使用 `fallbackColor` 替代毛玻璃效果：
1. 用户启用"减少透明度"（`AccessibilityInfo.isReduceTransparencyEnabled()`）
2. 运行时 FPS < 45（连续 3 帧）
3. 设备为 iPhone 8 或更低（可选）

### 验证规则

- `intensity` 必须在 0-100 之间
- `tint` 必须为 `'light'`, `'dark'`, 或 `'default'`
- `fallbackColor` 必须为有效的颜色字符串（十六进制或 rgba）

### 使用示例

```typescript
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { shouldDisableBlur } from '@/utils/accessibility';

function BlurredPanel({ children }) {
  const { isDark, colors } = useTheme();
  const [disableBlur, setDisableBlur] = useState(false);

  useEffect(() => {
    shouldDisableBlur().then(setDisableBlur);
  }, []);

  if (disableBlur) {
    // 降级为不透明背景
    return (
      <View style={{ backgroundColor: colors.filterBackground }}>
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={80}
      tint={isDark ? 'dark' : 'light'}
      style={StyleSheet.absoluteFill}
    >
      {children}
    </BlurView>
  );
}
```

---

## 5. CardStyle（卡片样式预设）

### 实体定义

**CardStyle** 定义统一的卡片组件样式预设，简化组件实现，确保视觉一致性。

### 字段

| 字段 | 类型 | 说明 | 示例值 |
|------|------|------|--------|
| `backgroundColor` | `string` | 背景颜色 | `colors.card` |
| `borderRadius` | `number` | 圆角半径（pt） | `12` |
| `padding` | `number` | 内边距（pt） | `16` |
| `shadow` | `ShadowStyle` | 阴影样式 | `shadows.light.md` |
| `borderWidth` | `number` | 边框宽度（可选） | `0` 或 `1` |
| `borderColor` | `string` | 边框颜色（可选） | `colors.border` |

### 预设类型

| 预设 | 圆角 | 阴影 | 内边距 | 使用场景 |
|------|------|------|--------|---------|
| `default` | 12pt | md | 16pt | 标准卡片（交易列表项、统计卡片） |
| `elevated` | 12pt | lg | 16pt | 强调卡片（对话框、重要信息） |
| `flat` | 12pt | none | 16pt | 平面卡片（分组内部卡片） |
| `compact` | 8pt | sm | 12pt | 紧凑卡片（标签、芯片） |

### 使用示例

```typescript
import { useTheme } from '@/hooks/useTheme';

// 方式 1: 手动组合
function CustomCard() {
  const { colors, spacing, shadows, isDark } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.card,
      borderRadius: spacing.borderRadius.lg,
      padding: spacing.md,
      ...shadows[isDark ? 'dark' : 'light'].md,
    }}>
      {/* 内容 */}
    </View>
  );
}

// 方式 2: 使用预设函数（推荐）
import { getCardStyle } from '@/theme/cardStyles';

function PresetCard() {
  const theme = useTheme();

  return (
    <View style={getCardStyle('default', theme)}>
      {/* 内容 */}
    </View>
  );
}
```

---

## 6. HapticsConfig（触觉反馈配置）

### 实体定义

**HapticsConfig** 定义触觉反馈的类型和使用场景，仅在 iOS 设备上触发。

### 字段

| 字段 | 类型 | 说明 | 对应 API |
|------|------|------|---------|
| `type` | `'impact' \| 'notification' \| 'selection'` | 反馈类型 | `Haptics.impactAsync` 等 |
| `style` | `'light' \| 'medium' \| 'heavy'` | 强度（impact 专用） | `ImpactFeedbackStyle` |
| `feedback` | `'success' \| 'warning' \| 'error'` | 通知类型（notification 专用） | `NotificationFeedbackType` |

### 使用场景映射

| 交互 | 类型 | 强度/反馈 | 说明 |
|------|------|-----------|------|
| 按钮点击 | impact | light | 轻量交互 |
| FAB 展开 | impact | medium | 重要操作 |
| 删除确认 | notification | warning | 警示性操作 |
| 删除成功 | notification | success | 操作完成 |
| 删除失败 | notification | error | 操作失败 |
| 面板展开 | impact | light | 轻量交互 |
| 筛选应用 | selection | - | 选择确认 |

### 使用示例

```typescript
import { useHaptics } from '@/hooks/useHaptics';

function DeleteButton({ onDelete }) {
  const { triggerWarning, triggerSuccess } = useHaptics();

  const handleDelete = async () => {
    triggerWarning(); // 触发警告反馈

    try {
      await onDelete();
      triggerSuccess(); // 触发成功反馈
    } catch (error) {
      // 错误处理
    }
  };

  return <Button onPress={handleDelete}>删除</Button>;
}
```

---

## Entity Relationships

```text
Theme (主题系统)
├── colors: ThemeColors (颜色系统)
├── typography: Typography (字体系统)
├── spacing: Spacing (间距系统)
├── shadows: Shadows (阴影系统)
│   ├── light: ShadowSet (浅色模式阴影)
│   │   ├── none: ShadowStyle
│   │   ├── sm: ShadowStyle
│   │   ├── md: ShadowStyle
│   │   └── lg: ShadowStyle
│   └── dark: ShadowSet (深色模式阴影)
│       └── ... (同上)
├── animations: Animations (动画配置)
│   ├── duration: DurationConfig
│   ├── easing: EasingConfig
│   └── spring: SpringConfig
└── colorScheme: 'light' | 'dark'

BlurMaterial (毛玻璃材质)
├── intensity: number
├── tint: 'light' | 'dark' | 'default'
└── fallbackColor: string

CardStyle (卡片样式预设)
├── backgroundColor: string (from colors)
├── borderRadius: number (from spacing)
├── padding: number (from spacing)
└── shadow: ShadowStyle (from shadows)

HapticsConfig (触觉反馈配置)
├── type: 'impact' | 'notification' | 'selection'
├── style: 'light' | 'medium' | 'heavy' (可选)
└── feedback: 'success' | 'warning' | 'error' (可选)
```

---

## State Transitions

### 主题切换流程

```text
[用户切换系统主题]
  ↓
[useColorScheme 检测变化]
  ↓
[useTheme 返回新主题]
  ↓
[组件重新渲染]
  ↓
[应用新的 colors, shadows]
```

### 毛玻璃降级流程

```text
[组件挂载]
  ↓
[检测"减少透明度"设置]
  ↓
[YES] → [使用 fallbackColor]
[NO]  → [检测运行时 FPS]
           ↓
        [FPS < 45?]
           ↓
        [YES] → [降级为纯色]
        [NO]  → [使用 BlurView]
```

---

## Validation Summary

| 实体 | 必须验证的规则 | 验证方式 |
|------|---------------|---------|
| Theme | 颜色对比度 ≥4.5:1 | Jest 自动化测试（WCAG 公式） |
| Shadow | 不透明度 0-1, elevation 0-5 | TypeScript 类型检查 + 运行时断言 |
| Animation | duration ≥0, damping >0 | TypeScript 类型检查 |
| BlurMaterial | intensity 0-100 | TypeScript 类型检查 + 组件 prop 验证 |
| CardStyle | borderRadius >0, padding ≥0 | TypeScript 类型检查 |

---

**Next Steps**: 
1. 基于本数据模型创建 TypeScript 类型定义（contracts/）
2. 实现 `useTheme` 扩展版本
3. 创建 `useHaptics` hook
4. 编写单元测试验证所有验证规则
