<!--
SYNC IMPACT REPORT
- Version: 1.1.0 -> 2.0.0
- Modified Principles:
  - Polished Aesthetics -> Visual Excellence
  - Comprehensive Test Coverage -> Testing Standards
- Added Sections:
  - Code Quality
  - UX Consistency
  - Performance
- Removed Sections:
  - Cross-Platform First
  - User-Centric Design
- Templates Requiring Updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ⚠ .specify/templates/checklist-template.md (无需更新)
  - ⚠ .specify/templates/commands/README.md (无需更新)
- Follow-up TODOs:
  - TODO(RATIFICATION_DATE): 填写项目正式通过日期（未知）
-->

# My Tally Book Constitution

**VERSION**: `2.0.0`
**RATIFICATION_DATE**: `TODO(RATIFICATION_DATE): 填写项目正式通过日期（未知）`
**LAST_AMENDED_DATE**: `2025-11-15`

## 1. Overview

本文件定义 `My Tally Book` 项目的核心原则与治理机制，确保代码质量、测试纪律、视觉与体验一致性以及性能目标在整个生命周期内被严格执行。

## 2. Core Principles

以下原则为强制性约束。所有代码、规格说明、计划与任务均必须符合。

### Principle 1: Code Quality（代码质量）

- 代码必须通过静态检查与格式化（含类型检查、lint、格式化）。
- 严格执行代码评审；每个变更必须具备清晰描述、风险说明与验证方式。
- 引入复杂度需有明确收益与替代方案评估；拒绝不必要的聪明代码。
- 公共接口与关键模块必须具备清晰文档与示例；命名需语义化。

Rationale: 高质量代码降低缺陷率与维护成本，提升交付可信度。

### Principle 2: Testing Standards（测试标准）

- 必须提供单元、组件/集成与关键用户路径的端到端测试。
- 设定并维持覆盖率阈值（语句/分支/函数）；低于阈值不得合并。
- 测试必须在 CI 上并行运行并稳定可复现；对易脆测试及时隔离与修复。
- 对缺陷必须先补上失败测试再修复，以防回归。

Rationale: 系统性的测试纪律可持续防止回归，支撑快速迭代。

### Principle 3: Visual Excellence（高标准视觉）

- 界面应现代、克制且统一；遵循统一的色板、间距与排版系统。
- 组件状态（悬浮、聚焦、禁用、加载、错误）必须清晰可辨且一致。
- 图标与插画应分辨率独立、对暗/亮模式具备良好适配。
- 可访问性为必需：对比度、焦点可见性与语义结构必须达标。

Rationale: 精致的一致视觉传达专业与信任，减少认知负担。

### Principle 4: UX Consistency（用户体验一致性）

- 交互模式、术语、导航与反馈机制在全局保持一致。
- 关键流程提供即时、可理解的系统反馈（成功、警告、错误、进度）。
- 表单与错误信息必须可操作且定位明确；空状态提供后续行动指引。
- 任何破坏一致性的变更需给出全局准则更新与迁移计划。

Rationale: 一致的体验降低学习成本，提升效率与满意度。

### Principle 5: Performance（性能）

- 为关键交互定义 SLO，并在 CI/CD 或监测中持续验证。
  - 首屏可交互、关键操作响应、滚动/动画流畅度具备明确目标。
- 在设计与实现阶段进行预算控制（体积、请求、内存、GPU/CPU）。
- 对大型列表、图表与媒体场景采用虚拟化、懒加载与缓存策略。
- 回归监测：性能下降需阻断发布或附带修复计划。

Rationale: 性能直接影响用户留存与转化，是体验质量的硬性指标。

## 3. Governance

### Amendment Process

- 任何对原则或治理的修改需提出变更提案并完成评审。
- 重大修改需记录变更影响与迁移策略，并更新模板与检查清单。

### Versioning

- MAJOR：删除/重定义原则或其他不向后兼容的治理变更。
- MINOR：新增原则或显著扩展指导内容。
- PATCH：表述澄清、措辞与非语义性优化。

### Compliance and Review

- 在合并重要功能与发布前必须进行“宪章一致性检查”。
- 定期（至少每季度）评审一次，评估是否需要修订。
- 发现不符合项需在任务板登记并在最近迭代内整改。