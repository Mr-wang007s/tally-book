# Implementation Plan: iOS 风格视觉改版

**Branch**: `003-ios-visual-redesign` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/003-ios-visual-redesign/spec.md`

## Summary

**Primary Requirement**: 基于 Apple iOS 设计语言（参考 iOS 26 Liquid Glass 风格），对记账应用进行全面视觉改版，包括简约卡片设计、柔和圆角、毛玻璃效果、流畅动画、完整的深色模式支持和无障碍优化。

**Technical Approach**: 
- 升级现有主题系统，调整间距为严格 8pt 网格、圆角为 12pt（卡片）/8pt（按钮）、阴影参数符合 iOS 规范
- 使用 `expo-blur` 库为底部面板、对话框添加毛玻璃背景效果（`BlurView`）
- 使用 `react-native-reanimated` 3 优化所有动画（底部面板弹簧动画、卡片淡入淡出、FAB 展开错开动画）
- 扩展现有的 `useTheme` hook，添加动画配置、毛玻璃材质定义、卡片样式预设
- 优化 `ExpenseListItem`、`FilterBottomSheet`、`FloatingActionButton`、`ConfirmDialog` 等组件的视觉样式
- 确保所有颜色使用语义化定义（无硬编码），对比度≥4.5:1，深色模式完整适配

## Technical Context

**Language/Version**: TypeScript 5.3.3 (strict mode enabled), Expo SDK 51.0.0  
**Primary Dependencies**: 
- React Native 0.74.5
- React Navigation 6+ (`@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
- `react-native-reanimated` 3.10.1 (已安装)
- `react-native-gesture-handler` 2.16.1 (已安装)
- `@gorhom/bottom-sheet` 4.6.4 (已安装)
- `expo-blur` (需安装 - 毛玻璃效果)
- `@expo/vector-icons` 14.0.2 (已安装)

**Storage**: AsyncStorage (已集成，用于持久化用户偏好)  
**Testing**: Jest 29.7.0, @testing-library/react-native 12.5.1, React Test Renderer 18.2.0  
**Target Platform**: iOS 15.0+, Android 6.0+ (Expo managed workflow)  
**Project Type**: mobile (Expo/React Native cross-platform app)  
**Performance Goals**: 
- 列表滚动 ≥60fps（已满足，使用 FlatList 虚拟化）
- 毛玻璃效果启用时 ≥55fps（中端设备），低端设备降级为半透明纯色
- 冷启动到交互 <3s
- 包大小增量 <500KB（使用矢量图标，避免大量图片资源）
- 测试覆盖率 ≥90%（当前项目标准）

**Constraints**: 
- Apple HIG compliance (已在 Constitution 中强制要求)
- WCAG AA accessibility (对比度 ≥4.5:1)
- Dark Mode support (已实现基础版本，需升级为 iOS 风格)
- Safe Area layouts (已使用 `SafeAreaView`)
- 不改变现有交互逻辑（仅调整视觉呈现）
- 保持与现有 002-transaction-detail-interaction 功能的兼容性

**Scale/Scope**: 
- 5 个用户故事（P1: 2 个，P2: 2 个，P3: 1 个）
- 影响组件: 12 个（4 个 UI 组件 + 8 个 feature 组件）
- 主题文件: 4 个（colors, spacing, typography, shadows - 需新增 shadows）
- 预估工作量: 3-4 个开发周期（每周期 2 天）
- 测试用例: 约 25 个新增/修改的测试（组件快照 + 动画行为 + 主题切换）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Verify compliance with Tally Book Constitution v2.0.0:**

- [x] **HIG Compliance (Principle I)**: 
  - ✅ 已使用 `@expo/vector-icons` (Ionicons 风格接近 SF Symbols)
  - ✅ 已使用 `useColorScheme` 实现深色模式
  - ✅ 布局已使用 Flexbox 和响应式单位
  - 🔧 **待优化**: 调整间距为严格 8pt 网格，圆角为 12pt/8pt，添加 SF Symbols 风格图标
  
- [x] **Code Quality (Principle II)**: 
  - ✅ TypeScript strict mode 已启用
  - ✅ 组件已分离为 `ui/` (展示) 和 `features/` (容器)
  - ✅ 业务逻辑已封装在自定义 Hooks (`useTheme`, `useExpenses`, `useCategories`)
  - ✅ ESLint 已配置 (`@expo/eslint-config`)
  - 🔧 **待优化**: 新增主题配置和动画 Hook 需遵循相同架构

- [x] **Test-First (Principle III)**: 
  - ✅ Jest + React Native Testing Library 已配置
  - ✅ 当前测试覆盖率目标 90%
  - ⚠️ **计划**: 视觉改版将采用 TDD - 先编写组件快照测试和动画行为测试，再实现视觉变更
  - 📋 **验收**: 所有视觉变更的 PR 必须包含"测试先行"的 Git 提交历史

