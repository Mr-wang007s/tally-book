# Quickstart: iOS 风格视觉改版

**Feature**: 003-ios-visual-redesign  
**Branch**: `003-ios-visual-redesign`  
**Last Updated**: 2025-11-15

## Overview

本指南帮助开发者快速启动 iOS 风格视觉改版的开发、测试和预览工作。涵盖环境设置、依赖安装、开发流程和常见问题解决。

---

## Prerequisites

确保以下工具已安装：

- **Node.js**: ≥18.0.0 (推荐 18.x LTS)
- **npm**: ≥9.0.0 或 **yarn**: ≥1.22.0
- **Expo CLI**: 通过 `npx expo` 使用（无需全局安装）
- **iOS Simulator** (macOS): Xcode ≥14.0
- **Android Emulator** (可选): Android Studio + API 31+

---

## Step 1: 安装依赖

### 1.1 安装新增依赖包

```bash
# 切换到项目根目录
cd /data/workspace/my-tally-book

# 安装毛玻璃效果库
npx expo install expo-blur

# 安装触觉反馈库
npx expo install expo-haptics

# 验证 package.json 已更新
grep -E "(expo-blur|expo-haptics)" package.json
```

**预期输出**:
```json
"expo-blur": "~13.0.2",
"expo-haptics": "~13.0.1",
```

### 1.2 安装所有依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

---

## Step 2: 启动开发服务器

### 2.1 启动 Expo Dev Server

```bash
# 启动开发服务器
npx expo start

# 或使用快捷命令
npm start
```

**预期输出**:
```
› Metro waiting on exp://192.168.1.xxx:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

### 2.2 在模拟器中打开

**iOS Simulator**:
```bash
# 按 i 键，或运行
npx expo start --ios
```

**Android Emulator**:
```bash
# 按 a 键，或运行
npx expo start --android
```

**Web Browser** (用于快速调试布局，不支持毛玻璃效果):
```bash
# 按 w 键，或运行
npx expo start --web
```

---

## Step 3: 开发流程（TDD）

遵循 Constitution Principle III（测试驱动开发），所有视觉改版遵循以下流程：

### 3.1 编写测试（先行）

**示例：更新 Card 组件测试**

```bash
# 打开测试文件
code __tests__/components/ui/Card.test.tsx
```

```typescript
// __tests__/components/ui/Card.test.tsx
import { render } from '@testing-library/react-native';
import { Card } from '@/components/ui/Card';

describe('Card - iOS Visual Redesign', () => {
  it('should use 12pt border radius', () => {
    const { getByTestId } = render(
      <Card testID="test-card">Content</Card>
    );
    
    const card = getByTestId('test-card');
    expect(card.props.style).toMatchObject({
      borderRadius: 12,  // 新的 iOS 标准
    });
  });

  it('should apply medium shadow in light mode', () => {
    const { getByTestId } = render(
      <Card testID="test-card" elevation="md">Content</Card>
    );
    
    const card = getByTestId('test-card');
    expect(card.props.style.shadowOpacity).toBe(0.12);  // 新的阴影不透明度
    expect(card.props.style.shadowRadius).toBe(4);     // 新的模糊半径
  });
});
```

**运行测试（应失败）**:
```bash
npm test -- Card.test.tsx

# 预期输出: ❌ Test failed (因为尚未实现新样式)
```

### 3.2 实现功能

**示例：更新 Card 组件**

```bash
# 打开组件文件
code src/components/ui/Card.tsx
```

```typescript
// src/components/ui/Card.tsx
import { useTheme } from '@/hooks/useTheme';

export function Card({ children, elevation = 'md', testID }) {
  const { colors, spacing, shadows, isDark } = useTheme();

  return (
    <View
      testID={testID}
      style={{
        backgroundColor: colors.card,
        borderRadius: spacing.borderRadius.lg,  // 12pt
        padding: spacing.md,
        ...shadows[isDark ? 'dark' : 'light'][elevation],  // 新阴影系统
      }}
    >
      {children}
    </View>
  );
}
```

### 3.3 重新运行测试（应通过）

```bash
npm test -- Card.test.tsx

# 预期输出: ✅ All tests passed
```

### 3.4 验证覆盖率

```bash
# 运行覆盖率报告
npm run test:coverage

