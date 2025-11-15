# Quickstart Guide: Transaction Detail and Filter Interactions

**Feature**: 002-transaction-detail-interaction  
**Last Updated**: 2025-11-15

## Overview

本指南帮助开发者快速设置、运行和测试交易详情和筛选功能。包含环境配置、依赖安装、开发工作流和测试指南。

---

## Prerequisites

确保已安装以下工具:

- **Node.js**: ≥18.0.0 (推荐使用LTS版本)
- **npm**: ≥9.0.0 或 **yarn**: ≥1.22.0
- **Expo CLI**: 通过`npx expo`使用(无需全局安装)
- **iOS Simulator**(macOS): Xcode 14+
- **Android Emulator**: Android Studio + API Level 31+
- **Git**: 用于版本控制

**验证安装**:
```bash
node --version  # 应显示 v18.x.x 或更高
npm --version   # 应显示 9.x.x 或更高
npx expo --version  # 应显示 Expo CLI 版本
```

---

## Setup

### 1. Clone Repository & Checkout Branch

```bash
# Clone仓库(如果尚未clone)
git clone <repository-url>
cd my-tally-book

# Checkout功能分支
git checkout 002-transaction-detail-interaction

# 确认分支
git branch --show-current
# 应显示: 002-transaction-detail-interaction
```

### 2. Install Dependencies

```bash
# 安装项目依赖
npm install

# 安装本功能的新增依赖
npx expo install @gorhom/bottom-sheet
npx expo install react-native-reanimated
npx expo install react-native-gesture-handler
npx expo install expo-image-picker
npx expo install @react-native-async-storage/async-storage

# 验证依赖
npm list @gorhom/bottom-sheet react-native-reanimated
```

### 3. Configure Reanimated Plugin

确保`babel.config.js`包含Reanimated插件配置:

```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // 必须是最后一个插件
    ],
  };
};
```

**注意**:修改`babel.config.js`后需清除缓存:
```bash
npx expo start -c
```

### 4. Verify TypeScript Configuration

确保`tsconfig.json`启用strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

---

## Development

### Running the App

#### iOS Simulator (macOS only)

```bash
# 启动Expo开发服务器并打开iOS模拟器
npx expo start --ios

# 或者先启动服务器,再手动选择iOS
npx expo start
# 然后按 'i' 键
```

#### Android Emulator

```bash
# 确保Android Emulator已启动
# 启动Expo开发服务器并打开Android
npx expo start --android

# 或者先启动服务器,再手动选择Android
npx expo start
# 然后按 'a' 键
```

#### Web (可选,用于快速UI测试)

```bash
npx expo start --web
# 然后按 'w' 键
```

### Hot Reload

Expo默认启用Fast Refresh:
- 保存文件时自动重新加载
- 保持组件状态(大部分情况)
- 如果遇到问题,按`r`键手动刷新

### Clearing Cache

如果遇到奇怪的错误:

```bash
# 清除Expo缓存并重启
npx expo start -c

# 清除npm缓存
npm cache clean --force

# 删除node_modules并重新安装
rm -rf node_modules
npm install
```

---

## Testing

### Running Unit Tests

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- useTransactionFilter.test.ts

# 运行测试并生成覆盖率报告
npm test -- --coverage

# 监视模式(文件变更时自动运行测试)
npm test -- --watch
```

### Test Structure

本功能的测试文件位于:

```
__tests__/
├── components/
│   ├── FloatingActionButton.test.tsx
│   ├── FilterBottomSheet.test.tsx
│   └── TransactionDetailView.test.tsx
├── hooks/
│   ├── useTransactionFilter.test.tsx
│   └── useTransactionCRUD.test.tsx
└── screens/
    ├── TransactionDetailScreen.test.tsx
    └── TransactionEditScreen.test.tsx
```

### Writing Tests (TDD Workflow)

**遵循红-绿-重构循环**:

1. **写测试(Red)**:
```typescript
// __tests__/hooks/useTransactionFilter.test.tsx
import { renderHook } from '@testing-library/react-hooks';
import { useTransactionFilter } from '@/hooks/useTransactionFilter';

