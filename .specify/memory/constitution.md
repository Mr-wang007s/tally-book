# 记账本项目宪章

<!--
同步影响报告：
- 版本变更: 1.1.0 → 2.0.0
- 变更类型: MAJOR - 技术栈破坏性变更（Swift/UIKit → Expo/React Native）
- 变更原因: 采用 Expo 作为应用框架，移除 Swift 相关内容
- 核心变更:
  * 技术栈：Swift 5.9+ → TypeScript/JavaScript + Expo SDK
  * 架构模式：MVVM → React 组件化架构
  * UI 框架：UIKit/SwiftUI → React Native 组件
  * 测试工具：XCTest → Jest + React Native Testing Library
  * 代码检查：SwiftLint → ESLint + TypeScript
  * 保持不变：Apple HIG 原则、辅助功能要求、性能标准、深色模式支持
- 模板更新状态:
  ⚠ plan-template.md - 需要更新为 Expo 项目结构
  ⚠ spec-template.md - 需要更新技术要求
  ⚠ tasks-template.md - 需要更新任务路径和工具链
- 待办事项: 更新所有模板以反映 Expo/React Native 技术栈
-->

## 核心原则

### 一、Apple 人机界面指南（HIG）合规性

**必须严格遵守 Apple 针对 iPhone 应用的人机界面指南（使用 Expo/React Native 实现）：**

- **动态字体（Dynamic Type）**：使用 `expo-font` 和响应式字体缩放，支持用户选择的文字大小设置（从标准尺寸到最大辅助功能尺寸）。
- **SF Symbols**：使用 `@expo/vector-icons` 或 `react-native-sf-symbols` 库实现 SF Symbols；仅当库不支持时才使用自定义图标。
- **自适应布局**：使用 React Native 的 Flexbox 和 `react-native-responsive-screen` 实现自适应布局，适配所有 iPhone 尺寸（SE 到 Pro Max）。
- **系统颜色**：使用 Expo 的 `useColorScheme` hook 和语义化颜色命名，自动支持深色模式。
- **原生体验**：优先使用 Expo 和 React Native 内置组件；复杂交互使用 `react-native-gesture-handler` 和 `react-native-reanimated`。

**理由说明**：即使使用跨平台框架，HIG 合规性仍然确保 iOS 用户获得符合平台期望的体验，降低认知负担。

**可测量指标**：
- 100% 的文本组件支持动态字体缩放（通过 `allowFontScaling` 和 `maxFontSizeMultiplier`）
- 在有对应 SF Symbols 的情况下，自定义图标数量为 0
- 所有屏幕通过 iPhone SE 至 Pro Max 模拟器测试，布局无损坏
- 使用 Expo 的 `useColorScheme` 实现深色模式，覆盖率 100%

**验收标准**：
- 每个 PR 包含不同屏幕尺寸的截图（小屏、中屏、大屏）
- 辅助功能测试包含字体缩放测试（100% - 310%）
- 所有图标来源于 `@expo/vector-icons` 或有文档化的例外
- 深色模式自动响应系统设置

**反模式（禁止）**：
- ❌ 硬编码像素值（使用相对单位或 `Dimensions` API）
- ❌ 禁用字体缩放（`allowFontScaling={false}`）
- ❌ 使用自定义图标复制 SF Symbols
- ❌ 硬编码颜色值而非使用主题系统
- ❌ 固定高度的文本容器

