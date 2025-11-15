# Tally Book (记账本) Development Guidelines

Auto-generated from feature plans. Last updated: 2025-11-15

## Active Technologies
- TypeScript 5.0+ (strict mode enabled), Expo SDK 50+ (002-transaction-detail-interaction)
- AsyncStorage (交易数据持久化)或SQLite (如需复杂查询和筛选) (002-transaction-detail-interaction)

**Language/Version**: TypeScript 5.0+ (strict mode enabled), Expo SDK 51

**Primary Frameworks**:
- React Native 0.74+ (Expo managed workflow)
- React Navigation 6+ (native-stack, bottom-tabs)
- react-native-reanimated 3+ (UI 线程动画)
- react-native-safe-area-context (安全区域)
- @expo/vector-icons (图标库)

**State Management**: Zustand (轻量级全局状态管理)

**Data Storage**:
- AsyncStorage (@react-native-async-storage/async-storage) - 配置存储
- SQLite (expo-sqlite) - 支出记录持久化
- expo-file-system - 照片附件存储

**External APIs**:
- Expo Speech (语音识别 - 本地)
- 百度 OCR API (小票识别)
- NLP 提取：正则表达式 + 规则引擎（本地）

**UI Components**:
- Victory Native (图表库)
- 自定义组件库（符合 Apple HIG）

**Testing**:
- Jest 29+ (单元测试)
- @testing-library/react-native (组件测试)
- Detox (E2E 测试)

**Code Quality**:
- ESLint (@expo/eslint-config)
- TypeScript Compiler (strict mode)
- Prettier (代码格式化)

**Target Platform**: iOS 15.0+, Android 6.0+

**Project Type**: mobile (Expo/React Native cross-platform app)

---

## Project Structure

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
│   ├── hooks/                # 自定义 Hooks (useExpenses, useCategories...)
│   ├── services/             # 数据层 (database, storage, ocrApi, voiceApi...)
│   ├── store/                # 状态管理 (Zustand stores)
│   ├── types/                # TypeScript 类型定义
│   ├── utils/                # 工具函数 (formatting, validation, extractors...)
│   └── theme/                # 主题配置 (colors, typography, spacing)
│
├── __tests__/                # 测试文件
│   ├── components/           # 组件测试
│   ├── hooks/                # Hook 测试
│   ├── services/             # 服务测试
│   └── e2e/                  # E2E 测试 (Detox)
│
├── assets/                   # 图片、字体
├── specs/                    # 需求文档
│   └── 001-expense-tracking-app/
│       ├── spec.md           # 功能规范
│       ├── plan.md           # 实现计划
│       ├── research.md       # 技术调研
│       ├── data-model.md     # 数据模型
│       ├── quickstart.md     # 快速入门
│       └── contracts/        # API 合约
│
├── .specify/                 # Speckit 工作流
│   ├── memory/
│   │   └── constitution.md   # 项目宪章
│   ├── templates/            # 文档模板
│   └── scripts/              # 自动化脚本
│
├── .codebuddy/               # CodeBuddy 配置
│   └── commands/             # 自定义命令
│
├── app.json                  # Expo 配置
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── jest.config.js
└── README.md
```

---

## Commands

### Development

```bash
# 安装依赖
npm install

# 启动开发服务器 (Expo Go)
npm start
expo start

# 在 iOS 模拟器运行
npm run ios
npx expo run:ios

# 在 Android 模拟器运行
npm run android
npx expo run:android

# 清除缓存启动
expo start -c
```

### Testing

```bash
# 运行单元测试
npm test

# 生成覆盖率报告
npm test -- --coverage

# 监视模式（自动重测）
npm test -- --watch

# 运行 E2E 测试 (Detox)
detox build --configuration ios.sim.debug
detox test --configuration ios.sim.debug
```

### Code Quality

```bash
# TypeScript 类型检查
npm run type-check
tsc --noEmit

# ESLint 检查
npm run lint

# 自动修复 ESLint 问题
npm run lint -- --fix

# 代码格式化
npm run format
```

### Building

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

# 本地构建预览
eas build --platform ios --local
```

### Database

```bash
# 数据库会在应用首次启动时自动初始化
# 查看数据库内容：使用 Expo SQLite Inspector 或命令行工具

# 导出数据（在应用中调用）
import { exportData } from '@/services/database';
const jsonData = await exportData();

# 清除数据库（卸载应用重装）
```

---

## Code Style

### TypeScript Guidelines