describe('useTransactionFilter', () => {
  it('should filter transactions by type', () => {
    const transactions = [
      { id: '1', type: 'income', amount: 100, /* ... */ },
      { id: '2', type: 'expense', amount: 50, /* ... */ },
    ];
    
    const { result } = renderHook(() => 
      useTransactionFilter(transactions, { 
        typeFilter: 'expense', 
        sortBy: 'newest',
        selectedCategories: []
      })
    );
    
    expect(result.current.filteredTransactions).toHaveLength(1);
    expect(result.current.filteredTransactions[0].type).toBe('expense');
  });
});
```

2. **验证失败**:运行`npm test`,确认测试失败(因为功能尚未实现)

3. **实现功能(Green)**:编写最少代码使测试通过

4. **重构**:优化代码,确保测试仍然通过

### Component Testing Best Practices

使用`@testing-library/react-native`的语义查询:

```typescript
import { render, fireEvent } from '@testing-library/react-native';

it('should navigate to edit screen when edit button is pressed', () => {
  const onEdit = jest.fn();
  const { getByLabelText } = render(
    <TransactionDetailView 
      transaction={mockTransaction}
      onEdit={onEdit}
      // ...
    />
  );
  
  // 优先使用accessibilityLabel查询
  const editButton = getByLabelText('编辑交易');
  fireEvent.press(editButton);
  
  expect(onEdit).toHaveBeenCalledTimes(1);
});
```

**查询优先级**:
1. `getByLabelText` (accessibilityLabel)
2. `getByRole` (accessibilityRole)
3. `getByText` (可见文本)
4. `getByTestId` (最后手段)

### E2E Testing (Detox)

**安装Detox**(可选):

```bash
npm install --save-dev detox detox-cli
npx detox init -r jest
```

**运行E2E测试**:

```bash
# 构建iOS应用
npx detox build --configuration ios.sim.debug

# 运行E2E测试
npx detox test --configuration ios.sim.debug
```

**示例E2E测试**:

```typescript
// __tests__/e2e/transactionDetailFlow.e2e.ts
describe('Transaction Detail Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should view, edit, and delete a transaction', async () => {
    // 点击第一笔交易
    await element(by.id('transaction-item-0')).tap();
    
    // 验证详情页显示
    await expect(element(by.text('Detail Transaction'))).toBeVisible();
    
    // 点击编辑按钮
    await element(by.label('编辑交易')).tap();
    
    // 修改金额
    await element(by.id('amount-input')).clearText();
    await element(by.id('amount-input')).typeText('3000');
    
    // 保存
    await element(by.text('Save')).tap();
    
    // 验证更新
    await expect(element(by.text('$3000'))).toBeVisible();
  });
});
```

---

## Debugging

### React DevTools

```bash
# 启动应用后,按Cmd+D(iOS)或Cmd+M(Android)打开开发菜单
# 选择"Open React DevTools"
```

### Reanimated Debug Mode

在开发服务器启动时查看Reanimated worklet日志:

```bash
# 启动时启用调试
REACT_NATIVE_REANIMATED_PLUGIN_LOG=1 npx expo start
```

### Performance Monitor

在应用中启用性能监控:

```tsx
// App.tsx
import { PerformanceMonitor } from 'react-native-performance-monitor';

export default function App() {
  return (
    <>
      <YourApp />
      {__DEV__ && <PerformanceMonitor />}
    </>
  );
}
```

### Accessibility Inspector

**iOS**:
1. 打开"Settings" → "Accessibility" → "VoiceOver"
2. 启用VoiceOver
3. 在模拟器中测试导航

**Android**:
1. 打开"Settings" → "Accessibility" → "TalkBack"
2. 启用TalkBack
3. 在模拟器中测试导航

### Common Issues

#### Issue: "Invariant Violation: requireNativeComponent: 'RNGestureHandlerButton' was not found"

**解决方案**:
```bash
npx expo start -c
# 重启应用
```

#### Issue: Bottom Sheet不显示

**检查**:
1. `GestureHandlerRootView`是否包裹应用根组件
2. `BottomSheetModalProvider`是否正确配置

```tsx
// App.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <YourApp />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
```

#### Issue: TypeScript类型错误

**解决方案**:
```bash
# 重新生成类型定义
npx expo customize tsconfig.json

