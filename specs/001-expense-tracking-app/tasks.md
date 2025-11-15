# Tasks: 家庭支出统计应用

**Input**: Design documents from `/specs/001-expense-tracking-app/`  
**Prerequisites**: ✅ plan.md, spec.md, research.md, data-model.md, contracts/hooks-api.md, contracts/services-api.md  
**Constitution**: 遵循记账本项目宪章 v2.0.0  
**Tests**: 本项目遵循 TDD (Test-Driven Development)，所有测试任务必须在实现前完成并验证失败

**Organization**: 任务按用户故事分组，确保每个故事可以独立实现和测试

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可并行执行（不同文件，无依赖）
- **[Story]**: 所属用户故事（US1, US2, US3, US4, US5）
- 包含准确的文件路径

## Path Conventions

- **Expo Router App**: `app/` (路由), `src/` (源码), `__tests__/` (测试)
- 主要分组: `components/`, `screens/`, `hooks/`, `services/`, `store/`, `theme/`, `utils/`
- 测试: `__tests__/components/`, `__tests__/hooks/`, `__tests__/services/`, `__tests__/e2e/`

---

## Phase 1: Setup (项目初始化)

**Purpose**: Expo 项目初始化和工具链配置

- [X] T001 初始化 Expo 项目 (`npx create-expo-app my-tally-book --template expo-template-blank-typescript`)
- [X] T002 安装核心依赖：React Navigation, Reanimated, Safe Area Context, Vector Icons, AsyncStorage, SQLite
- [X] T003 [P] 配置 ESLint (@expo/eslint-config) 和 TypeScript strict mode
- [X] T004 [P] 配置 Jest 和 @testing-library/react-native，设置覆盖率目标 ≥90%
- [X] T005 [P] 配置 app.json：应用名称、图标、启动屏、iOS/Android 设置
- [X] T006 创建项目目录结构：app/, src/{components,hooks,services,store,types,utils,theme}/, __tests__/
- [X] T007 [P] 创建 .env 配置文件模板（BAIDU_API_KEY, BAIDU_SECRET_KEY）
- [X] T008 [P] 配置 TypeScript paths mapping (@/ -> src/) 在 tsconfig.json

---

## Phase 2: Foundational (基础架构 - 所有用户故事的前置依赖)

**Purpose**: 核心 React Native 基础设施，必须在任何用户故事实现前完成

**⚠️ CRITICAL**: 此阶段完成前，用户故事工作不能开始

### 主题系统 (Constitution Principle VI - Dark Mode)

- [X] T009 [P] 创建主题颜色定义 src/theme/colors.ts (lightTheme, darkTheme)
- [X] T010 [P] 创建字体和间距系统 src/theme/typography.ts, src/theme/spacing.ts
- [X] T011 创建 useTheme hook src/hooks/useTheme.ts (集成 useColorScheme)

### UI 组件库 (Constitution Principle I, IV)

- [X] T012 [P] 创建 Button 组件 src/components/ui/Button.tsx (accessibilityRole, 触摸目标 ≥44pt)
- [X] T013 [P] 创建 Card 组件 src/components/ui/Card.tsx (theme 集成)
- [X] T014 [P] 创建 Input 组件 src/components/ui/Input.tsx (accessibilityLabel, KeyboardAvoidingView)
- [X] T015 [P] 创建 Icon 组件 src/components/ui/Icon.tsx (基于 @expo/vector-icons)

### 导航系统 (Constitution Principle VII)

- [X] T016 配置 React Navigation 在 app/_layout.tsx (Tab Navigator + Stack)
- [X] T017 [P] 创建 SafeArea 包装组件 src/components/ui/SafeAreaWrapper.tsx

### 数据层基础

- [X] T018 初始化 SQLite 数据库 src/services/database.ts (创建 expenses, categories 表)
- [X] T019 [P] 插入默认类别数据（8个默认类别：餐饮、交通、购物、娱乐、医疗、教育、住房、其他）
- [ ] T020 [P] 创建 AsyncStorage 服务 src/services/storage.ts (设置、离线队列)
- [ ] T021 [P] 创建文件系统服务 src/services/fileSystem.ts (照片存储管理)

### 状态管理 (Zustand)

- [ ] T022 [P] 创建 expenseStore src/store/expenseStore.ts (支出状态管理)
- [ ] T023 [P] 创建 categoryStore src/store/categoryStore.ts (类别状态管理)
- [ ] T024 [P] 创建 settingsStore src/store/settingsStore.ts (应用设置)

### TypeScript 类型定义