**严格模式**:
```typescript
// tsconfig.json 已启用 strict: true
// 禁止使用 any（需文档化例外）

// ✅ 正确
function addExpense(amount: number): Expense {
  // ...
}

// ❌ 错误
function addExpense(amount: any) {
  // ...
}
```

**类型定义**:
```typescript
// 所有 Props 和状态都必须有类型定义
interface ExpenseFormProps {
  onSubmit: (expense: CreateExpenseDTO) => void;
  initialData?: Expense;
}

export function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  // ...
}
```

**Hooks 模式**:
```typescript
// 业务逻辑封装在自定义 Hooks 中
export function useExpenses(): UseExpensesReturn {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  const addExpense = async (data: CreateExpenseDTO) => {
    // 逻辑实现
  };
  
  return { expenses, addExpense };
}
```

### React Native Best Practices

**组件分离**:
```typescript
// 展示组件 (src/components/ui/)
export function Button({ title, onPress }: ButtonProps) {
  return <Pressable onPress={onPress}>...</Pressable>;
}

// 容器组件 (src/screens/)
export function HomeScreen() {
  const { addExpense } = useExpenses();
  return <ExpenseForm onSubmit={addExpense} />;
}
```

**性能优化**:
```typescript
// 使用 React.memo 避免不必要的重渲染
export const ExpenseListItem = React.memo(({ expense }: Props) => {
  // ...
});

// 使用 useMemo 缓存计算结果
const totalAmount = useMemo(
  () => expenses.reduce((sum, e) => sum + e.amount, 0),
  [expenses]
);

// 使用 useCallback 缓存回调函数
const handlePress = useCallback(() => {
  // ...
}, [dependencies]);
```

**列表渲染**:
```typescript
// 使用 FlatList 虚拟化长列表
<FlatList
  data={expenses}
  renderItem={({ item }) => <ExpenseListItem expense={item} />}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Accessibility Requirements

**所有交互元素必须有辅助功能标签**:
```typescript
<Pressable
  accessibilityRole="button"
  accessibilityLabel="添加支出"
  accessibilityHint="打开支出输入表单"
  onPress={handlePress}
>
  <Text>添加支出</Text>
</Pressable>
```

**支持动态字体**:
```typescript
// 默认启用字体缩放
<Text allowFontScaling={true} maxFontSizeMultiplier={2}>
  {expense.amount}
</Text>
```

**触摸目标 ≥44pt**:
```typescript
<Pressable
  style={{ minHeight: 44, minWidth: 44 }}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  <Icon name="close" size={24} />
</Pressable>
```

### Theme System

**使用主题系统**:
```typescript
import { useTheme } from '@/hooks/useTheme';

export function MyComponent() {
  const { theme, colorScheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>
        Hello
      </Text>
    </View>
  );
}
```

**禁止硬编码颜色**:
```typescript
// ❌ 错误
<View style={{ backgroundColor: '#FFFFFF' }}>

// ✅ 正确
<View style={{ backgroundColor: theme.colors.background }}>
```

### Testing Standards

**TDD 工作流（强制）**:
```typescript
// 1. 先编写测试
describe('useExpenses', () => {
  it('should add expense successfully', async () => {
    const { result } = renderHook(() => useExpenses());
    
    await act(async () => {
      await result.current.addExpense({
        amount: 50,
        categoryId: 'cat_001',
        inputMethod: InputMethod.KEYBOARD,
      });
    });
    
    expect(result.current.expenses).toHaveLength(1);
    expect(result.current.expenses[0].amount).toBe(50);
  });
});

// 2. 验证测试失败（红）
// 3. 实现功能（绿）
// 4. 重构代码
```

**组件测试**:
```typescript
import { render, fireEvent } from '@testing-library/react-native';

describe('ExpenseForm', () => {
  it('should call onSubmit with form data', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <ExpenseForm onSubmit={onSubmit} />
    );
    
    fireEvent.changeText(getByPlaceholderText('金额'), '50');
    fireEvent.press(getByText('保存'));
    
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 50 })
    );
  });
});
```

**覆盖率要求**: ≥90%

---

## Recent Changes
- 002-transaction-detail-interaction: Added TypeScript 5.0+ (strict mode enabled), Expo SDK 50+

### 2025-11-15: Feature 001 - 家庭支出统计应用（初始版本）

**新增技术栈**:
- Expo SDK 51 + React Native
- Zustand (状态管理)

**新增核心功能**:

**架构决策**:

---

<!-- MANUAL ADDITIONS START -->
<!-- 在此区域添加项目特定的自定义规则和指南 -->
<!-- 此区域内容不会被自动更新覆盖 -->

<!-- MANUAL ADDITIONS END -->
