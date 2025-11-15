# Implementation Plan: Transaction Detail and Filter Interactions

**Branch**: `002-transaction-detail-interaction` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-transaction-detail-interaction/spec.md`

## Summary

实现交易详情查看、编辑、筛选和快速添加功能。用户可以点击交易列表项查看完整详情,通过底部"Edit"按钮编辑交易信息,使用底部抽屉面板按类型/金额/分类筛选交易,通过浮动操作按钮(FAB)快速添加收入/支出/转账。技术方案采用React Native组件化架构,使用React Navigation实现页面导航,Reanimated实现60fps流畅动画,Bottom Sheet组件实现筛选面板,SafeAreaView确保内容不被刘海遮挡,完全支持Dark Mode和VoiceOver辅助功能。

## Technical Context

**Language/Version**: TypeScript 5.0+ (strict mode enabled), Expo SDK 50+  
**Primary Dependencies**: 
- `react-native`: 核心框架
- `@react-navigation/native-stack`: 页面导航(详情页、编辑页)
- `react-native-reanimated`: 60fps动画(FAB展开/收起、筛选面板)
- `react-native-gesture-handler`: 手势处理(筛选面板拖动)
- `@gorhom/bottom-sheet`: 底部抽屉组件(筛选面板)
- `react-native-safe-area-context`: 安全区域布局
- `expo-image-picker`: 交易附件选择
- `@expo/vector-icons`: SF Symbols图标(返回、删除、筛选、添加)

**Storage**: AsyncStorage (交易数据持久化)或SQLite (如需复杂查询和筛选)  
**Testing**: Jest, @testing-library/react-native, Detox (E2E)  
**Target Platform**: iOS 15.0+, Android 6.0+ (Expo managed workflow)  
**Project Type**: mobile (Expo/React Native cross-platform app)  
**Performance Goals**: 
- 60fps UI (使用Reanimated实现所有动画)
- 导航响应<300ms (Stack Navigator原生性能)
- 筛选操作响应<500ms (内存内过滤,无网络请求)
- <3s cold launch
- <30MB bundle size
- ≥90% test coverage

**Constraints**: 
- Apple HIG compliance (原生手势、底部抽屉交互模式)
- WCAG AA accessibility (所有按钮≥44x44pt,accessibilityLabel完整)
- Dark Mode support (主题系统,useColorScheme)
- Safe Area layouts (SafeAreaView,useSafeAreaInsets)

**Scale/Scope**: 
- 3个核心屏幕:TransactionDetailScreen、TransactionEditScreen、现有主页增强
- 2个复杂组件:FilterBottomSheet(筛选面板)、FloatingActionButton(FAB菜单)
- 1个自定义Hook:useTransactionFilter(筛选逻辑)
- 预计交易数据量:<10,000笔交易(内存内筛选可行)
- 5个用户故事(P1: 2个,P2: 2个,P3: 1个)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Verify compliance with Tally Book Constitution v2.0.0:**

✅ **Phase 0 Initial Check - PASSED**
✅ **Phase 1 Re-check - PASSED** (2025-11-15)

- [x] **HIG Compliance (Principle I)**: 
  - 使用`@expo/vector-icons`提供SF Symbols(返回、删除、筛选、添加图标)
  - 响应式布局支持iPhone SE到Pro Max
  - `useColorScheme`自动适配Dark Mode
  - 底部抽屉符合iOS交互规范
  - **Phase 1验证**:contracts/types.ts定义完整,research.md确认使用`@gorhom/bottom-sheet`(符合HIG)
  
- [x] **Code Quality (Principle II)**: 
  - TypeScript strict mode启用
  - 组件分离:展示组件(TransactionDetailView、FilterPanel)和容器组件(TransactionDetailScreen、TransactionEditScreen)
  - 业务逻辑封装在自定义Hooks(useTransactionFilter、useTransactionCRUD)
  - ESLint配置`@expo/eslint-config`
  - **Phase 1验证**:Project Structure明确定义组件/Hook/Service分离,contracts/types.ts提供完整类型定义
  
- [x] **Test-First (Principle III)**: 
  - Jest + React Native Testing Library配置
  - 测试覆盖率目标≥90%
  - TDD流程:先编写测试→用户批准→验证失败→实现→通过→重构
  - 关键流程有E2E测试(Detox):查看详情、编辑保存、筛选应用
  - **Phase 1验证**:quickstart.md详细说明TDD工作流,测试文件结构定义完整
  
- [x] **Accessibility (Principle IV)**: 
  - 所有按钮有`accessibilityLabel`和`accessibilityHint`
  - FAB:`accessibilityLabel="添加交易"`,展开后子按钮有独立标签
  - 编辑按钮:`accessibilityRole="button"`,`accessibilityLabel="编辑交易"`
  - 筛选面板选项:`accessibilityRole="radio"`或`"checkbox"`
  - 触摸目标≥44x44pt(使用`hitSlop`确保)
  - 字体缩放:`allowFontScaling={true}`,`maxFontSizeMultiplier={2}`
  - **Phase 1验证**:contracts/types.ts Props接口包含onPress回调,research.md明确辅助功能合规要求表
  
- [x] **Performance (Principle V)**: 
  - Reanimated实现FAB旋转、子按钮扩散动画(60fps)
  - Reanimated实现筛选面板滑入/滑出动画
  - 交易列表使用`FlatList`虚拟化(已存在,无需更改)
  - 筛选逻辑使用`useMemo`缓存结果
  - 捆绑包大小<30MB(Bottom Sheet库约50KB)
  - **Phase 1验证**:research.md选择Reanimated 3,data-model.md定义查询优化策略(useMemo)
  
- [x] **Dark Mode (Principle VI)**: 
  - 主题系统定义语义颜色:`background`,`text`,`primary`,`cardBackground`,`border`
  - 每个颜色有light/dark变体
  - `useColorScheme`检测系统主题
  - 筛选面板背景和文本颜色自动适配
  - FAB按钮颜色使用主题系统(紫色primary,蓝/绿/红使用主题accent)
  - **Phase 1验证**:research.md确认使用`useColorScheme`,quickstart.md说明主题配置
  
- [x] **Safe Areas (Principle VII)**: 
  - TransactionDetailScreen使用`SafeAreaView`
  - TransactionEditScreen使用`KeyboardAvoidingView`+`SafeAreaView`
  - 底部抽屉使用`@gorhom/bottom-sheet`的`bottomInset`处理Home Indicator
  - FAB位置使用`useSafeAreaInsets`计算bottom偏移
  - **Phase 1验证**:research.md确认`@gorhom/bottom-sheet`支持Safe Area,quickstart.md说明配置

**Complexity Justifications**: 无原则违规

**Phase 1 Design Artifacts**:
- ✅ research.md: 5个技术决策完成,所有NEEDS CLARIFICATION已解决
- ✅ data-model.md: 4个实体定义完成,验证规则明确
- ✅ contracts/types.ts: 完整TypeScript类型定义,包含所有接口和枚举
- ✅ quickstart.md: 开发环境、测试、调试指南完整
- ✅ CODEBUDDY.md: Agent上下文已更新(TypeScript + Expo + AsyncStorage)

## Project Structure

### Documentation (this feature)

```text
specs/002-transaction-detail-interaction/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output: Bottom Sheet库选型、动画方案、存储方案
├── data-model.md        # Phase 1 output: Transaction、FilterCriteria实体定义
├── quickstart.md        # Phase 1 output: 如何运行、测试本功能
├── contracts/           # Phase 1 output: TypeScript接口定义
│   └── types.ts         # Transaction、FilterCriteria、FilterOptions类型
├── checklists/
│   └── requirements.md  # 已生成:规范质量检查清单
└── spec.md              # 已生成:功能规范
```

### Source Code (repository root)

```text
my-tally-book/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx                # 主页(已存在,需增强:添加筛选按钮、FAB)
│   │   └── _layout.tsx              # Tab导航(已存在)
│   └── transaction/
│       ├── [id].tsx                 # 交易详情页(新建:TransactionDetailScreen)
│       └── edit/[id].tsx            # 交易编辑页(新建:TransactionEditScreen)
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── FloatingActionButton.tsx    # 新建:FAB组件(展示组件)
│   │   │   └── ConfirmDialog.tsx           # 新建:删除确认对话框
│   │   └── features/
│   │       ├── TransactionDetailView.tsx   # 新建:详情展示组件
│   │       ├── TransactionEditForm.tsx     # 新建:编辑表单组件
│   │       └── FilterBottomSheet.tsx       # 新建:筛选面板组件
│   │
│   ├── hooks/
│   │   ├── useTransactionFilter.ts         # 新建:筛选逻辑Hook
│   │   ├── useTransactionCRUD.ts           # 新建:增删改查Hook
│   │   └── useFABAnimation.ts              # 新建:FAB动画Hook
│   │
│   ├── services/
│   │   └── transactionStorage.ts           # 新建或增强:交易持久化服务
│   │
│   ├── types/
│   │   └── transaction.ts                  # 增强:Transaction、FilterCriteria类型
│   │
│   └── theme/
│       └── colors.ts                        # 增强:添加筛选面板、FAB颜色
│
└── __tests__/
    ├── components/
    │   ├── FloatingActionButton.test.tsx
    │   ├── FilterBottomSheet.test.tsx
    │   └── TransactionDetailView.test.tsx
    ├── hooks/
    │   ├── useTransactionFilter.test.tsx
    │   └── useTransactionCRUD.test.tsx
    ├── screens/
    │   ├── TransactionDetailScreen.test.tsx
    │   └── TransactionEditScreen.test.tsx
    └── e2e/
        └── transactionDetailFlow.e2e.ts    # E2E:查看→编辑→保存→删除流程
```

**Structure Decision**: 
- 使用Expo Router的文件路由(`app/transaction/[id].tsx`)实现详情页导航
- 组件分离:展示组件(`TransactionDetailView`)负责UI渲染,容器组件(`TransactionDetailScreen`)处理导航和数据获取
- 业务逻辑封装在自定义Hooks:
  - `useTransactionFilter`:筛选和排序逻辑,返回过滤后的交易列表
  - `useTransactionCRUD`:增删改查操作,与存储服务交互
  - `useFABAnimation`:FAB展开/收起动画状态管理
- 使用`@gorhom/bottom-sheet`实现筛选面板(iOS规范的底部抽屉交互)
- 使用Reanimated实现所有动画(60fps性能要求)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |

无复杂性违规。所有技术选型符合宪章要求,使用标准的Expo/React Native生态库。
