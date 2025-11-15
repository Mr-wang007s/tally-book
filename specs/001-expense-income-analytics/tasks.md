# Task Breakdown for Personal Expense/Income & Analytics

This document breaks down the work required for a specific feature or milestone, in alignment with the project's core principles.

## Task Categories

- **Core-Dev**: Core feature development tasks.
- **UI/UX**: Tasks related to user interface and experience design and implementation.
- **Cross-Platform**: Tasks focused on ensuring consistency and performance across Web, iOS, and Android.
- **Testing**: Unit, component, and E2E test implementation; CI integration; coverage improvements.
- **Docs**: Documentation-related tasks.

---

## Phase 1: Setup
- [x] T001 Create feature directories in /data/workspace/my-tally-book/specs/001-expense-income-analytics
- [x] T002 Add initial README in /data/workspace/my-tally-book/specs/001-expense-income-analytics/README.md
- [x] T003 [P] Add default categories seed file in /data/workspace/my-tally-book/specs/001-expense-income-analytics/seeds/categories.json

## Phase 2: Foundational
- [x] T004 Establish data validation rules doc in /data/workspace/my-tally-book/specs/001-expense-income-analytics/validation.md
- [x] T005 Define i18n copy doc in /data/workspace/my-tally-book/specs/001-expense-income-analytics/i18n.md
- [x] T006 [P] Prepare design tokens doc (spacing, color, type) in /data/workspace/my-tally-book/specs/001-expense-income-analytics/design-tokens.md

## Phase 3: User Stories (Priority Order)

### US1: 快速录入交易（P1）
Goal: 用户可以在30秒内完成一笔支出/收入记录

Independent Test Criteria:
- 成功在30秒内完成录入
- 保存后历史列表立即出现新条目

Tasks:
- [ ] T007 [US1] Draft UI flow for record screen in /data/workspace/my-tally-book/specs/001-expense-income-analytics/ui/record-flow.md
- [ ] T008 [P] [US1] Map Transaction fields to form in /data/workspace/my-tally-book/specs/001-expense-income-analytics/ui/record-form.md
- [ ] T009 [US1] Define default category set in /data/workspace/my-tally-book/specs/001-expense-income-analytics/seeds/categories.json
- [ ] T010 [US1] Define error/empty states for record in /data/workspace/my-tally-book/specs/001-expense-income-analytics/ui/record-states.md

### US2: 历史列表筛选与排序（P1）
Goal: 用户可以按时间/类型/分类/金额/关键词筛选并按日期/金额排序

Independent Test Criteria:
- 筛选与排序均在1秒内完成（≤5,000条）
- 清除筛选恢复默认

Tasks:
- [ ] T011 [US2] Define filter parameters list in /data/workspace/my-tally-book/specs/001-expense-income-analytics/ui/history-filters.md
- [ ] T012 [P] [US2] Define sorting modes in /data/workspace/my-tally-book/specs/001-expense-income-analytics/ui/history-sorting.md
- [ ] T013 [US2] Define pagination behavior in /data/workspace/my-tally-book/specs/001-expense-income-analytics/ui/history-pagination.md

### US3: 汇总与趋势（P1）
Goal: 提供周期合计、分类占比、趋势曲线、净余额

Independent Test Criteria:
- 选定范围内合计与明细一致
- 空区间显示0而非缺口

Tasks:
- [ ] T014 [US3] Specify period summary logic in /data/workspace/my-tally-book/specs/001-expense-income-analytics/logic/period-summary.md
- [ ] T015 [P] [US3] Specify category breakdown logic in /data/workspace/my-tally-book/specs/001-expense-income-analytics/logic/category-breakdown.md
- [ ] T016 [US3] Specify trend granularity handling in /data/workspace/my-tally-book/specs/001-expense-income-analytics/logic/trend-granularity.md

---

## Final Phase: Polish & Cross-Cutting
- [ ] T017 Define accessibility checklist in /data/workspace/my-tally-book/specs/001-expense-income-analytics/checklists/a11y.md
- [ ] T018 [P] Define performance checklist in /data/workspace/my-tally-book/specs/001-expense-income-analytics/checklists/perf.md
- [ ] T019 Define analytics acceptance tests list in /data/workspace/my-tally-book/specs/001-expense-income-analytics/checklists/acceptance.md

## Dependencies
- US1 → US2 → US3（录入数据后才有历史/分析的价值）。

## Parallel Execution Examples
- 并行1：T003、T006 可并行（不同文件，互不依赖）
- 并行2：在 US2 中，T011 与 T012 可并行
- 并行3：在 US3 中，T015 可先于 T016 并行产出

## Implementation Strategy
- 先交付 MVP：完成 US1（快速录入）
- 增量扩展：US2（历史筛选/排序）→ US3（汇总与趋势）

