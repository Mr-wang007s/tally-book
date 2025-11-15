# Implementation Plan: 家庭支出统计应用

**Branch**: `001-expense-tracking-app` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-expense-tracking-app/spec.md`

## Summary

建立一个移动记账应用，支持三种输入方式（键盘输入、语音识别、拍照OCR），自动识别支出金额和类别，并提供支出趋势统计分析。使用 Expo/React Native 跨平台开发，遵循 Apple HIG 设计规范，确保优秀的无障碍体验和性能表现。

## Technical Context

**Language/Version**: TypeScript 5.0+ (strict mode enabled), Expo SDK 51  
**Primary Dependencies**: 
- React Native 0.74+ (Expo managed)
- React Navigation 6+ (native-stack, bottom-tabs)
- react-native-reanimated 3+ (UI 线程动画)
- react-native-safe-area-context (安全区域)
- @expo/vector-icons (图标库)
- expo-voice (语音识别) - **NEEDS CLARIFICATION: 选择具体语音识别服务**
- expo-camera + expo-image-picker (拍照功能)
- OCR Service - **NEEDS CLARIFICATION: 选择 OCR 服务提供商**

**Storage**: 
- AsyncStorage (@react-native-async-storage/async-storage) - 用于轻量级配置存储
- SQLite (expo-sqlite) - 用于支出记录持久化存储，支持高效查询和统计
- expo-file-system - 用于照片附件存储

**Testing**: 
- Jest 29+ (单元测试和组件测试)
- @testing-library/react-native (组件行为测试)
- Detox (端到端测试，针对关键用户流程)

**Target Platform**: iOS 15.0+, Android 6.0+ (Expo managed workflow)  
**Project Type**: mobile (Expo/React Native cross-platform app)  

**Performance Goals**: 
- 60fps UI 交互和动画
- <3s 冷启动到首屏可交互
- <30MB bundle size (生产构建)
- ≥90% 测试覆盖率

**Constraints**: 
- Apple HIG 合规（使用 React Native 实现）
- WCAG AA 无障碍标准（4.5:1 对比度）
- 深色模式完整支持
- 安全区域布局（SafeAreaView）
- 所有交互元素 ≥44pt 触摸目标

**Scale/Scope**: 
- 5个主要屏幕（记账、列表、统计、分类管理、设置）
- 支持 ≥10,000 条历史记录
- 3个外部 API 集成（语音识别、OCR、NLP 类别提取）
- 预期用户规模：1,000 活跃用户（初期）
- 数据规模：每用户平均 2条记录/天 × 365天 = 730条/年

**Technology Decisions Pending Research**:
1. **语音识别服务选择** - **NEEDS CLARIFICATION**
   - Options: 百度语音识别、腾讯云ASR、讯飞语音、Google Speech-to-Text
   - 评估标准：准确率、成本、中文支持、React Native SDK、离线能力
   
2. **OCR 服务选择** - **NEEDS CLARIFICATION**
   - Options: 百度OCR、腾讯云OCR、阿里云OCR、Google Vision API
   - 评估标准：小票识别准确率、价格、API 限制、响应时间
   
3. **NLP 金额/类别提取** - **NEEDS CLARIFICATION**
   - Options: 正则表达式 + 规则引擎、预训练 NLP 模型、云端 NLU 服务
   - 评估标准：准确率、延迟、成本、可定制性
   
4. **状态管理方案** - **NEEDS CLARIFICATION**
   - Options: Zustand、Redux Toolkit、Jotai、React Context + useReducer
   - 评估标准：复杂度、性能、DevTools、团队熟悉度
   
5. **图表库选择** - **NEEDS CLARIFICATION**
   - Options: react-native-chart-kit、Victory Native、react-native-svg-charts
   - 评估标准：性能、可定制性、动画支持、深色模式
   
6. **离线数据同步策略** - **NEEDS CLARIFICATION**
   - 语音/OCR 识别在离线时的处理方式
   - 是否需要队列系统暂存待处理任务

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Verify compliance with Tally Book Constitution v2.0.0:**

### Initial Check (Before Phase 0) - ✅ PASSED

- [x] **HIG Compliance (Principle I)**: 计划使用 `@expo/vector-icons` (SF Symbols), Flexbox 自适应布局, `useColorScheme` 实现深色模式
- [x] **Code Quality (Principle II)**: TypeScript strict mode 已启用; 将使用容器/展示组件分离; ESLint 使用 `@expo/eslint-config`
- [x] **Test-First (Principle III)**: Jest + @testing-library/react-native 已规划; 目标覆盖率 ≥90%; 将采用 TDD 工作流
- [x] **Accessibility (Principle IV)**: 所有交互元素将添加 `accessibilityLabel`; 字体缩放默认启用; 触摸目标 ≥44pt 将通过设计保证
- [x] **Performance (Principle V)**: 动画将使用 react-native-reanimated; 列表使用 FlatList/SectionList; 捆绑包大小目标 <30MB
- [x] **Dark Mode (Principle VI)**: 将实现主题系统（light/dark 变体）; 使用 `useColorScheme` hook 动态切换
- [x] **Safe Areas (Principle VII)**: 所有屏幕将使用 `SafeAreaView` 或 `useSafeAreaInsets`; 表单使用 `KeyboardAvoidingView`

### Post-Design Check (After Phase 1) - ✅ PASSED

**Phase 0 Research Completed**: 所有技术决策已在 [research.md](./research.md) 中解决
- ✅ 语音识别：Expo Speech (本地设备 API)
- ✅ OCR 服务：百度 OCR API (小票专用接口)
- ✅ NLP 提取：正则表达式 + 规则引擎（本地）
- ✅ 状态管理：Zustand
- ✅ 图表库：Victory Native
- ✅ 离线策略：任务队列 + NetInfo

**Phase 1 Design Completed**: 数据模型、API 合约已定义
- ✅ [data-model.md](./data-model.md): 实体关系、验证规则、SQLite schema
- ✅ [contracts/hooks-api.md](./contracts/hooks-api.md): 7 个自定义 Hooks 接口
- ✅ [contracts/services-api.md](./contracts/services-api.md): 6 个服务层 API

**Constitution Re-Check Results**:

- [x] **HIG Compliance (Principle I)**: 
  - ✅ 使用 `@expo/vector-icons` (见 data-model.md Category schema)
  - ✅ Flexbox 布局已规划在 project structure
  - ✅ `useTheme` hook 实现深色模式（见 hooks-api.md #6）
  
- [x] **Code Quality (Principle II)**: 
  - ✅ TypeScript 类型定义完整（所有实体、DTO、API 返回值）
  - ✅ Hooks 分离业务逻辑（7 个自定义 Hooks）
  - ✅ Services 封装数据层（6 个服务模块）
  - ✅ 组件分离架构已定义（ui/ 和 features/）
  
- [x] **Test-First (Principle III)**: 
  - ✅ 每个 Hook 和 Service 都有测试要求（覆盖率 ≥90%）
  - ✅ 测试示例已提供（hooks-api.md, services-api.md）
  - ✅ TDD 工作流在 quickstart.md 中明确定义
  
- [x] **Accessibility (Principle IV)**: 
  - ✅ 所有 API 返回值包含 `accessibilityLabel` 要求
  - ✅ Victory Native 图表支持辅助功能
  - ✅ 触摸目标 ≥44pt 在设计中强制要求
  
- [x] **Performance (Principle V)**: 
  - ✅ 使用 FlatList/SectionList 虚拟化（见 hooks-api.md）
  - ✅ Victory Native 基于 react-native-svg（60fps 动画）
  - ✅ Zustand 性能优异（自动选择器优化）
  - ✅ 数据库查询优化（索引、性能目标 <100ms）
  
- [x] **Dark Mode (Principle VI)**: 
  - ✅ `useTheme` hook 提供完整主题系统
  - ✅ light/dark 颜色变体已定义（见 hooks-api.md #6）
  - ✅ Victory Native 支持主题切换
  
- [x] **Safe Areas (Principle VII)**: 
  - ✅ SafeAreaView 在 quickstart.md 中强制要求
  - ✅ KeyboardAvoidingView 用于所有表单（见 FR-021）

**Complexity Justifications**:
- **无违规项** - 所有宪章原则在设计阶段得到完整满足
- 技术选型均符合简单性原则（Zustand > Redux, 本地 NLP > 云端服务）
- 无需复杂性论证

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-tracking-app/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command) - PENDING
├── data-model.md        # Phase 1 output (/speckit.plan command) - PENDING
├── quickstart.md        # Phase 1 output (/speckit.plan command) - PENDING
├── contracts/           # Phase 1 output (/speckit.plan command) - PENDING
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Expo/React Native Application Structure (Tally Book)
my-tally-book/
├── app/                     # Expo Router app directory (file-based routing)
│   ├── (tabs)/              # Tab navigation group
│   │   ├── index.tsx        # 记账主页（键盘/语音/拍照输入）
│   │   ├── list.tsx         # 支出列表
│   │   ├── stats.tsx        # 统计图表
│   │   └── settings.tsx     # 设置和分类管理
│   ├── _layout.tsx          # Root layout (SafeAreaProvider, Theme)
│   └── expense/[id].tsx     # 支出详情页
│
├── src/
│   ├── components/          # Reusable presentational components
│   │   ├── ui/              # Basic UI (Button, Card, Input, etc.)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Icon.tsx
│   │   └── features/        # Feature-specific components
│   │       ├── ExpenseForm.tsx        # 支出输入表单
│   │       ├── ExpenseListItem.tsx    # 列表项
│   │       ├── CategoryPicker.tsx     # 类别选择器
│   │       ├── StatisticsChart.tsx    # 统计图表组件
│   │       └── VoiceRecorder.tsx      # 语音录制UI
│   │
│   ├── screens/             # Screen components (container components)
│   │   ├── HomeScreen.tsx             # 记账主页容器
│   │   ├── ExpenseListScreen.tsx      # 列表页容器
│   │   ├── StatisticsScreen.tsx       # 统计页容器
│   │   ├── CategoryManagementScreen.tsx  # 分类管理
│   │   └── ExpenseDetailScreen.tsx    # 详情页
│   │
│   ├── hooks/               # Custom React hooks (business logic)
│   │   ├── useExpenses.ts           # 支出记录 CRUD
│   │   ├── useCategories.ts         # 类别管理
│   │   ├── useStatistics.ts         # 统计计算
│   │   ├── useVoiceRecognition.ts   # 语音识别集成
│   │   ├── useOCR.ts                # OCR 识别集成
│   │   ├── useNLPExtraction.ts      # NLP 金额/类别提取
│   │   └── useTheme.ts              # 主题管理
│   │
│   ├── services/            # API calls, data fetching
│   │   ├── database.ts              # SQLite 数据库操作
│   │   ├── storage.ts               # AsyncStorage 封装
│   │   ├── voiceApi.ts              # 语音识别 API
│   │   ├── ocrApi.ts                # OCR API
│   │   └── nlpService.ts            # NLP 服务
│   │
│   ├── store/               # State management (Zustand/Redux - 待 research 确定)
│   │   ├── expenseStore.ts          # 支出状态
│   │   ├── categoryStore.ts         # 类别状态
│   │   └── settingsStore.ts         # 应用设置
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── expense.ts               # Expense 实体类型
│   │   ├── category.ts              # Category 实体类型
│   │   ├── statistics.ts            # Statistics 类型
│   │   └── api.ts                   # API 响应类型
│   │
│   ├── utils/               # Helper functions
│   │   ├── formatting.ts            # 金额格式化、日期格式化
│   │   ├── validation.ts            # 输入验证
│   │   ├── extractors.ts            # NLP 提取逻辑
│   │   └── constants.ts             # 常量定义
│   │
│   ├── theme/               # Theme configuration
│   │   ├── colors.ts                # 颜色定义（light/dark）
│   │   ├── typography.ts            # 字体定义
│   │   └── spacing.ts               # 间距系统
│   │
│   └── constants/           # App constants
│       ├── categories.ts            # 默认类别定义
│       └── config.ts                # 应用配置
│
├── assets/                  # Images, fonts, etc.
│   ├── images/
│   │   ├── icon.png
│   │   └── splash.png
│   └── fonts/               # 自定义字体（如需要）
│
├── __tests__/               # Test files
│   ├── components/          # Component tests
│   │   ├── ExpenseForm.test.tsx
│   │   └── CategoryPicker.test.tsx
│   ├── hooks/               # Hook tests
│   │   ├── useExpenses.test.ts
│   │   └── useStatistics.test.ts
│   ├── services/            # Service tests
│   │   └── database.test.ts
│   ├── utils/               # Util tests
│   │   └── extractors.test.ts
│   └── e2e/                 # End-to-end tests (Detox)
│       ├── addExpense.e2e.ts
│       └── statistics.e2e.ts
│
├── app.json                 # Expo configuration
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── jest.config.js
└── README.md
```