- [x] **Accessibility (Principle IV)**: 
  - ✅ 现有组件已添加 `accessibilityLabel` 和 `accessibilityRole`
  - ✅ 触摸目标已满足 44pt 最小尺寸（使用 `hitSlop`）
  - ✅ 字体缩放已启用 (`allowFontScaling={true}`)
  - 🔧 **待验证**: 调整后的颜色对比度必须通过 WCAG AA 标准（≥4.5:1）
  - 📋 **新增**: 毛玻璃效果需支持"减少透明度"辅助功能设置

- [x] **Performance (Principle V)**: 
  - ✅ 列表已使用 `FlatList` 虚拟化
  - ✅ 已使用 `react-native-reanimated` 进行动画优化
  - ✅ 已使用 `React.memo`、`useMemo`、`useCallback` 优化重渲染
  - 🔧 **待测试**: 毛玻璃效果在低端设备的性能表现（需实现降级策略）
  - 📋 **目标**: 动画保持 ≥60fps（高端设备）、≥55fps（中端设备）

- [x] **Dark Mode (Principle VI)**: 
  - ✅ 已实现基础深色模式（`lightTheme` + `darkTheme`）
  - ✅ 已使用语义化颜色定义
  - 🔧 **待升级**: 调整深色模式配色为 iOS 风格（背景 #000000/#1C1C1E，卡片 elevated 颜色）
  - 📋 **新增**: 深色模式下的毛玻璃效果（`systemMaterialDark`）

- [x] **Safe Areas (Principle VII)**: 
  - ✅ 已使用 `react-native-safe-area-context` 的 `SafeAreaView`
  - ✅ 已使用 `KeyboardAvoidingView` 处理键盘遮挡
  - ✅ 导航已使用 `@react-navigation/native-stack`（支持原生手势）
  - ✅ 无需额外调整（视觉改版不影响安全区域布局）

**Complexity Justifications (if any principle violations):**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| 无 | 本次改版完全符合 Constitution 原则 | N/A |

**Post-Design Re-Check**: ✅ Phase 1 设计完成后，需验证：
1. 新增的 `expo-blur` 是否在"减少透明度"模式下正确降级
2. 调整后的颜色对比度是否通过自动化测试（使用对比度检查工具）
3. 动画性能是否在真机上达到 60fps 目标

## Project Structure

### Documentation (this feature)

```text
specs/003-ios-visual-redesign/
├── plan.md              # 本文件 (/speckit.plan 输出)
├── research.md          # Phase 0 输出（技术调研）
├── data-model.md        # Phase 1 输出（主题数据模型）
├── quickstart.md        # Phase 1 输出（快速开始指南）
├── contracts/           # Phase 1 输出（组件 API 契约）
│   ├── theme-system.ts  # 主题系统类型定义
│   ├── animation-config.ts # 动画配置类型
│   └── component-styles.ts # 组件样式预设
└── tasks.md             # Phase 2 输出 (/speckit.tasks - 未创建)
```

### Source Code (repository root)

```text
my-tally-book/
├── app/                          # Expo Router 应用目录
│   ├── (tabs)/                   # Tab 导航组
│   │   ├── list.tsx              # 🔧 交易列表页（需更新视觉）
│   │   ├── stats.tsx             # 🔧 统计页（需更新图表视觉）
│   │   └── settings.tsx          # 设置页（暂不改动）
│   ├── _layout.tsx               # 根布局
│   └── index.tsx                 # 首页
│
├── src/
│   ├── components/
│   │   ├── ui/                   # 基础 UI 组件
│   │   │   ├── Button.tsx        # 🔧 需更新：圆角 8pt、触觉反馈
│   │   │   ├── Card.tsx          # 🔧 需更新：圆角 12pt、阴影参数、毛玻璃变体
│   │   │   ├── ConfirmDialog.tsx # 🔧 需更新：毛玻璃背景、弹簧动画
│   │   │   ├── FloatingActionButton.tsx # 🔧 需更新：展开动画错开、图标缩放
│   │   │   ├── Icon.tsx          # ✅ 保持不变（已使用 Ionicons）
│   │   │   ├── Input.tsx         # 🔧 需更新：圆角、边框颜色
│   │   │   ├── SafeAreaWrapper.tsx # ✅ 保持不变
│   │   │   └── Toast.tsx         # 🔧 需更新：毛玻璃背景、滑入动画
│   │   │
│   │   └── features/             # 功能组件
│   │       ├── ExpenseListItem.tsx # 🔧 需更新：卡片样式、间距、字重
│   │       ├── FilterBottomSheet.tsx # 🔧 需更新：毛玻璃背景、弹簧动画
│   │       ├── CategoryPicker.tsx # 🔧 需更新：卡片圆角、间距
│   │       ├── CategoryPieChart.tsx # 🔧 需更新：柔和配色、渐变
│   │       ├── TrendLineChart.tsx # 🔧 需更新：网格线、数据标签样式
│   │       ├── ComparisonBarChart.tsx # 🔧 需更新：圆角柱状图
│   │       ├── TransactionDetailView.tsx # 🔧 需更新：卡片布局
│   │       └── TransactionEditForm.tsx # 🔧 需更新：输入框样式
│   │
│   ├── hooks/
│   │   ├── useTheme.ts           # 🔧 需扩展：添加 shadows、animations、blurMaterials
│   │   └── useHaptics.ts         # ✨ 新增：触觉反馈 Hook（使用 expo-haptics）
│   │
│   ├── theme/                    # 主题系统
│   │   ├── colors.ts             # 🔧 需调整：深色模式配色（#000/#1C1C1E）
│   │   ├── spacing.ts            # 🔧 需调整：圆角 12pt/8pt、阴影参数
│   │   ├── typography.ts         # ✅ 保持不变（已符合 iOS 规范）
│   │   ├── shadows.ts            # ✨ 新增：标准化阴影定义（轻量、中等、重度）
│   │   └── animations.ts         # ✨ 新增：动画时长、缓动曲线、弹簧参数
│   │
│   ├── utils/
│   │   └── accessibility.ts      # ✨ 新增：检测"减少透明度"设置
│   │
│   └── types/
│       └── theme.ts              # 🔧 需扩展：添加 Shadow、Animation、BlurMaterial 类型
│
├── __tests__/                    # 测试文件
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Card.test.tsx     # 🔧 需更新：快照测试（新样式）
│   │   │   ├── ConfirmDialog.test.tsx # 🔧 需更新：动画测试
│   │   │   └── FloatingActionButton.test.tsx # 🔧 需更新：错开动画测试
│   │   └── features/
│   │       ├── ExpenseListItem.test.tsx # 🔧 需更新：快照测试
│   │       └── FilterBottomSheet.test.tsx # 🔧 需更新：毛玻璃测试
│   ├── hooks/
│   │   ├── useTheme.test.ts      # 🔧 需扩展：测试新增配置
│   │   └── useHaptics.test.ts    # ✨ 新增：触觉反馈测试
│   └── theme/
│       ├── colors.test.ts        # 🔧 需更新：对比度测试
│       └── animations.test.ts    # ✨ 新增：动画配置测试
│
├── assets/                       # 资源文件
│   ├── images/                   # ✅ 保持不变（使用矢量图标）
│   └── fonts/                    # ✅ 保持不变（使用系统字体）
│
├── app.json                      # Expo 配置
├── package.json                  # 🔧 需更新：添加 expo-blur, expo-haptics
├── tsconfig.json                 # ✅ 保持不变
├── .eslintrc.js                  # ✅ 保持不变
└── jest.config.js                # ✅ 保持不变
```