# 重启TypeScript服务器(VSCode)
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## Code Quality

### Linting

```bash
# 运行ESLint
npm run lint

# 自动修复可修复的问题
npm run lint -- --fix
```

### Type Checking

```bash
# 运行TypeScript编译器(仅类型检查,不生成文件)
npx tsc --noEmit
```

### Pre-commit Hooks

确保每次提交前运行lint和测试:

```bash
# 安装husky和lint-staged
npm install --save-dev husky lint-staged

# 初始化husky
npx husky init

# 配置pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
```

**package.json配置**:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "jest --bail --findRelatedTests"
    ]
  }
}
```

---

## Useful Commands

| 命令 | 描述 |
|------|------|
| `npx expo start` | 启动开发服务器 |
| `npx expo start -c` | 清除缓存并启动 |
| `npx expo start --ios` | 启动并打开iOS模拟器 |
| `npx expo start --android` | 启动并打开Android模拟器 |
| `npm test` | 运行所有测试 |
| `npm test -- --coverage` | 运行测试并生成覆盖率报告 |
| `npm run lint` | 运行ESLint |
| `npx tsc --noEmit` | TypeScript类型检查 |
| `npx expo doctor` | 检查项目健康状态 |
| `npx expo upgrade` | 升级Expo SDK |

---

## File Structure Reference

开发时需要创建/修改的文件:

```
my-tally-book/
├── app/
│   ├── transaction/
│   │   ├── [id].tsx              # 创建:交易详情页
│   │   └── edit/[id].tsx         # 创建:交易编辑页
│   └── (tabs)/
│       └── index.tsx             # 修改:添加筛选按钮和FAB
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── FloatingActionButton.tsx      # 创建
│   │   │   └── ConfirmDialog.tsx             # 创建
│   │   └── features/
│   │       ├── TransactionDetailView.tsx     # 创建
│   │       ├── TransactionEditForm.tsx       # 创建
│   │       └── FilterBottomSheet.tsx         # 创建
│   │
│   ├── hooks/
│   │   ├── useTransactionFilter.ts           # 创建
│   │   ├── useTransactionCRUD.ts             # 创建
│   │   └── useFABAnimation.ts                # 创建
│   │
│   ├── services/
│   │   └── transactionStorage.ts             # 创建/修改
│   │
│   └── types/
│       └── transaction.ts                    # 修改:添加类型定义
│
└── __tests__/
    ├── components/
    ├── hooks/
    ├── screens/
    └── e2e/
```

---

## Next Steps

完成环境设置后:

1. **阅读规范文档**:
   - `specs/002-transaction-detail-interaction/spec.md` - 功能需求
   - `specs/002-transaction-detail-interaction/plan.md` - 实现计划
   - `specs/002-transaction-detail-interaction/data-model.md` - 数据模型

2. **查看类型定义**:
   - `specs/002-transaction-detail-interaction/contracts/types.ts`

3. **开始TDD开发**:
   - 从P1用户故事开始(查看详情、编辑交易)
   - 每个功能先写测试,再实现

4. **运行持续测试**:
   - 开启`npm test -- --watch`监视模式
   - 每次代码更改自动运行相关测试

5. **提交前检查**:
   - 运行`npm test -- --coverage`确保≥90%覆盖率
   - 运行`npm run lint`确保0错误0警告
   - 运行`npx tsc --noEmit`确保0类型错误

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [Bottom Sheet Library](https://gorhom.github.io/react-native-bottom-sheet/)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/)

---

**Questions?** 查看项目宪章:`/data/workspace/my-tally-book/.specify/memory/constitution.md`