**参考资料**：
- [Apple 人机界面指南](https://developer.apple.com/design/human-interface-guidelines/)
- [Expo 文档](https://docs.expo.dev/)
- [React Native 样式指南](https://reactnative.dev/docs/style)

---

### 二、代码质量与 React Native 最佳实践

**必须通过 TypeScript、React 惯用法和架构规范维持高代码质量：**

- **TypeScript 严格模式**：启用 `strict: true`，所有代码必须有明确类型标注；禁止使用 `any`（需文档化例外）。
- **React 组件架构**：遵循容器/展示组件分离；业务逻辑使用自定义 Hooks 封装；组件必须可单元测试。
- **状态管理**：简单状态使用 `useState`/`useReducer`；复杂全局状态使用 Zustand 或 Redux Toolkit；避免过度状态提升。
- **不可变性**：状态更新必须遵循不可变原则；使用扩展运算符或 Immer 库。
- **性能优化**：使用 `React.memo`、`useMemo`、`useCallback` 避免不必要的重渲染；列表使用 `FlatList`/`SectionList` 虚拟化。
- **ESLint + TypeScript**：使用 `@expo/eslint-config` 和自定义规则；CI 中 0 错误 0 警告。

**理由说明**：TypeScript 提供类型安全，React Hooks 模式支持代码复用，严格的架构规范确保可维护性和团队协作效率。

**可测量指标**：
- TypeScript 编译 0 错误（`tsc --noEmit`）
- ESLint 检查 0 错误 0 警告
- 所有自定义 Hooks 和业务逻辑函数 100% 可单元测试
- 代码审查批准需要架构合规性确认
- 平均组件复杂度 ≤15（使用 ESLint complexity rule）

**验收标准**：
- 每个组件都有清晰的职责（展示或容器）
- 复杂业务逻辑封装在自定义 Hooks 中
- 所有 Props 和状态都有 TypeScript 类型定义
- 列表渲染使用虚拟化组件（FlatList/SectionList）
- 重计算使用 `useMemo`，回调函数使用 `useCallback`

**反模式（禁止）**：
- ❌ 在组件中直接编写复杂业务逻辑（应提取到 Hooks）
- ❌ 使用 `any` 类型而不添加注释说明
- ❌ 直接修改状态对象（必须返回新对象）
- ❌ 在渲染方法中创建函数（应使用 `useCallback`）
- ❌ 使用 `ScrollView` 渲染长列表（应使用 `FlatList`）
- ❌ 过度嵌套的组件层次（>5 层需重构）

**参考资料**：
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [React Hooks 最佳实践](https://react.dev/reference/react)
- [Expo TypeScript 指南](https://docs.expo.dev/guides/typescript/)

---

### 三、测试驱动开发（TDD）— 不可协商

**测试驱动开发对所有功能工作是强制性的（使用 Jest + React Native Testing Library）：**

- **红-绿-重构**：必须先编写测试 → 用户批准测试 → 验证测试失败 → 实现功能 → 测试通过 → 重构。
- **单元测试**：所有自定义 Hooks、业务逻辑函数必须有 >90% 的代码覆盖率（使用 Jest coverage）。
- **组件测试**：使用 `@testing-library/react-native` 测试组件行为（非实现细节）；关注用户交互和可访问性。
- **集成测试**：关键用户流程使用 Expo 的端到端测试或 Detox 进行集成测试。
- **快照测试**：UI 组件使用快照测试防止意外变更；但不能替代行为测试。
- **无未测试代码**：代码无测试不能合并；CI 在低于 90% 覆盖率时阻止合并。

**理由说明**：TDD 在 React Native 中尤为重要，因为跨平台代码需要更严格的测试来保证在不同设备上的一致性。

**可测量指标**：
- 单元测试覆盖率 ≥90%（Jest coverage report）
- 所有 P1 用户故事有至少 1 个端到端测试
- 所有自定义 Hooks 有完整的测试覆盖
- CI 在覆盖率低于阈值时构建失败
- 测试执行时间 <30 秒（单元测试），<5 分钟（集成测试）

**验收标准**：
- PR 包含测试先于实现的提交（通过 Git 历史验证）
- 测试在实现前失败（在 PR 描述中记录）
- 使用 `@testing-library/react-native` 的最佳实践（查询优先级）
- 快照测试仅用于稳定的 UI 组件
- 所有异步逻辑正确使用 `waitFor` 或 `findBy*`

**反模式（禁止）**：
- ❌ 在实现后才编写测试
- ❌ 测试实现细节（如组件内部状态）而非行为
- ❌ 过度依赖快照测试
- ❌ 不稳定的异步测试（缺少正确的等待机制）
- ❌ 使用 `getByTestId` 作为首选查询（应优先使用语义查询）
- ❌ Mock 过多导致测试与实际使用脱节

**参考资料**：
- [Jest 文档](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library 指导原则](https://testing-library.com/docs/guiding-principles)

---

### 四、辅助功能优先

**辅助功能不是可选项 — 它是一级需求（React Native 实现）：**

- **语义标签**：所有可交互组件必须有 `accessibilityLabel` 和 `accessibilityHint`；使用 `accessibilityRole` 标识组件类型。
- **动态字体**：已在原则一中涵盖；使用 `allowFontScaling={true}`（默认）和合理的 `maxFontSizeMultiplier`。
- **颜色对比度**：所有文本/背景组合必须符合 WCAG AA 标准（4.5:1 普通文本，3:1 大文本）；使用工具验证。
- **触摸目标**：所有可点击目标必须 ≥44x44 点；使用 `hitSlop` 或 `Pressable` 的 `style` 扩大触摸区域。
- **屏幕阅读器**：使用 `AccessibilityInfo` API 检测屏幕阅读器；使用 `accessibilityLiveRegion` 通知动态内容变更。
- **键盘导航**：支持外接键盘导航（iOS 支持硬件键盘）；焦点顺序逻辑清晰。

**理由说明**：React Native 的辅助功能 API 提供跨平台支持，正确使用可确保应用对所有用户可用。

**可测量指标**：
- 100% 可交互组件有 `accessibilityLabel`
- 所有文本组件支持字体缩放（`allowFontScaling={true}`）
- 颜色对比度 100% 符合 WCAG AA 标准
- 所有触摸目标 ≥44x44pt（使用 `hitSlop` 确保）
- VoiceOver/TalkBack 测试所有 P1 流程通过

**验收标准**：
- 每个 PR 包含辅助功能测试清单
- 使用 React Native Testing Library 的 `*ByRole` 查询验证语义
- 使用在线对比度检查器验证颜色
- 在真机上使用 VoiceOver 测试变更屏幕
- 所有 `Pressable`/`TouchableOpacity` 有合适的 `accessibilityRole`

**反模式（禁止）**：
- ❌ 可交互元素缺少 `accessibilityLabel`
- ❌ 使用通用标签如 "按钮" 或 "图片"
- ❌ 设置 `allowFontScaling={false}` 而无文档化理由
- ❌ 触摸目标 <44x44pt 且无 `hitSlop` 补偿
- ❌ 仅用颜色传达信息（必须有图标或文本）
- ❌ 忽略 `AccessibilityInfo` 的屏幕阅读器状态

**参考资料**：
- [React Native 辅助功能](https://reactnative.dev/docs/accessibility)
- [Expo 辅助功能指南](https://docs.expo.dev/guides/accessibility/)
- [WCAG 2.1 标准](https://www.w3.org/WAI/WCAG21/quickref/)

---

### 五、性能与响应性

**应用必须始终给人快速和响应的感觉（Expo/React Native 优化）：**

- **60 FPS 动画**：使用 `react-native-reanimated` 在 UI 线程运行动画；避免在 JS 线程运行动画。
- **JavaScript 线程**：重计算使用 `InteractionManager.runAfterInteractions` 延迟；长任务分片或使用 Web Worker。
- **启动时间**：使用 `expo-splash-screen` 优化启动体验；冷启动到交互 <3 秒（使用 Expo Go 测试可能更慢，生产构建为准）。
- **内存管理**：使用 `FlatList`/`SectionList` 虚拟化长列表；及时清理定时器、订阅和监听器。
- **捆绑包大小**：使用 `expo-updates` 的资源优化；避免导入整个库（使用 tree-shaking）；生产构建 <30MB。
- **网络优化**：使用 `axios` 或 `fetch` 配置超时（默认 30 秒）；实现请求缓存和离线支持。

**理由说明**：React Native 性能依赖正确使用原生模块和避免 JS 桥接瓶颈。原生动画和虚拟化是关键。

**可测量指标**：
- 动画保持 60fps（使用 Expo 的 Performance Monitor）
- 生产构建冷启动 <3 秒到第一个交互屏幕
- 内存占用 <200MB（使用 Xcode Instruments 或 Android Profiler）
- 捆绑包大小 <30MB（`expo export` 后检查）
- 所有列表使用虚拟化（FlatList/SectionList）
- 网络请求超时 ≤30 秒

**验收标准**：
- 所有动画使用 `react-native-reanimated` 或 `react-native-gesture-handler`
- 列表超过 20 项时必须使用 FlatList/SectionList
- 使用 `React.memo`、`useMemo`、`useCallback` 优化重渲染
- `useEffect` 清理函数正确清理副作用
- 使用 Expo 的性能监控工具验证帧率
- 生产构建在真机上测试性能

**反模式（禁止）**：
- ❌ 使用 `Animated` API 进行复杂动画（应使用 Reanimated）
- ❌ 在渲染方法中执行重计算（应使用 `useMemo`）
- ❌ 使用 `ScrollView` 渲染长列表（应使用 `FlatList`）
- ❌ 忘记在 `useEffect` 中清理订阅/定时器
- ❌ 导入整个库而非单个模块（如 `import _ from 'lodash'`）
- ❌ 在 JS 线程频繁更新状态导致掉帧

**参考资料**：
- [React Native 性能优化](https://reactnative.dev/docs/performance)
- [Reanimated 文档](https://docs.swmansion.com/react-native-reanimated/)
- [Expo 性能最佳实践](https://docs.expo.dev/guides/performance/)

---

### 六、深色模式与自适应 UI

**所有 UI 必须完全支持浅色和深色模式外观（React Native 实现）：**

- **useColorScheme Hook**：使用 React Native 的 `useColorScheme` 或 `expo-system-ui` 检测系统主题。
- **主题系统**：使用 `react-native-paper`、`@react-navigation/native` 主题或自定义主题上下文。
- **语义颜色**：定义语义化颜色变量（`background`、`text`、`primary` 等），每个颜色有浅色/深色变体。
- **动态切换**：应用必须在系统主题变更时立即响应（通过 `useColorScheme` 的状态变化）。
- **图片适配**：使用不同的图片资源或 `tintColor` 适配深色模式；Expo 支持 `@2x`、`@3x` 和 `.dark` 后缀。

**理由说明**：深色模式是现代移动应用的标配，React Native 提供了简单的 API 实现跨平台支持。

**可测量指标**：
- 100% 的屏幕支持深色模式且无视觉缺陷
- 所有颜色通过主题系统定义（0 个硬编码颜色值）
- 使用 `useColorScheme` 实现动态主题切换
- 深色模式下所有文本可读性 100%
- 图片和图标在深色模式下正确显示

**验收标准**：
- PR 包含所有变更屏幕的浅色 + 深色模式截图
- 所有颜色定义在主题配置文件中
- 使用 `useColorScheme` 或主题库的 hook
- 模拟器中实时切换系统主题测试
- 图标使用 `tintColor` 适配主题

**反模式（禁止）**：
- ❌ 硬编码颜色值（如 `'#000000'`、`'white'`）
- ❌ 不使用 `useColorScheme` 检测系统主题
- ❌ 主题切换需要重启应用
- ❌ 深色模式下不可见的元素（白底白字）
- ❌ 图片在深色模式下显示不当（未使用 tintColor 或深色变体）

**参考资料**：
- [React Native 外观](https://reactnative.dev/docs/appearance)
- [Expo 系统 UI](https://docs.expo.dev/versions/latest/sdk/system-ui/)
- [React Navigation 主题](https://reactnavigation.org/docs/themes)

---

### 七、安全区域与系统手势

**UI 必须尊重 iOS 系统 UI 和用户手势期望（React Native 实现）：**

- **SafeAreaView**：使用 `react-native-safe-area-context` 的 `SafeAreaView` 或 `useSafeAreaInsets` hook 处理安全区域。
- **边到边布局**：背景色可延伸到边缘；内容使用 `SafeAreaView` 或手动应用 `insets`。
- **系统手势**：使用 `@react-navigation/native` 的原生手势；避免自定义手势与系统手势冲突。
- **键盘避让**：使用 `KeyboardAvoidingView` 或 `react-native-keyboard-aware-scroll-view` 处理键盘遮挡。
- **导航模式**：使用 `@react-navigation/native-stack` (Stack)、`@react-navigation/bottom-tabs` (Tabs)、Modal 遵循 iOS 导航范式。

**理由说明**：React Native 需要额外库来处理安全区域，但正确使用可确保在所有 iPhone 型号上显示正确。

**可测量指标**：
- 100% 的屏幕使用 `SafeAreaView` 或 `useSafeAreaInsets`
- 在 iPhone X+ 模拟器上 0 个内容被刘海/主页指示器裁剪
- 所有输入表单正确处理键盘遮挡
- 使用 React Navigation 的原生手势支持
- 导航模式符合 iOS 平台惯例

**验收标准**：
- 所有屏幕组件包裹在 `SafeAreaView` 或手动应用 `insets`
- 在有刘海设备（iPhone X+）和无刘海设备上测试
- 输入表单使用 `KeyboardAvoidingView` 或类似方案
- React Navigation 配置启用手势（默认启用，确保不被禁用）
- 横屏和竖屏都正确处理安全区域

**反模式（禁止）**：
- ❌ 不使用 `SafeAreaView` 或 `useSafeAreaInsets`
- ❌ 硬编码顶部/底部边距（如 `paddingTop: 44`）
- ❌ 禁用 React Navigation 的滑动返回手势
- ❌ 表单输入被键盘遮挡
- ❌ 自定义手势与系统手势冲突
- ❌ 在刘海或主页指示器区域放置交互元素

**参考资料**：
- [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)
- [React Navigation](https://reactnavigation.org/)
- [KeyboardAvoidingView](https://reactnative.dev/docs/keyboardavoidingview)

---

## 技术栈

**运行时**：Expo SDK 50+（或最新稳定版）  
**语言**：TypeScript 5.0+（启用 `strict` 模式）  
**部署目标**：iOS 15.0+、Android 6.0+（Expo 默认支持）  
**UI 框架**：React Native（Expo 管理版本）  
**导航**：React Navigation 6+（Native Stack、Bottom Tabs）  
**状态管理**：React Hooks（简单状态），Zustand 或 Redux Toolkit（复杂全局状态）  
**动画**：react-native-reanimated 3+、react-native-gesture-handler  
**样式**：StyleSheet、react-native-paper（可选）或自定义主题系统  
**图标**：@expo/vector-icons（包含 Ionicons、MaterialIcons、FontAwesome 等）  
**测试**：Jest、@testing-library/react-native、Detox（E2E 测试）  
**代码检查**：ESLint（@expo/eslint-config）、TypeScript Compiler  
**包管理**：npm 或 yarn  
**构建**：EAS Build（Expo Application Services）  
**更新**：EAS Update（OTA 更新）

---

## 质量门禁

**所有 PR 在合并前必须通过以下自动化门禁：**

1. **TypeScript 编译**：`tsc --noEmit` 成功，0 个类型错误
2. **ESLint**：0 个错误，0 个警告（`eslint . --ext .ts,.tsx`）
3. **测试通过**：`npm test` 所有测试通过（单元测试 + 组件测试）
4. **测试覆盖率**：变更文件 ≥90% 覆盖率（Jest coverage report）
5. **构建成功**：`expo prebuild` 和 `eas build` 成功（或 CI 模拟构建）
6. **性能检查**：Expo 性能监控显示 ≥58fps（使用 Performance Monitor）
7. **辅助功能审计**：所有可交互元素有 `accessibilityLabel`（通过测试验证）
8. **深色模式截图**：所有 UI 变更的浅色 + 深色模式截图
9. **代码审查**：至少 1 个批准审查，验证架构和 React 最佳实践

**审查者手动验证清单：**
- [ ] 组件职责清晰（展示/容器分离）
- [ ] 复杂逻辑封装在自定义 Hooks 中
- [ ] 使用 TypeScript 类型而非 `any`
- [ ] 列表使用 `FlatList`/`SectionList` 虚拟化
- [ ] 动画使用 Reanimated（非 Animated API）
- [ ] 使用 `SafeAreaView` 或 `useSafeAreaInsets`
- [ ] 测试在实现前编写（Git 历史验证）
- [ ] 辅助功能标签清晰描述元素用途
- [ ] 颜色通过主题系统定义

---

## 治理

**宪章权威**：本宪章优先于所有其他开发实践和风格偏好。任何偏离必须在 PR 描述中明确记录理由并获得项目维护者批准。

**修订流程**：
1. 通过 issue/讨论提出修订，附带理由和影响分析
2. 团队审查和批准（多数共识）
3. 根据语义化版本更新宪章版本
4. 将变更传播到模板（`plan-template.md`、`spec-template.md`、`tasks-template.md`）
5. 向所有贡献者宣布变更，附带迁移指南（如适用）

**版本控制策略**：
- **MAJOR**（X.0.0）：技术栈变更或原则的破坏性变更（如本次 Swift → Expo 迁移）
- **MINOR**（2.X.0）：添加新原则或现有原则的实质性扩展
- **PATCH**（2.0.X）：澄清、措辞、错别字修复、非语义改进

**合规审查**：每个冲刺回顾必须包括宪章合规性审查 — 识别违规并在下一个冲刺中修正。

**复杂性论证**：违反这些原则（如跳过 TDD、使用 `any` 类型、硬编码颜色）必须在 `plan.md` 复杂性跟踪表中记录，附带论证和修正时间表。

**运行时指南**：对于日常开发工作流程，请参考每个功能生成的快速入门文档（如 `/specs/###-feature/quickstart.md`）。宪章定义*我们构建什么*；快速入门定义*如何运行/测试它*。

**Expo 特定注意事项**：
- 使用 Expo 管理的工作流（Managed Workflow）优先，仅在必要时使用裸工作流（Bare Workflow）
- 所有原生模块变更必须通过 EAS Build 验证
- OTA 更新（EAS Update）不得包含原生代码变更
- 使用 Expo SDK 提供的 API 优先于第三方库

---

**版本**：2.0.0 | **批准日期**：2025-11-15 | **最后修订**：2025-11-15
