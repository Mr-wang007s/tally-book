# Research: Personal Expense/Income & Analytics (Cross-Platform + iOS Visual)

## R-01 iOS 视觉参照与跨端一致
- Decision: 采用苹果官网当前 iOS 页面所体现的当期视觉语言与 HIG 原则（层次、留白、动态、色彩、圆角与阴影的节制）作为视觉基线；不强绑定具体“版本号”。
- Rationale: URL 指向的是 iOS 官方当前站点，随时间更新；绑定版本号会引入不必要限制。
- Alternatives considered: 固定至特定 iOS 版本视觉（可读性差、过时风险高）；完全自有设计体系（与用户期望偏差）。

## R-02 跨端一致性策略（Web / iOS / Android）
- Decision: 保持信息架构与交互流程一致；控件视觉遵循基线，同时对平台默认UI差异做适配，不改变主要路径与文案。
- Rationale: 降低学习成本；保持品牌一致；减少平台碎片化。
- Alternatives considered: 平台完全分治（成本高且一致性差）；严格像素一致（牺牲原生期望）。

## R-03 分析与口径
- Decision: 提供周期（天/周/月/年）合计、分类占比、趋势曲线与净余额；颗粒度与时间范围由筛选器决定，空区间显示0而非缺口。
- Rationale: 覆盖多数记账分析核心诉求；结果可验证且口径清晰。
- Alternatives considered: 仅总览无趋势（洞察不足）；仅趋势无分类（可解释性弱）。

## R-04 分类/币种/数据范围（来自已确认澄清）
- Decision: 内置分类、单一币种（随设备/账户设置）、本地存储单设备可见。
- Rationale: 最小可行范围；降低复杂度与合规成本。
- Alternatives considered: 自定义分类/多币种/跨端同步（功能强但复杂度与成本显著提高）。

## R-05 可测试性与度量
- Decision: 面向关键路径（录入、编辑、删除、筛选、合计、趋势）设计可自动化的断言与数据工厂；构建产品级成功标准（30秒首次记一笔、1秒内列表与筛选响应、0关键数据丢失）。
- Rationale: 与宪章“全面测试覆盖”一致；加速安全迭代。
- Alternatives considered: 仅探索性测试（回归风险高）。