- [X] T025 [P] 创建 Expense 类型 src/types/expense.ts (Expense, CreateExpenseDTO, UpdateExpenseDTO, InputMethod enum)
- [X] T026 [P] 创建 Category 类型 src/types/category.ts (Category, CreateCategoryDTO)
- [X] T027 [P] 创建 Statistics 类型 src/types/statistics.ts (Statistics, TimeRange enum, CategoryBreakdown)
- [X] T028 [P] 创建 OfflineTask 类型 src/types/offlineTask.ts (OfflineTask, TaskType, TaskStatus enums)
- [X] T029 [P] 创建 Settings 类型 src/types/settings.ts (AppSettings, DEFAULT_SETTINGS)

### 工具函数

- [X] T030 [P] 创建格式化工具 src/utils/formatting.ts (金额格式化 1,234.56、日期格式化)
- [X] T031 [P] 创建验证工具 src/utils/validation.ts (金额验证、输入验证)
- [X] T032 [P] 创建 NLP 提取器 src/utils/extractors.ts (正则表达式金额提取、类别关键词匹配)

### 性能和错误处理

- [X] T033 [P] 创建错误边界组件 src/components/ui/ErrorBoundary.tsx
- [X] T034 [P] 创建 Toast 通知组件 src/components/ui/Toast.tsx
- [ ] T032 [P] 创建 NLP 提取器 src/utils/extractors.ts (正则表达式金额提取、类别关键词匹配)

### 性能和错误处理

- [ ] T033 [P] 创建错误边界组件 src/components/ui/ErrorBoundary.tsx
- [ ] T034 [P] 创建 Toast 通知组件 src/components/ui/Toast.tsx

**Checkpoint**: ✅ 基础架构完成 - 用户故事实现可以并行开始

---

## Phase 3: User Story 1 - 快速键盘输入记账 (Priority: P1) 🎯 MVP

**Goal**: 用户可以通过键盘快速输入支出（金额、类别、备注），系统自动格式化金额并保存到本地数据库

**Independent Test**: 打开应用 → 点击"添加支出" → 输入金额"50"、选择类别"餐饮"、填写备注"午餐" → 保存 → 验证记录出现在列表顶部

### Tests for User Story 1 (TDD - 先写测试)

- [ ] T035 [P] [US1] useExpenses Hook 单元测试 __tests__/hooks/useExpenses.test.ts (addExpense, updateExpense, deleteExpense, ≥90% 覆盖率)
- [ ] T036 [P] [US1] database.ts 服务测试 __tests__/services/database.test.ts (insertExpense, validation, constraints)
- [ ] T037 [P] [US1] formatting.ts 工具测试 __tests__/utils/formatting.test.ts (金额格式化 1,234.56)
- [ ] T038 [P] [US1] validation.ts 工具测试 __tests__/utils/validation.test.ts (金额范围 0.01-1,000,000)
- [ ] T039 [P] [US1] ExpenseForm 组件测试 __tests__/components/ExpenseForm.test.tsx (表单提交、验证、金额格式化)
- [ ] T040 [US1] HomeScreen 集成测试 __tests__/screens/HomeScreen.test.tsx (添加支出完整流程)

### Implementation for User Story 1

#### 数据层

- [ ] T041 [P] [US1] 实现 database.ts 中 Expense CRUD 操作 (insertExpense, updateExpense, deleteExpense, getExpenseById, getAllExpenses, getExpensesByDateRange)
- [ ] T042 [P] [US1] 实现 database.ts 中 Category 查询操作 (getAllCategories, getCategoryById)

#### Hooks

- [ ] T043 [US1] 实现 useExpenses Hook src/hooks/useExpenses.ts (封装 database 调用，提供 expenses 状态和 CRUD 方法)
- [ ] T044 [US1] 实现 useCategories Hook src/hooks/useCategories.ts (提供 categories 列表)

#### UI 组件

- [ ] T045 [P] [US1] 创建 ExpenseForm 组件 src/components/features/ExpenseForm.tsx (金额输入、类别选择器、备注输入)
- [ ] T046 [P] [US1] 创建 CategoryPicker 组件 src/components/features/CategoryPicker.tsx (类别选择、搜索过滤 FR-022)
- [ ] T047 [P] [US1] 创建 ExpenseListItem 组件 src/components/features/ExpenseListItem.tsx (列表项展示)

#### 屏幕

- [ ] T048 [US1] 创建 HomeScreen app/(tabs)/index.tsx (记账主页，包含 ExpenseForm 和今日支出总计)
- [ ] T049 [US1] 创建 ExpenseListScreen app/(tabs)/list.tsx (支出列表，按时间倒序 FR-006)