**Structure Decision**: 使用 Expo Router (app/) 实现基于文件的路由，简化导航配置。源代码按职责分离：`components/`（展示组件）、`screens/`（容器组件）、`hooks/`（业务逻辑）、`services/`（数据层）。这种架构支持宪章原则二的组件分离要求，并便于单元测试（≥90% 覆盖率目标）。使用 Expo managed workflow 简化原生模块管理，避免复杂的原生配置。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| N/A | N/A | N/A |

*无宪章违规项 - 所有设计决策符合记账本项目宪章 v2.0.0*

---

**Status**: Phase 1 Complete - Ready for `/speckit.tasks` command

**Phase 0 (Research)**: ✅ Completed - All NEEDS CLARIFICATION resolved in [research.md](./research.md)

**Phase 1 (Design & Contracts)**: ✅ Completed
- ✅ [data-model.md](./data-model.md) - 实体关系、验证规则、SQLite schema
- ✅ [contracts/hooks-api.md](./contracts/hooks-api.md) - 7 个自定义 Hooks API
- ✅ [contracts/services-api.md](./contracts/services-api.md) - 6 个服务层 API
- ✅ [quickstart.md](./quickstart.md) - 开发环境设置和工作流指南
- ✅ [CODEBUDDY.md](../../CODEBUDDY.md) - Agent context 已更新

**Constitution Check**: ✅ PASSED (Initial + Post-Design)

**Next Command**: `/speckit.tasks` - 生成实现任务清单（tasks.md）
