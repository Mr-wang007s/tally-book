# Project Plan for My Tally Book

## 1. Overview
本计划围绕“个人记账（手动输入支出/收入 + 汇总分析趋势）”特性推进实现路线，参考苹果当前 iOS 视觉（以 https://www.apple.com/hk/os/ios/ 为准的当期风格与HIG方向），同时保持在 Web / iOS / Android 跨端一致的体验与交互。遵循宪章的跨端一致、以用户为中心、视觉精致、全面测试覆盖四大原则。

## 2. Goals
- G1 记录：支持支出/收入的快速录入、编辑、删除，具备可用的默认分类与日期
- G2 历史：可筛选/排序的历史列表，支持关键过滤器（时间、类型、分类、金额范围、关键词）
- G3 分析：周期合计、分类占比、趋势曲线、净余额
- G4 一致性与美观：遵循 iOS 当期视觉范式，同时对 Web/Android 做一致化样式与交互适配
- G5 质量：建立充分的单元/组件/关键E2E覆盖，纳入持续集成

## 3. Constitution Check
- Cross-Platform First：统一规格，由同一套信息架构与交互流程驱动三端；在必要处做平台级微调且不破坏一致性
- User-Centric Design：首次记一笔≤30秒；核心路径步骤清晰（录入→确认→历史/分析刷新）
- Polished Aesthetics：采用当前 iOS 视觉语言的层次、留白、色彩与排版；Web/Android 同样保持高质感
- Comprehensive Test Coverage：为计算与关键流程提供单元/组件/E2E自动化，并纳入CI

Gate Evaluation
- 视觉基线：以苹果当前 iOS 页面所代表的当期视觉语言与 HIG 原则为基线，不做版本号绑定
- 跨端一致：确保信息架构一致，平台差异（如系统默认控件）不影响主要路径与认知一致
- 测试：为录入、编辑、删除、筛选、汇总、趋势等关键路径建立可运行的测试套件
→ Gate 状态：PASS（无未解释的违背项）

Phase 0: Outline & Research（输出 research.md）
- 明确“当期 iOS 视觉”采用原则与跨端适配策略
- 确认数据模型边界与校验（金额、日期、分类）
- 确认分析口径（周期、分类占比、趋势颗粒度）

Phase 1: Design & Contracts（输出 data-model.md、contracts/openapi.yaml、quickstart.md）
- 数据模型：事务、分类、汇总点等实体
- 合同：交易CRUD、统计汇总、趋势数据接口（REST风格OpenAPI）
- Quickstart：核心操作与验收路径说明

Post-Design Constitution Check
- 复核四项原则的落地与测试覆盖计划，维持 Gate = PASS