#### 辅助功能和性能 (Constitution Compliance)

- [ ] T050 [US1] 为所有交互元素添加 accessibilityLabel 和 accessibilityRole (Principle IV)
- [ ] T051 [US1] 实现金额输入框数字键盘 (keyboardType="decimal-pad", FR-023)
- [ ] T052 [US1] 实现 KeyboardAvoidingView 避免键盘遮挡 (FR-021, Principle VII)
- [ ] T053 [US1] 使用 FlatList 虚拟化支出列表 (Principle V)
- [ ] T054 [US1] 集成 theme (useTheme hook) 和深色模式支持 (Principle VI)
- [ ] T055 [US1] 添加 SafeAreaView 包装 (Principle VII)

#### 验证和错误处理

- [ ] T056 [US1] 实现金额验证（范围 0.01-1,000,000，格式化 FR-010）
- [ ] T057 [US1] 实现异常大额确认提示（≥10,000 元）
- [ ] T058 [US1] 实现空字段验证和错误提示

**Checkpoint**: ✅ US1 完成 - 用户可以通过键盘输入记账并查看列表

---

## Phase 4: User Story 2 - 语音快速记账 (Priority: P1)

**Goal**: 用户可以通过语音说出支出信息，系统自动识别金额和类别并创建记录

**Independent Test**: 打开应用 → 点击语音输入按钮 → 说"早餐面包牛奶15块" → 系统识别并创建餐饮类支出15元 → 验证记录在列表中

### Tests for User Story 2 (TDD - 先写测试)

- [ ] T059 [P] [US2] useVoiceRecognition Hook 单元测试 __tests__/hooks/useVoiceRecognition.test.ts (startRecording, stopRecording, extractExpenseInfo)
- [ ] T060 [P] [US2] voiceApi.ts 服务测试 __tests__/services/voiceApi.test.ts (recognizeSpeech, 权限请求)
- [ ] T061 [P] [US2] extractors.ts NLP 测试 __tests__/utils/extractors.test.ts (金额提取、类别提取、准确率 ≥85%)
- [ ] T062 [US2] VoiceRecorder 组件测试 __tests__/components/VoiceRecorder.test.tsx (录音按钮、识别结果展示)

### Implementation for User Story 2

#### 数据层和 API

- [ ] T063 [P] [US2] 实现 voiceApi.ts src/services/voiceApi.ts (Expo Speech API 集成，requestMicrophonePermission, startRecording, stopRecording, recognizeSpeech)
- [ ] T064 [P] [US2] 实现 nlpService.ts src/services/nlpService.ts (extractExpenseInfo, extractAmount, extractCategory 使用 utils/extractors.ts)

#### Hooks

- [ ] T065 [US2] 实现 useVoiceRecognition Hook src/hooks/useVoiceRecognition.ts (封装语音识别流程，提供 isRecording, recognizedText, extractExpenseInfo)

#### UI 组件

- [ ] T066 [P] [US2] 创建 VoiceRecorder 组件 src/components/features/VoiceRecorder.tsx (录音按钮、动画、识别结果展示)
- [ ] T067 [P] [US2] 创建 RecognitionResultModal 组件 src/components/features/RecognitionResultModal.tsx (显示识别结果，允许用户修正 FR-009)

#### 集成到主页

- [ ] T068 [US2] 在 HomeScreen 集成语音输入按钮和 VoiceRecorder 组件
- [ ] T069 [US2] 实现识别结果 → ExpenseForm 自动填充流程

#### 辅助功能和性能

- [ ] T070 [US2] 为语音按钮添加 accessibilityLabel "语音输入支出" (Principle IV)
- [ ] T071 [US2] 实现权限请求 UI（麦克风权限拒绝时的友好提示）
- [ ] T072 [US2] 集成 theme 和深色模式 (Principle VI)

#### 错误处理

- [ ] T073 [US2] 实现识别失败处理（显示错误提示，允许重试或手动输入）
- [ ] T074 [US2] 实现低置信度结果处理（<0.8 时提示用户确认）

**Checkpoint**: ✅ US2 完成 - 用户可以通过语音输入记账

---

## Phase 5: User Story 3 - 拍照识别账单 (Priority: P2)

**Goal**: 用户可以拍摄小票照片，系统自动识别金额、商家和日期，创建支出记录并保存照片

**Independent Test**: 打开应用 → 点击拍照按钮 → 拍摄超市小票 → 系统识别金额和类别 → 创建记录并附带照片 → 验证记录详情中可查看照片

### Tests for User Story 3 (TDD - 先写测试)