# 查看覆盖率（应 ≥90%）
open coverage/lcov-report/index.html  # macOS
# 或 xdg-open coverage/lcov-report/index.html  # Linux
```

---

## Step 4: 预览视觉效果

### 4.1 在真机上测试（推荐）

**为什么需要真机测试？**
- 毛玻璃效果在模拟器上可能显示不准确
- 触觉反馈仅在真机上工作
- 性能测试必须在真机上进行

**使用 Expo Go**:
1. 在手机上安装 [Expo Go](https://expo.dev/client)
2. 扫描终端显示的 QR 码
3. 应用自动加载

**测试清单**:
- [ ] 毛玻璃效果是否实时模糊背景？
- [ ] 动画是否流畅（≥60fps）？
- [ ] 触觉反馈是否触发？
- [ ] 深色模式是否正确适配？

### 4.2 性能监控

**启用 Performance Monitor**:
```bash
# iOS Simulator
Cmd + D → Performance Monitor

# Android Emulator
Cmd + M → Performance Monitor
```

**目标指标**:
- **UI 线程 FPS**: ≥60fps（滚动、动画时）
- **JS 线程 FPS**: ≥55fps
- **内存**: <200MB

### 4.3 辅助功能测试

**iOS 设备设置**:
1. 打开 **设置 → 辅助功能 → 显示与文字大小**
2. 启用以下选项逐一测试：
   - [ ] **增强对比度** - 验证边框是否变清晰
   - [ ] **减少透明度** - 验证毛玻璃是否降级为纯色
   - [ ] **减少动效** - 验证动画是否简化
   - [ ] **更大字体** - 验证布局是否自适应（100%-310%）

**Android 设备设置**:
1. 打开 **设置 → 无障碍 → 显示**
2. 测试 **移除动画** 和 **高对比度文字**

---

## Step 5: 调试常见问题

### 问题 1: 毛玻璃效果不显示

**症状**: `BlurView` 渲染为纯色背景

**解决方案**:
```bash
# 1. 检查 expo-blur 是否正确安装
npm list expo-blur

# 2. 清除缓存并重新构建
npx expo start --clear

# 3. 在真机上测试（模拟器可能不支持）
```

**代码检查**:
```typescript
// 确保导入正确
import { BlurView } from 'expo-blur';  // ✅ 正确
// import { BlurView } from 'react-native';  // ❌ 错误

