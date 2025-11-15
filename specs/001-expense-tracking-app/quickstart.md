# Quick Start Guide: 家庭支出统计应用

**Feature**: 家庭支出统计应用  
**Date**: 2025-11-15  
**Audience**: 开发者  
**Purpose**: 快速设置开发环境、运行应用、执行测试

---

## Prerequisites

### Required Software

- **Node.js**: 18.x or later ([下载](https://nodejs.org/))
- **npm** or **yarn**: Latest version
- **Expo CLI**: `npm install -g expo-cli`
- **Git**: Latest version
- **iOS Simulator** (macOS only): Xcode 14+ with iOS 15+ simulator
- **Android Emulator**: Android Studio with API 23+ emulator

### Environment Setup

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd my-tally-book
   git checkout 001-expense-tracking-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**:
   Create `.env` file in project root:
   ```bash
   # 百度 OCR API (可选，用于拍照识别)
   BAIDU_API_KEY=your_api_key_here
   BAIDU_SECRET_KEY=your_secret_key_here
   
   # 应用配置
   APP_ENV=development
   ```

4. **Initialize Database** (自动执行):
   应用首次启动时会自动初始化 SQLite 数据库和默认类别。

---

## Running the App

### Development Mode

#### Option 1: Expo Go (推荐快速开发)

```bash
# 启动 Expo 开发服务器
npm start
# or
expo start
```

然后：
- **iOS**: 按 `i` 在 iOS 模拟器中打开
- **Android**: 按 `a` 在 Android 模拟器中打开
- **物理设备**: 扫描终端中的 QR 码，使用 Expo Go 应用打开

#### Option 2: Development Build (原生功能测试)

```bash
# 构建 iOS 开发版本
npx expo run:ios

# 构建 Android 开发版本
npx expo run:android
```

### Production Build (EAS Build)

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账号
eas login

# 配置 EAS
eas build:configure

# 构建 iOS
eas build --platform ios

# 构建 Android
eas build --platform android
```

---

## Project Structure Overview

```text
my-tally-book/
├── app/                      # Expo Router 路由页面
│   ├── (tabs)/               # Tab 导航组
│   │   ├── index.tsx         # 记账主页
│   │   ├── list.tsx          # 支出列表
│   │   ├── stats.tsx         # 统计图表
│   │   └── settings.tsx      # 设置
│   └── _layout.tsx           # 根布局
│
├── src/
│   ├── components/           # UI 组件
│   │   ├── ui/               # 基础组件 (Button, Input...)
│   │   └── features/         # 业务组件 (ExpenseForm...)
│   ├── hooks/                # 自定义 Hooks (useExpenses...)
│   ├── services/             # 数据层 (database, storage...)
│   ├── store/                # 状态管理 (Zustand)
│   ├── types/                # TypeScript 类型
│   ├── utils/                # 工具函数
│   └── theme/                # 主题配置
│
├── __tests__/                # 测试文件
├── assets/                   # 图片、字体
├── specs/                    # 需求文档
└── app.json                  # Expo 配置
```

---

## Development Workflow

### 1. TDD Workflow (必须遵循)

```bash
# 步骤 1: 编写测试
# 创建 __tests__/hooks/useExpenses.test.ts

# 步骤 2: 运行测试（验证失败）
npm test

# 步骤 3: 实现功能
# 编写 src/hooks/useExpenses.ts

# 步骤 4: 运行测试（验证通过）
npm test

# 步骤 5: 重构代码
# 优化实现，保持测试通过
```

### 2. 组件开发流程

```bash
# 1. 创建组件测试
touch __tests__/components/ExpenseForm.test.tsx

# 2. 编写组件行为测试
# 使用 @testing-library/react-native

# 3. 实现组件
touch src/components/features/ExpenseForm.tsx

# 4. 验证无障碍性
# 使用 VoiceOver/TalkBack 测试

# 5. 验证深色模式
# 切换系统主题测试
```

---

## Running Tests

### Unit Tests

```bash
# 运行所有单元测试
npm test

# 运行特定测试文件
npm test useExpenses.test.ts

# 生成覆盖率报告
npm test -- --coverage

# 监视模式（文件变化自动重测）
npm test -- --watch
```

### Component Tests

```bash
# 运行组件测试
npm test -- components/

# 测试无障碍性
npm test -- --testNamePattern="accessibility"
```

### E2E Tests (Detox)

```bash
# 构建测试 APP
detox build --configuration ios.sim.debug

# 运行 E2E 测试
detox test --configuration ios.sim.debug
```

---

## Code Quality Checks

### TypeScript Compilation

```bash
# 检查类型错误
npm run type-check
# or
tsc --noEmit
```

### Linting

```bash
# 运行 ESLint
npm run lint

# 自动修复问题
npm run lint -- --fix
```

### Pre-commit Hook

```bash
# 安装 Husky (自动运行)
npm install

# 每次 commit 前自动执行：
# 1. ESLint 检查
# 2. TypeScript 编译
# 3. 单元测试
# 4. 代码格式化
```

---

## Database Management

### View Database Content

```bash
# 使用 Expo SQLite Inspector (推荐)
# 1. 启动应用（开发模式）
# 2. 在 Expo DevTools 中打开 "Database"
# 3. 查看表结构和数据

# 或使用 SQLite 命令行工具
# 1. 找到数据库文件路径（在应用日志中）
# 2. sqlite3 <path-to-db>
# 3. .tables  # 查看所有表
# 4. SELECT * FROM expenses;  # 查询数据
```

### Reset Database

```bash
# 方法 1: 卸载应用重装（模拟器）
# iOS: 长按应用图标 -> Remove App
# Android: 设置 -> 应用 -> 卸载

# 方法 2: 清除应用数据（代码）
# 在应用中添加开发者菜单项：清除所有数据
```

### Export Data

```typescript
// 在应用中调用
import { exportData } from '@/services/database';

const jsonData = await exportData();
console.log(jsonData);  // 可复制保存为 JSON 文件
```

---

## Debugging

### React Native Debugger

```bash
# 1. 安装 React Native Debugger
# macOS: brew install --cask react-native-debugger

# 2. 启动应用（开发模式）
npm start

# 3. 在应用中打开开发者菜单
# iOS: Cmd + D (模拟器) / 摇一摇 (真机)
# Android: Cmd + M (模拟器) / 摇一摇 (真机)

# 4. 选择 "Debug" 打开调试器
```

### Performance Profiling

```bash
# 1. 在开发者菜单中启用 "Performance Monitor"
# 2. 观察 FPS、内存使用、JS 线程占用

# 3. 使用 Flipper 进行深度分析
npx react-native-flipper
```

### Network Debugging

```bash
# 1. 在开发者菜单中启用 "Network Inspector"
# 2. 查看所有 HTTP 请求（OCR、语音识别 API）

# 或使用 Reactotron
npx reactotron
```

---

## Common Tasks

### Add a New Screen

```bash
# 1. 创建路由文件
touch app/new-screen.tsx

# 2. 实现屏幕组件
# 使用 SafeAreaView 和主题系统

# 3. 添加导航链接
# 使用 Expo Router 的 <Link href="/new-screen" />
```

### Add a New Expense Category

```typescript
// src/constants/categories.ts
export const DEFAULT_CATEGORIES = [
  // ... 现有类别
  {
    id: 'cat_009',
    name: '新类别',
    icon: 'star',  // 从 @expo/vector-icons 选择
    color: '#FF69B4',
    isDefault: true,
  },
];
```

### Implement a New Feature

```bash
# 按照 TDD 流程：
# 1. 在 specs/001-expense-tracking-app/tasks.md 中创建任务
# 2. 编写测试 (__tests__/)
# 3. 实现代码 (src/)
# 4. 验证宪章合规性（无障碍、性能、深色模式）
# 5. 提交 PR
```

---

## Environment-Specific Configuration

### Development

```typescript
// .env.development
APP_ENV=development
API_TIMEOUT=30000
ENABLE_MOCK_DATA=true
```

### Staging

```typescript
// .env.staging
APP_ENV=staging
API_TIMEOUT=10000
ENABLE_MOCK_DATA=false
```

### Production

```typescript
// .env.production
APP_ENV=production
API_TIMEOUT=10000
ENABLE_ANALYTICS=true
```

---

## Troubleshooting

### Issue: "Invariant Violation: Module AppRegistry is not a registered callable module"

**Solution**: 清除缓存并重启
```bash
expo start -c
```

### Issue: TypeScript 类型错误 "Cannot find module '@/types/expense'"

**Solution**: 检查 `tsconfig.json` 中的路径映射
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: SQLite 数据库锁定错误

**Solution**: 确保所有数据库操作在事务中完成，避免并发写入
```typescript
db.transaction(tx => {
  // 所有操作在此执行
});
```

### Issue: 图片无法显示（PhotoURI 无效）

**Solution**: 检查文件路径和权限
```typescript
import * as FileSystem from 'expo-file-system';

const info = await FileSystem.getInfoAsync(photoUri);
console.log('File exists:', info.exists);
```

### Issue: 深色模式颜色对比度不足

**Solution**: 使用在线对比度检查器验证
- 目标: ≥4.5:1（WCAG AA）
- 工具: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| 冷启动时间 | <3s | Time to interactive |
| FPS (UI 交互) | ≥60fps | Performance Monitor |
| 列表滚动 FPS | ≥60fps | FlatList performance |
| 数据库查询时间 | <100ms | Console.time() |
| OCR 识别时间 | <2s | API 响应时间 |
| 测试覆盖率 | ≥90% | Jest coverage |
| 捆绑包大小 | <30MB | EAS Build output |

### Measure Performance

```typescript
// 数据库查询性能
console.time('getExpenses');
const expenses = await getAllExpenses();
console.timeEnd('getExpenses');  // 应 <100ms

// 组件渲染性能
import { Profiler } from 'react';

<Profiler id="ExpenseList" onRender={(id, phase, actualDuration) => {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}}>
  <ExpenseList />
</Profiler>
```

---

## Useful Commands

```bash
# 清除缓存
expo start -c

# 查看应用日志
npx react-native log-ios    # iOS
npx react-native log-android  # Android

# 构建分析（捆绑包大小）
npx expo export

# 升级 Expo SDK
npx expo upgrade

# 检查依赖更新
npm outdated

# 格式化代码
npm run format

# 生成组件模板
npx hygen component new --name ExpenseCard
```

---

## Additional Resources

### Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Victory Native Charts](https://formidable.com/open-source/victory/docs/native/)

### Constitution & Standards

- [项目宪章 (Constitution)](../../.specify/memory/constitution.md)
- [数据模型 (Data Model)](./data-model.md)
- [API 合约 (Contracts)](./contracts/)
- [需求规范 (Spec)](./spec.md)

### External APIs

- [百度 OCR API](https://ai.baidu.com/tech/ocr)
- [Expo Speech Recognition](https://docs.expo.dev/versions/latest/sdk/speech/)

---

## Support & Contact

### Issues & Bugs

- 在 GitHub Issues 中报告 Bug
- 使用 Bug 模板，包含：环境信息、复现步骤、预期行为

### Feature Requests

- 通过 `/speckit.specify` 命令创建新功能规范
- 遵循宪章原则和 TDD 流程

### Code Review

- 所有 PR 需至少 1 个批准
- 验证清单：
  - [ ] TypeScript 编译通过
  - [ ] ESLint 无错误无警告
  - [ ] 测试覆盖率 ≥90%
  - [ ] 宪章合规性检查通过
  - [ ] 深色模式截图（UI 变更）

---

**Last Updated**: 2025-11-15  
**Version**: 1.0.0  
**Maintainer**: Development Team