- [ ] T075 [P] [US3] useOCR Hook 单元测试 __tests__/hooks/useOCR.test.ts (recognizeImage, recognizeFromCamera, extractExpenseInfo)
- [ ] T076 [P] [US3] ocrApi.ts 服务测试 __tests__/services/ocrApi.test.ts (recognizeReceipt, 百度 OCR API 集成)
- [ ] T077 [P] [US3] fileSystem.ts 服务测试 __tests__/services/fileSystem.test.ts (savePhoto, deletePhoto, cleanupOrphanedPhotos)
- [ ] T078 [US3] CameraCapture 组件测试 __tests__/components/CameraCapture.test.tsx (拍照、相册选择)

### Implementation for User Story 3

#### 数据层和 API

- [ ] T079 [P] [US3] 实现 ocrApi.ts src/services/ocrApi.ts (百度 OCR API 集成，recognizeReceipt, getBaiduAccessToken, extractAmount, extractMerchant, extractDate)
- [ ] T080 [P] [US3] 实现 fileSystem.ts 照片管理 (savePhoto, deletePhoto, getPhotoUri, cleanupOrphanedPhotos)

#### Hooks

- [ ] T081 [US3] 实现 useOCR Hook src/hooks/useOCR.ts (封装 OCR 流程，recognizeImage, recognizeFromCamera, recognizeFromGallery, extractExpenseInfo)

#### UI 组件

- [ ] T082 [P] [US3] 创建 CameraCapture 组件 src/components/features/CameraCapture.tsx (拍照界面，expo-camera 集成)
- [ ] T083 [P] [US3] 创建 OCRResultModal 组件 src/components/features/OCRResultModal.tsx (显示识别结果，支持用户修正)
- [ ] T084 [P] [US3] 创建 PhotoPreview 组件 src/components/features/PhotoPreview.tsx (照片缩略图、放大查看 FR-003-AS5)

#### 集成到主页和详情页

- [ ] T085 [US3] 在 HomeScreen 集成拍照按钮和相册选择按钮 (FR-019)
- [ ] T086 [US3] 创建 ExpenseDetailScreen app/expense/[id].tsx (显示支出详情和照片)
- [ ] T087 [US3] 实现 OCR 结果 → ExpenseForm 自动填充流程

#### 辅助功能和性能

- [ ] T088 [US3] 为拍照按钮添加 accessibilityLabel "拍照识别小票" (Principle IV)
- [ ] T089 [US3] 实现相机权限请求 UI
- [ ] T090 [US3] 照片压缩（<1MB per photo）
- [ ] T091 [US3] 集成 theme 和深色模式 (Principle VI)

#### 离线处理 (FR-017)

- [ ] T092 [US3] 实现 useOfflineQueue Hook src/hooks/useOfflineQueue.ts (addTask, processQueue, retryTask, deleteTask)
- [ ] T093 [US3] 实现离线时保存照片到队列逻辑
- [ ] T094 [US3] 实现网络恢复时自动处理队列 (NetInfo 监听)

#### 错误处理

- [ ] T095 [US3] 实现 OCR 识别失败处理（模糊照片、多张小票检测）
- [ ] T096 [US3] 实现低置信度结果处理（<0.8 时提示用户确认或重拍）

**Checkpoint**: ✅ US3 完成 - 用户可以通过拍照识别记账，支持离线使用

---

## Phase 6: User Story 4 - 支出趋势统计与可视化 (Priority: P2)

**Goal**: 用户可以查看日/周/月/年统计，包括总支出、分类占比、趋势图表

**Independent Test**: 记录一周支出数据 → 打开统计页面 → 查看本周总支出、每日折线图、类别饼图、月度对比柱状图

### Tests for User Story 4 (TDD - 先写测试)

- [ ] T097 [P] [US4] useStatistics Hook 单元测试 __tests__/hooks/useStatistics.test.ts (统计计算逻辑，getTotalByCategory, compareWithPreviousPeriod)
- [ ] T098 [P] [US4] database.ts 统计查询测试 __tests__/services/database.test.ts (getCategoryBreakdown, getDailyTrend, 性能 <100ms)
- [ ] T099 [P] [US4] StatisticsChart 组件测试 __tests__/components/StatisticsChart.test.tsx (图表渲染、深色模式)
- [ ] T100 [US4] StatisticsScreen 集成测试 __tests__/screens/StatisticsScreen.test.tsx (完整统计流程)

### Implementation for User Story 4

#### 数据层

- [ ] T101 [P] [US4] 实现 database.ts 统计查询 (getTotalAmountByDateRange, getCategoryBreakdown, getDailyTrend)

#### Hooks