// 确保 intensity 在 0-100 范围内
<BlurView intensity={80} tint="light">  // ✅ 正确
// <BlurView intensity={200} tint="light">  // ❌ 错误
```

### 问题 2: 触觉反馈不工作

**症状**: 点击按钮没有振动反馈

**解决方案**:
```bash
# 1. 确认在真机上测试（模拟器不支持触觉反馈）
# 2. 检查设备设置 → 声音与触感 → 系统触感反馈 是否启用
# 3. 检查代码是否仅在 iOS 上触发
```

**代码检查**:
```typescript
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// ✅ 正确：检查平台
if (Platform.OS === 'ios') {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

// ❌ 错误：未检查平台
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

### 问题 3: 深色模式颜色不对

**症状**: 切换深色模式后，部分元素颜色不变

**解决方案**:
```bash
# 1. 检查是否使用 useTheme hook
# 2. 检查是否硬编码颜色值

# 查找硬编码颜色（应返回 0 结果）
grep -r "#[0-9A-Fa-f]\{6\}" src/components/ --include="*.tsx"
```

**代码检查**:
```typescript
// ❌ 错误：硬编码颜色
<View style={{ backgroundColor: '#FFFFFF' }}>

// ✅ 正确：使用主题颜色
const { colors } = useTheme();
<View style={{ backgroundColor: colors.card }}>
```

### 问题 4: 动画卡顿

**症状**: 底部面板展开时卡顿，FPS < 45

**解决方案**:
```bash
# 1. 检查是否使用 Reanimated 3（而非 Animated API）
# 2. 检查是否在动画中读取 JS 状态

# 查看 Reanimated 版本
npm list react-native-reanimated
# 应显示 ~3.10.1
```

**代码检查**:
```typescript
// ❌ 错误：使用 Animated API（JS 线程）
import { Animated } from 'react-native';
const translateY = new Animated.Value(0);
Animated.spring(translateY, { toValue: 100 }).start();

// ✅ 正确：使用 Reanimated（UI 线程）
import { useSharedValue, withSpring } from 'react-native-reanimated';
const translateY = useSharedValue(0);
translateY.value = withSpring(100);
```

### 问题 5: 测试失败 "Cannot find module 'expo-blur'"

**症状**: 运行 `npm test` 时报错

**解决方案**:
```bash
# 1. 添加 Jest mock for expo-blur
# 编辑 jest.setup.js

echo "jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));" >> jest.setup.js

# 2. 重新运行测试
npm test
```

---

## Step 6: 提交代码

### 6.1 提交前检查

```bash
# 1. TypeScript 类型检查
npm run type-check
# 应输出: ✅ No errors

# 2. ESLint 检查
npx eslint src/ --ext .ts,.tsx
# 应输出: ✅ 0 errors, 0 warnings

# 3. 所有测试通过
npm test
# 应输出: ✅ All tests passed

# 4. 覆盖率 ≥90%
npm run test:coverage
# 查看 coverage/lcov-report/index.html
```

### 6.2 提交流程

```bash
# 1. 暂存变更
git add src/theme/shadows.ts src/components/ui/Card.tsx __tests__/...

# 2. 提交（遵循 TDD 原则，测试先行）
git commit -m "feat: update Card component with iOS 12pt border radius and new shadow system

- Add shadows.ts with light/dark mode shadow definitions
- Update Card component to use new shadow system
- Add tests for 12pt border radius and shadow opacity
- Tests pass with 95% coverage

Follows TDD workflow: tests written before implementation
Refs: #003-ios-visual-redesign"

# 3. 推送到远程
git push origin 003-ios-visual-redesign
```

---

## 快速命令参考

| 命令 | 说明 |
|------|------|
| `npm start` | 启动 Expo 开发服务器 |
| `npm test` | 运行所有测试 |
| `npm run test:watch` | 监听模式运行测试 |
| `npm run test:coverage` | 生成覆盖率报告 |
| `npm run type-check` | TypeScript 类型检查 |
| `npx expo start --clear` | 清除缓存并启动 |
| `npx expo start --ios` | 在 iOS 模拟器中打开 |
| `npx expo start --android` | 在 Android 模拟器中打开 |
| `npx eslint src/ --ext .ts,.tsx` | 运行 ESLint 检查 |

---

## 常用文件路径

| 路径 | 说明 |
|------|------|
| `src/theme/` | 主题系统定义（colors, spacing, typography, shadows, animations） |
| `src/components/ui/` | 基础 UI 组件（Button, Card, Input 等） |
| `src/components/features/` | 功能组件（ExpenseListItem, FilterBottomSheet 等） |
| `src/hooks/` | 自定义 Hooks（useTheme, useHaptics） |
| `__tests__/` | 测试文件（与 src/ 结构对应） |
| `specs/003-ios-visual-redesign/` | 功能规格文档 |

---

## 相关文档

- [Feature Specification](./spec.md) - 功能需求和成功标准
- [Implementation Plan](./plan.md) - 实施计划和技术上下文
- [Research](./research.md) - 技术调研和决策记录
- [Data Model](./data-model.md) - 数据模型和实体定义
- [Type Contracts](./contracts/theme-system.ts) - TypeScript 类型契约

---

## 获取帮助

**项目相关问题**:
1. 查看 [Constitution](../.specify/memory/constitution.md) 了解项目规范
2. 查看现有组件实现作为参考
3. 运行 `npm test -- --verbose` 查看详细测试输出

**Expo 相关问题**:
- [Expo 文档](https://docs.expo.dev/)
- [expo-blur 文档](https://docs.expo.dev/versions/latest/sdk/blur-view/)
- [expo-haptics 文档](https://docs.expo.dev/versions/latest/sdk/haptics/)

**React Native 相关问题**:
- [React Native 文档](https://reactnative.dev/)
- [Reanimated 文档](https://docs.swmansion.com/react-native-reanimated/)

---

**Happy Coding!** 🎨✨
