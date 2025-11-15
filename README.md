# 记账本 (My Tally Book)

一个现代化的移动记账应用，支持键盘输入、语音识别和拍照识别三种记账方式。

## 功能特性

### MVP (v1.0) - 已实现 ✅

- ✅ **键盘输入记账**: 快速输入支出金额、类别和备注
- ✅ **类别管理**: 8个预设类别（餐饮、交通、购物、娱乐、医疗、教育、住房、其他）
- ✅ **支出列表**: 按时间倒序查看所有支出记录
- ✅ **今日统计**: 实时显示今日支出总额和记录数
- ✅ **金额格式化**: 自动格式化金额为千分位格式 (¥1,234.56)
- ✅ **深色模式**: 完整支持浅色/深色主题自动切换
- ✅ **本地存储**: SQLite 数据库持久化存储
- ✅ **无障碍支持**: 完整的 accessibility 标签和语义化

### 计划功能 (v2.0+)

- ⏳ 语音输入记账
- ⏳ 拍照识别账单 (OCR)
- ⏳ 支出趋势统计图表
- ⏳ 自定义类别管理
- ⏳ 预算提醒

## 技术栈

- **框架**: Expo SDK 51 + React Native 0.74+
- **语言**: TypeScript 5.0+ (strict mode)
- **导航**: Expo Router 3.5 (基于 React Navigation)
- **状态管理**: Zustand
- **数据库**: SQLite (expo-sqlite)
- **UI 组件**: 自定义组件库 (遵循 iOS HIG)
- **动画**: react-native-reanimated 3+
- **图标**: @expo/vector-icons (Ionicons)
- **测试**: Jest + @testing-library/react-native

## 项目结构

\`\`\`
my-tally-book/
├── app/                      # Expo Router 路由
│   ├── _layout.tsx          # 根布局
│   └── (tabs)/              # Tab 导航
│       ├── _layout.tsx      # Tab 布局
│       ├── index.tsx        # 记账主页
│       └── list.tsx         # 支出列表
├── src/
│   ├── components/
│   │   ├── ui/              # 通用 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── SafeAreaWrapper.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Toast.tsx
│   │   └── features/        # 业务组件
│   │       ├── ExpenseForm.tsx
│   │       ├── CategoryPicker.tsx
│   │       └── ExpenseListItem.tsx
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useTheme.ts
│   │   ├── useExpenses.ts
│   │   └── useCategories.ts
│   ├── services/            # 服务层
│   │   ├── database.ts      # SQLite 操作
│   │   ├── storage.ts       # AsyncStorage
│   │   └── fileSystem.ts    # 文件管理
│   ├── store/               # Zustand 状态管理
│   │   ├── expenseStore.ts
│   │   ├── categoryStore.ts
│   │   └── settingsStore.ts
│   ├── types/               # TypeScript 类型定义
│   │   ├── expense.ts
│   │   ├── category.ts
│   │   ├── statistics.ts
│   │   ├── offlineTask.ts
│   │   └── settings.ts
│   ├── utils/               # 工具函数
│   │   ├── formatting.ts    # 金额/日期格式化
│   │   ├── validation.ts    # 输入验证
│   │   └── extractors.ts    # NLP 文本提取
│   └── theme/               # 主题系统
│       ├── colors.ts        # 颜色定义
│       ├── typography.ts    # 字体系统
│       └── spacing.ts       # 间距系统
├── __tests__/               # 测试文件
├── assets/                  # 静态资源
└── specs/                   # 项目规范文档
\`\`\`

## 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- Expo Go App (用于真机测试)

### 安装依赖

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### 运行开发服务器

\`\`\`bash
# 启动 Expo 开发服务器
npm start

# 在 iOS 模拟器运行
npm run ios

# 在 Android 模拟器运行
npm run android

# 在浏览器运行 (web)
npm run web
\`\`\`

### 运行测试

\`\`\`bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式
npm run test:watch
\`\`\`

### 类型检查

\`\`\`bash
npm run type-check
\`\`\`

### 代码检查

\`\`\`bash
npm run lint
\`\`\`

## 环境配置

复制 \`.env.example\` 为 \`.env\` 并填写配置:

\`\`\`env
# 百度 OCR API (用于拍照识别功能)
BAIDU_API_KEY=your_api_key_here
BAIDU_SECRET_KEY=your_secret_key_here
\`\`\`

## 架构设计

### 数据流

\`\`\`
User Input → Component → Hook → Store → Service → Database
                  ↓         ↓       ↓        ↓         ↓
                View ← State ← Action ← Data ← SQLite
\`\`\`

### 核心原则

本项目遵循《记账本项目宪章 v2.0.0》七大原则:

1. **HIG Compliance**: 遵循 Apple 人机界面指南
2. **Code Quality**: TypeScript strict mode, 组件/服务分离
3. **Test-First**: TDD 工作流, ≥90% 测试覆盖率
4. **Accessibility**: 完整的无障碍支持, WCAG AA 标准
5. **Performance**: 60fps 动画, FlatList 虚拟化, <3s 启动时间
6. **Dark Mode**: 完整的深色模式支持
7. **Safe Areas**: SafeAreaView + KeyboardAvoidingView

## 贡献指南

本项目采用严格的开发流程:

1. **TDD 开发**: 先写测试，再写实现
2. **类型安全**: 所有函数必须有类型定义
3. **无障碍优先**: 所有交互元素必须有 accessibility 标签
4. **性能优化**: 遵循 React Native 最佳实践
5. **代码审查**: 所有 PR 需要通过 ESLint 和类型检查

## 许可证

MIT License

## 作者

My Tally Book Team

---

**项目状态**: MVP 完成 ✅ | 版本: v1.0.0 | 更新时间: 2025-11-15