- [ ] T102 [US4] 实现 useStatistics Hook src/hooks/useStatistics.ts (封装统计计算，useMemo 优化，支持 TimeRange: day/week/month/year)

#### UI 组件 (Victory Native)

- [ ] T103 [P] [US4] 创建 CategoryPieChart 组件 src/components/features/StatisticsChart.tsx (VictoryPie，类别占比饼图)
- [ ] T104 [P] [US4] 创建 TrendLineChart 组件 src/components/features/TrendLineChart.tsx (VictoryLine，每日支出折线图)
- [ ] T105 [P] [US4] 创建 ComparisonBarChart 组件 src/components/features/ComparisonBarChart.tsx (VictoryBar，月度对比柱状图)
- [ ] T106 [P] [US4] 创建 TimeRangeSelector 组件 src/components/features/TimeRangeSelector.tsx (日/周/月/年切换)

#### 屏幕

- [ ] T107 [US4] 创建 StatisticsScreen app/(tabs)/stats.tsx (统计页面，集成所有图表和 TimeRangeSelector)

#### 辅助功能和性能 (Principle IV, V)

- [ ] T108 [US4] 为所有图表添加 accessibilityLabel (如 "支出类别分布饼图")
- [ ] T109 [US4] 实现图表渲染性能优化 (<1秒渲染 100 条数据 FR-008)
- [ ] T110 [US4] 集成 theme 和深色模式（Victory Native 主题集成）
- [ ] T111 [US4] 实现数据不足时的友好提示（<7天数据时显示提示 US4-AS5）

#### 交互功能

- [ ] T112 [US4] 实现图表数据点点击 → 显示详细支出列表 (US4-AS3)
- [ ] T113 [US4] 实现类别点击 → 显示该类别详细明细 (US4-AS2)

**Checkpoint**: ✅ US4 完成 - 用户可以查看支出统计和图表分析

---

## Phase 7: User Story 5 - 支出分类管理 (Priority: P3)

**Goal**: 用户可以自定义支出类别，添加、编辑、删除类别，设置图标和预算

**Independent Test**: 打开分类管理页面 → 添加新类别"医疗"并选择图标 → 在记账时可以选择"医疗"类别 → 验证可以设置月度预算并收到提醒

### Tests for User Story 5 (TDD - 先写测试)

- [ ] T114 [P] [US5] useCategories Hook 单元测试 __tests__/hooks/useCategories.test.ts (addCategory, updateCategory, deleteCategory, 类别数量限制 ≤28)
- [ ] T115 [P] [US5] database.ts 类别操作测试 __tests__/services/database.test.ts (insertCategory, deleteCategory 外键约束)
- [ ] T116 [US5] CategoryManagement 组件测试 __tests__/components/CategoryManagement.test.tsx (添加、编辑、删除流程)

### Implementation for User Story 5

#### 数据层

- [ ] T117 [P] [US5] 实现 database.ts 中 Category CRUD (insertCategory, updateCategory, deleteCategory, getCategoryUsageCount)

#### Hooks

- [ ] T118 [US5] 实现 useCategories 完整功能 (addCategory, updateCategory, deleteCategory, canAddMoreCategories 检查上限)

#### UI 组件

- [ ] T119 [P] [US5] 创建 CategoryManagement 组件 src/components/features/CategoryManagement.tsx (类别列表、添加/编辑/删除操作)
- [ ] T120 [P] [US5] 创建 CategoryForm 组件 src/components/features/CategoryForm.tsx (类别表单：名称、图标选择器、颜色选择器、预算输入)
- [ ] T121 [P] [US5] 创建 IconPicker 组件 src/components/features/IconPicker.tsx (从 @expo/vector-icons 选择图标)
- [ ] T122 [P] [US5] 创建 ColorPicker 组件 src/components/features/ColorPicker.tsx (颜色选择器)

#### 屏幕

- [ ] T123 [US5] 创建 CategoryManagementScreen app/(tabs)/settings.tsx 或独立路由 (分类管理页面)

#### 业务逻辑

- [ ] T124 [US5] 实现删除类别时的使用检查（getCategoryUsageCount，提示用户确认 US5-AS3）
- [ ] T125 [US5] 实现默认类别保护（isDefault: true 不可删除）
- [ ] T126 [US5] 实现类别数量限制（最多 28 个类别：8 默认 + 20 自定义）

#### 预算提醒功能

- [ ] T127 [US5] 实现预算检查逻辑（当月支出 ≥ 预算 80% 时触发）
- [ ] T128 [US5] 创建预算提醒通知组件 (Expo Notifications 或 Toast)

#### 辅助功能和性能