**Structure Decision**: 
遵循现有的 Expo/React Native 项目结构，视觉改版主要影响以下模块：
1. **主题系统** (`src/theme/`): 新增 `shadows.ts` 和 `animations.ts`，调整 `colors.ts` 和 `spacing.ts` 的具体数值
2. **UI 组件** (`src/components/ui/`): 更新 8 个基础组件的样式定义
3. **Feature 组件** (`src/components/features/`): 更新 8 个功能组件的视觉呈现
4. **Hooks** (`src/hooks/`): 扩展 `useTheme`，新增 `useHaptics`
5. **测试** (`__tests__/`): 更新现有测试快照，新增动画和主题切换测试

所有改动遵循 Constitution Principle II（代码质量）的容器/展示分离原则，视觉样式集中在主题系统和展示组件中，业务逻辑保持在 Hooks 和容器组件中。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| 无违规项 | 本次改版完全符合 Constitution 七项原则 | N/A |

---

## Phase 0: Research & Decisions

详见 [research.md](./research.md) - 包含以下调研内容：

1. **毛玻璃效果实现方案**: 
   - 对比 `expo-blur` vs `react-native-blur` vs 自定义实现
   - 决策: 使用 `expo-blur` (Expo 官方维护，跨平台支持)

2. **动画性能优化策略**:
   - 研究 Reanimated 3 的 UI 线程动画
   - 低端设备降级策略（检测 FPS < 45 时禁用毛玻璃）

3. **iOS 设计规范细节**:
   - 8pt 网格系统的具体应用（间距、圆角、阴影）
   - 动画时长和缓动曲线标准（0.3-0.4s, spring damping 0.8）

4. **辅助功能集成**:
   - `AccessibilityInfo` API 检测"减少透明度"设置
   - 颜色对比度自动化测试工具选型

5. **触觉反馈实现**:
   - `expo-haptics` 的 Impact Feedback 类型（Light, Medium, Heavy）
   - 在按钮点击、删除操作、面板展开时的触发时机

## Phase 1: Design & Contracts

详见以下文档：

- [data-model.md](./data-model.md) - 主题系统数据模型（Theme、Shadow、Animation、BlurMaterial）
- [contracts/](./contracts/) - 组件 API 契约和类型定义
- [quickstart.md](./quickstart.md) - 快速开始指南（开发、测试、预览）

## Next Steps

1. ✅ 完成 Phase 0 研究（调研技术方案）
2. ✅ 完成 Phase 1 设计（定义数据模型和契约）
3. ⏳ 执行 `/speckit.tasks` 生成任务清单
4. ⏳ 按优先级实施用户故事（P1 -> P2 -> P3）
5. ⏳ 每个任务遵循 TDD 流程（测试先行）
6. ⏳ 真机测试性能和辅助功能
7. ⏳ A/B 测试验证业务指标（留存率、使用时长）