- [ ] T129 [US5] 为所有交互元素添加 accessibilityLabel (Principle IV)
- [ ] T130 [US5] 集成 theme 和深色模式 (Principle VI)

**Checkpoint**: ✅ US5 完成 - 用户可以自定义管理支出类别和预算

---

## Phase 8: Polish & Cross-Cutting Concerns (质量提升和宪章合规验证)

**Purpose**: 全面的质量检查和宪章原则验证

### Constitution Principle I - HIG Compliance

- [ ] T131 [P] 验证所有图标来自 @expo/vector-icons，无自定义图标
- [ ] T132 [P] 验证动态字体支持（allowFontScaling={true}，测试 100%-310%）
- [ ] T133 [P] 验证自适应布局（测试 iPhone SE 到 Pro Max）

### Constitution Principle II - Code Quality

- [ ] T134 [P] 运行 TypeScript 编译检查 (tsc --noEmit)，0 个类型错误
- [ ] T135 [P] 运行 ESLint 全项目扫描，0 错误 0 警告
- [ ] T136 [P] 验证组件分离架构（展示/容器组件分离）
- [ ] T137 [P] 代码审查和重构（移除重复代码，优化性能）

### Constitution Principle III - Test-First (TDD)

- [ ] T138 运行 Jest 覆盖率报告，验证 ≥90% 覆盖率
- [ ] T139 [P] 验证所有 Hooks 有单元测试
- [ ] T140 [P] 验证所有关键组件有测试

### Constitution Principle IV - Accessibility

- [ ] T141 [P] 运行无障碍审计（验证所有交互元素有 accessibilityLabel）
- [ ] T142 VoiceOver 测试（iOS P1 流程：US1 键盘输入记账）
- [ ] T143 TalkBack 测试（Android P1 流程）
- [ ] T144 [P] 验证触摸目标 ≥44pt（使用 hitSlop）
- [ ] T145 [P] 验证颜色对比度 ≥4.5:1 (WCAG AA)

### Constitution Principle V - Performance

- [ ] T146 性能分析：Expo Performance Monitor 验证 ≥60fps UI 交互
- [ ] T147 [P] 验证列表使用 FlatList/SectionList 虚拟化
- [ ] T148 [P] 验证动画使用 react-native-reanimated
- [ ] T149 生产构建捆绑包大小检查 <30MB
- [ ] T150 [P] 数据库查询性能测试（≥10,000 条记录，查询 <100ms）

### Constitution Principle VI - Dark Mode

- [ ] T151 [P] 验证所有屏幕浅色模式无视觉缺陷
- [ ] T152 [P] 验证所有屏幕深色模式无视觉缺陷
- [ ] T153 [P] 验证主题自动切换（useColorScheme 响应系统设置）
- [ ] T154 [P] 验证 0 个硬编码颜色值（所有颜色通过 theme）

### Constitution Principle VII - Safe Areas

- [ ] T155 [P] 在有刘海设备测试 SafeAreaView (iPhone X+)
- [ ] T156 [P] 在无刘海设备测试 (iPhone SE)
- [ ] T157 [P] 验证 KeyboardAvoidingView 在所有表单正常工作
- [ ] T158 [P] 测试横屏和竖屏安全区域

### End-to-End Tests (Detox)

- [ ] T159 E2E 测试：完整记账流程（键盘输入 → 查看列表 → 编辑 → 删除）
- [ ] T160 [P] E2E 测试：语音输入流程
- [ ] T161 [P] E2E 测试：拍照识别流程
- [ ] T162 [P] E2E 测试：统计查看流程

### 跨平台测试

- [ ] T163 [P] iOS 真机测试（iPhone SE, iPhone 14 Pro）
- [ ] T164 [P] Android 真机测试（不同 OEM：Samsung, Google Pixel）
- [ ] T165 [P] 横屏模式测试（确保布局适配）

### 文档和发布准备

- [ ] T166 [P] 更新 README.md（项目简介、安装、运行、测试）
- [ ] T167 [P] 验证 quickstart.md 所有命令可执行
- [ ] T168 [P] 配置 EAS Build (eas.json)
- [ ] T169 [P] 生成应用图标和启动屏（1024x1024 图标，符合 HIG）

### 安全和数据

- [ ] T170 [P] 安全审查：验证 API Key 不硬编码（使用 .env）
- [ ] T171 [P] 数据备份/导出功能测试（exportData JSON）
- [ ] T172 [P] 数据导入功能测试（importData）

### 最终验证

- [ ] T173 完整功能回归测试（所有 5 个用户故事）
- [ ] T174 [P] 性能基准测试（冷启动 <3s，数据库查询 <100ms）
- [ ] T175 代码清理（移除 console.log，TODO 注释）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖 - 可立即开始
- **Foundational (Phase 2)**: 依赖 Setup 完成 - **阻塞所有用户故事**
- **User Stories (Phase 3-7)**: 全部依赖 Foundational 完成
  - 用户故事可并行进行（如有多人）
  - 或按优先级顺序（P1 → P2 → P3）
- **Polish (Phase 8)**: 依赖所有期望用户故事完成

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 完成后可开始 - 无其他故事依赖
- **User Story 2 (P1)**: Foundational 完成后可开始 - 依赖 US1 的 ExpenseForm 组件
- **User Story 3 (P2)**: Foundational 完成后可开始 - 依赖 US1 的数据层
- **User Story 4 (P2)**: Foundational 完成后可开始 - 需要 US1-3 的数据积累才有意义
- **User Story 5 (P3)**: Foundational 完成后可开始 - 依赖 US1 的类别系统

### Within Each User Story (TDD 流程)

1. 先编写测试（必须失败 ❌）
2. 实现数据层（Models, Services）
3. 实现业务逻辑层（Hooks）
4. 实现 UI 层（Components, Screens）
5. 验证宪章合规性（Accessibility, Performance, Theme）
6. 测试通过（✅）
7. 重构优化

### Parallel Opportunities

#### Setup Phase (Phase 1)
- T003-T008 可并行（不同配置文件）

#### Foundational Phase (Phase 2)
- T009-T011 主题系统可并行
- T012-T015 UI 组件可并行
- T022-T024 Store 可并行
- T025-T029 类型定义可并行
- T030-T032 工具函数可并行

#### User Story 1
- T035-T040 所有测试可并行编写
- T041-T042 数据层可并行
- T045-T047 UI 组件可并行
- T050-T055 宪章合规任务可并行

#### User Story 2
- T059-T062 测试可并行
- T063-T064 API 服务可并行
- T066-T067 UI 组件可并行

#### User Story 3
- T075-T078 测试可并行
- T079-T080 API 和文件系统可并行
- T082-T084 UI 组件可并行

#### User Story 4
- T097-T100 测试可并行
- T103-T106 图表组件可并行

#### User Story 5
- T114-T116 测试可并行
- T119-T122 UI 组件可并行

#### Polish Phase (Phase 8)
- 大部分验证任务可并行（T131-T175 多数标记 [P]）

---

## Parallel Example: User Story 1 (键盘输入记账)

```bash
# 第1批：并行编写所有测试（TDD Red）
Task T035: "useExpenses Hook 单元测试"
Task T036: "database.ts 服务测试"
Task T037: "formatting.ts 工具测试"
Task T038: "validation.ts 工具测试"
Task T039: "ExpenseForm 组件测试"
# 验证：所有测试失败 ❌

# 第2批：并行实现数据层
Task T041: "database.ts Expense CRUD"
Task T042: "database.ts Category 查询"

# 第3批：实现业务逻辑层
Task T043: "useExpenses Hook"
Task T044: "useCategories Hook"

# 第4批：并行实现 UI 组件
Task T045: "ExpenseForm 组件"
Task T046: "CategoryPicker 组件"
Task T047: "ExpenseListItem 组件"

# 第5批：实现屏幕
Task T048: "HomeScreen"
Task T049: "ExpenseListScreen"

# 第6批：并行宪章合规任务
Task T050: "添加 accessibilityLabel"
Task T051: "数字键盘"
Task T052: "KeyboardAvoidingView"
Task T053: "FlatList 虚拟化"
Task T054: "集成 theme"
Task T055: "SafeAreaView"

# 第7批：验证和错误处理
Task T056: "金额验证"
Task T057: "异常大额确认"
Task T058: "空字段验证"

# 验证：所有测试通过 ✅
```

---

## Implementation Strategy

### MVP First (仅 User Story 1)

1. ✅ 完成 Phase 1: Setup
2. ✅ 完成 Phase 2: Foundational（关键 - 阻塞所有故事）
3. ✅ 完成 Phase 3: User Story 1（键盘输入记账）
4. **停止并验证**: 独立测试 US1（添加支出 → 查看列表 → 编辑 → 删除）
5. 如准备好，部署/演示 MVP

### Incremental Delivery (增量交付)

1. Setup + Foundational → 基础就绪
2. 添加 User Story 1 → 独立测试 → 部署/演示（**MVP! 🎯**）
3. 添加 User Story 2 → 独立测试 → 部署/演示（语音输入）
4. 添加 User Story 3 → 独立测试 → 部署/演示（拍照识别）
5. 添加 User Story 4 → 独立测试 → 部署/演示（统计图表）
6. 添加 User Story 5 → 独立测试 → 部署/演示（分类管理）
7. 每个故事增加价值，不破坏已有功能

### Parallel Team Strategy (多人团队)

1. 团队一起完成 Setup + Foundational
2. Foundational 完成后：
   - 开发者 A: User Story 1（键盘输入）
   - 开发者 B: User Story 2（语音输入）
   - 开发者 C: User Story 4（统计图表）
3. 故事独立完成并集成

### Suggested MVP Scope

**推荐 MVP 范围**: **仅 User Story 1（键盘输入记账）**

**理由**:
- US1 是核心价值（快速记账）
- 可独立运行和测试
- 涵盖完整 CRUD 流程
- 建立所有基础架构
- 用户可立即获得价值

**MVP 后迭代**:
- Iteration 1: US1（键盘）→ 部署
- Iteration 2: US1 + US2（语音）→ 部署
- Iteration 3: US1 + US2 + US3（拍照）→ 部署
- Iteration 4: US1-3 + US4（统计）→ 部署
- Iteration 5: 完整版（US1-5 + 分类管理）→ 部署

---

## Task Summary

### Total Task Count: **175 任务**

### Tasks per User Story:
- **Setup (Phase 1)**: 8 任务
- **Foundational (Phase 2)**: 26 任务
- **User Story 1 (P1)**: 24 任务（6 测试 + 18 实现）
- **User Story 2 (P1)**: 16 任务（4 测试 + 12 实现）
- **User Story 3 (P2)**: 22 任务（4 测试 + 18 实现）
- **User Story 4 (P2)**: 17 任务（4 测试 + 13 实现）
- **User Story 5 (P3)**: 17 任务（3 测试 + 14 实现）
- **Polish (Phase 8)**: 45 任务

### Parallel Opportunities Identified:
- **Setup**: 6 并行任务（T003-T008）
- **Foundational**: 18 并行任务（主题、UI 组件、Store、类型、工具）
- **US1**: 14 并行任务（测试 6 + 数据层 2 + UI 3 + 宪章 6）
- **US2**: 9 并行任务
- **US3**: 11 并行任务
- **US4**: 8 并行任务
- **US5**: 7 并行任务
- **Polish**: 38 并行任务

**总并行机会**: ~111 任务（63% 可并行执行）

### Independent Test Criteria:

#### US1 (键盘输入记账)
✅ 打开应用 → 添加支出 → 输入金额、类别、备注 → 保存 → 验证出现在列表顶部

#### US2 (语音输入记账)
✅ 打开应用 → 语音输入 → 说"早餐15块" → 验证识别并创建记录

#### US3 (拍照识别)
✅ 拍摄小票 → 验证识别金额和商家 → 保存 → 查看记录详情中的照片

#### US4 (统计图表)
✅ 记录一周数据 → 打开统计页 → 验证折线图、饼图、总支出显示正确

#### US5 (分类管理)
✅ 添加自定义类别"医疗" → 在记账时可选择该类别 → 设置预算 → 验证提醒

---

## Format Validation

✅ **所有 175 个任务遵循严格的 checklist 格式**:
- [x] Checkbox: `- [ ]` ✅
- [x] Task ID: T001-T175 ✅
- [x] [P] marker: 111 个并行任务标记 ✅
- [x] [Story] label: 96 个用户故事任务标记（US1-US5）✅
- [x] Description: 包含明确的文件路径和操作 ✅

**示例验证**:
- ✅ `- [ ] T035 [P] [US1] useExpenses Hook 单元测试 __tests__/hooks/useExpenses.test.ts`
- ✅ `- [ ] T043 [US1] 实现 useExpenses Hook src/hooks/useExpenses.ts`
- ✅ `- [ ] T131 [P] 验证所有图标来自 @expo/vector-icons`

---

## Notes

- **[P]** 标记的任务可并行执行（不同文件，无依赖）
- **[Story]** 标签将任务映射到具体用户故事，便于追踪
- 每个用户故事应独立完成并可测试
- **TDD 强制**: 测试必须在实现前编写并验证失败
- 在每个 checkpoint 停止验证故事独立性
- 避免：模糊任务、同文件冲突、破坏独立性的跨故事依赖

---

**生成完成**: 2025-11-15  
**总任务数**: 175  
**预计工作量**: 6-8 周（1 名全栈开发者），或 2-3 周（3 名并行开发）  
**下一步**: 开始 Phase 1 Setup 任务（T001-T008）
