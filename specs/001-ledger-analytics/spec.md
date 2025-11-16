# Feature Specification: Ledger Analytics (Multi‑platform)

## 1. Requirements

### Overview
- A personal ledger app that allows users to record income and expenses and view spending trends.
- The feature must be available consistently on Web, iOS, and Android.

### In‑Scope
- Record transactions: income and expense with amount, date, category, note, and payment method.
- View summaries: total income, total expense, and balance for selected periods.
- View spending trends: by time (daily/weekly/monthly), by category, and overall.
- Basic categorization: default categories for income and expense; users can assign categories per transaction.
- Multi‑platform parity: functional and UX consistency across Web, iOS, Android.
- Home dashboard: centralized overview screen showing balance, recent transactions, quick insights, and spending breakdown.
- Haptic feedback: tactile feedback for button presses, swipe gestures, form interactions, and navigation events.

### Out‑of‑Scope (for this feature)
- User authentication and multi‑device account sync.
- Budgets, goals, and alerts.
- Attachments (photos/receipts) and OCR.
- Multi‑currency conversion.

### Actors
- End User: creates and reviews their own personal transactions and trends.

### User Scenarios & Testing
- Scenario 1: Create expense
  - Given the user opens Add Transaction
  - When they enter amount, choose expense, select category, date, and save
  - Then the transaction appears in list and summaries update accordingly
- Scenario 2: View monthly summary
  - Given transactions exist in current month
  - When the user opens the Summary for current month
  - Then total income, expense, and balance are shown correctly
- Scenario 3: View spending trend by category
  - Given multiple expenses across categories over the last 3 months
  - When the user opens Trends and selects "By Category"
  - Then a breakdown shows share per category and allows switching time ranges
- Scenario 4: Edit transaction
  - Given an existing transaction
  - When the user edits amount/category/date and saves
  - Then summaries and trends reflect the updated values
- Scenario 5: Delete transaction
  - Given an existing transaction
  - When the user deletes it and confirms
  - Then it is removed from lists and aggregates recalculate
- Scenario 6: View home dashboard
  - Given the user opens the app
  - When they navigate to the Home tab
  - Then they see current balance, last 5 transactions, top spending category, and spending breakdown

### Functional Requirements
- FR1 Transaction creation: Users MUST create expense or income with fields: type, amount (positive), date, category, note (optional), payment method (optional).
- FR2 Transaction listing: Users MUST view transactions sorted by date with filter by period (month/week/custom).
- FR3 Summaries: System MUST compute totals for income, expense, and balance per selected period.
- FR4 Trends by time: System MUST show trend of expense over time with selectable granularity (day/week/month).
- FR5 Trends by category: System MUST show expense distribution by category for a selected period.
- FR6 Edit/Delete: Users MUST be able to edit or delete a transaction; aggregates MUST update immediately.
- FR7 Categories: System MUST provide a default set of categories for income and expense; users MUST be able to assign categories per transaction.
- FR8 Data validation: Amount MUST be > 0; date MUST be valid and within reasonable bounds; category MUST be required.
- FR9 Multi‑platform parity: The above capabilities MUST be available with consistent behavior on Web, iOS, and Android.
- FR10 Home Dashboard: System MUST provide a Home tab displaying current balance, recent transactions (last 5), quick insights (top spending category, savings rate), and spending breakdown (top 4 categories).
- FR11 Haptic Feedback: System MUST provide haptic feedback on all platforms (Web, iOS, Android) using identical feedback patterns for button presses, swipe gestures, form validation errors, and navigation events.
- FR12 Theme System: System MUST support light and dark color modes with true black background (#000000) for dark mode; automatically detect and apply system theme preference; allow users to override theme preference in settings.
- FR13 Language Support: System MUST support Chinese (中文) as the primary UI language; all form labels, buttons, messages, and transaction categories MUST be in Chinese.
- FR14 Post-Add Navigation: After successfully adding a transaction, system MUST navigate user to the Transactions list showing the newly created transaction.

### Non‑Functional Requirements
- NFR1 Usability: Flows for add/edit/delete MUST be completable in under 15 seconds by a first‑time user.
- NFR2 Reliability: All aggregates and trends MUST be accurate within 100% of computed totals; edits/deletes MUST reflect within the current view.
- NFR3 Accessibility: Visual elements MUST meet contrast and focus visibility standards; charts MUST provide readable legends/labels; non-essential animations MUST be disabled when reduced motion preference is enabled.
- NFR4 Performance: Primary screens (list, summary, trends, home) SHOULD render visible content within 1.5 seconds for typical datasets (<= 5,000 transactions) and interactions respond within 150 ms perceived latency.
- NFR5 Consistency: Terminology, navigation, empty states, and error messages MUST be consistent across platforms.
- NFR6 Haptic Consistency: Haptic feedback patterns MUST be consistent across Web, iOS, and Android platforms using standardized intensity levels (light, medium, heavy) and notification types (success, warning, error).
- NFR7 Motion Accessibility: System MUST respect user's reduced motion preference (prefers-reduced-motion media query on web, UIAccessibility.isReduceMotionEnabled on iOS, AccessibilityManager on Android); non-essential animations MUST be disabled with instant static transitions shown instead.

### Assumptions
- Default currency is the device/locale currency; currency symbol formatting follows locale.
- Data persists locally to the device; no account login or cross‑device sync in this feature.
- Trend time ranges: last 7 days, last 30 days, current month, last 3 months, custom range.
- Haptic feedback uses browser Vibration API on web, expo-haptics on native platforms.
- Dark mode uses true black (#000000) for OLED optimization; automatically follows system preference with user override available in settings.
- Theme preference persists to local storage for cross-session consistency.

### Success Criteria
- SC1 Users complete a first expense entry in ≤ 30 seconds without help.
- SC2 Monthly summary totals equal the sum of underlying transactions for the period (100% match).
- SC3 Trends view switches granularity or range and updates in ≤ 1.0 second for ≤ 5,000 transactions.
- SC4 95% of users can locate "Add Transaction" and "Trends" within 3 clicks/taps.
- SC5 Terminology and behaviors are consistent across Web, iOS, Android in primary flows (add, list, summary, trends).
- SC6 Home dashboard loads within 1.0 second and displays current balance accurately.

### Edge Cases
- EC1 Editing a transaction to change type (income⇄expense) updates all aggregates correctly.
- EC2 Deleting the only transaction in a period shows empty states with guidance.
- EC3 Very small/large amounts display with correct locale formatting and precision.
- EC4 Multiple transactions on the same timestamp remain stably ordered (deterministic tie‑break).
- EC5 Category deleted or renamed (future feature) does not break trends; shows fallback labeling.
- EC6 Haptic feedback fails gracefully on platforms/browsers without vibration support (no error, silent fallback).
- EC7 Reduced motion preference enabled: all spring animations, stagger delays, and entrance animations are replaced with instant static transitions; skeleton loaders and essential feedback remain visible.

### Decisions from Research
- Categories customization: Use default categories only in this phase; no create/rename/hide.
- Data export: Defer CSV/Excel export to later milestone.
- Privacy/app lock: Defer local PIN/biometric lock to security milestone.

## 2. Design

### Information Architecture
- Tabs/sections: Home, Transactions, Summary, Trends.
- Filters: period selectors available across relevant views; category filters in Transactions and Trends.

### User Experience (WHAT, not HOW)
- Input forms provide clear, inline validation and actionable error messages.
- Trend visualizations present clear labeling and legends; users can switch granularity and ranges.
- Empty states explain how to add transactions and provide quick actions.
- Destructive actions require confirmation with clear consequences.
- Home dashboard provides at-a-glance financial overview with quick access to key features.
- Haptic feedback provides tactile confirmation for key user actions and state changes.
- Module/component organization MUST be restructured using shadcn + tailwind for improved layout clarity, spacing consistency, and component hierarchy.
- Forms and dialogs MUST use shadcn components (Input, Select, Button, Dialog, etc.) with tailwind utilities for consistent visual language.
- Transaction list, summary cards, and trend cards MUST use unified shadcn card layout with consistent padding, borders, and hover states.
- Navigation transitions MUST be smooth and provide visual feedback; tab switching SHOULD NOT cause layout shifts.

### Data & Entities (Conceptual)
- Transaction: id, type (income/expense), amount, date, categoryId, note?, paymentMethod?
- Category: id, name, type (income/expense), isDefault
- Summary: period, totalIncome, totalExpense, balance
- TrendPoint: periodKey, expenseTotal

### Acceptance Testing Approach (Black‑box)
- Verify creation/edit/delete flows update lists and aggregates instantly.
- Verify trend calculations match sums from underlying transactions.
- Verify filters affect lists, summaries, and trends consistently.
- Verify accessibility basics: focus order, labels, contrast.
- Verify cross‑platform parity by executing the same flows across Web, iOS, Android with consistent outcomes.
- Verify home dashboard aggregates (balance, recent transactions, insights) match underlying data.
- Verify haptic feedback triggers on all supported platforms for defined interaction patterns.

## 3. Constitution Alignment
This specification MUST adhere to the following updated principles:
- Code Quality: Use clear naming and documented public behaviors; avoid unnecessary complexity.
- Testing Standards: Define unit tests for calculations and validation; scenario tests for flows; coverage thresholds enforced by CI.
- Visual Excellence: Consistent design tokens for spacing/typography/colors; clear states; accessible contrast.
- UX Consistency: Shared terminology (Income, Expense, Balance, Trends); consistent navigation and feedback patterns.
- Performance: Meet screen load and interaction SLOs; avoid regressions in aggregates/trends calculations.

### Chart Implementation Strategy
- Trends screen: Use Skia-based GPU-accelerated charts for animated time-series and category distributions.
- Dashboard & Summary: Use existing lightweight chart components for static/simple visualizations.
- Rationale: Skia adds ~500KB bundle size; selective use optimizes performance vs. bundle trade-off.

## Clarifications

### Session 2025-11-16
- Q: How should the home dashboard integrate with existing navigation (Transactions, Summary, Trends tabs)? → A: Home dashboard is an additional 4th tab alongside Transactions, Summary, and Trends
- Q: How should haptic feedback behave across different platforms (Web, iOS, Android)? → A: Haptic feedback on all platforms using identical patterns
- Q: How should Skia-based charts be deployed across the app? → A: Use Skia only for trends/analytics screens with animations; keep existing charts for simpler dashboard/summary widgets
- Q: How should animations respect accessibility needs (reduced motion)? → A: Respect reduced motion preferences by disabling all non-essential animations; show static content instead with instant transitions
- Q: What is the dark mode strategy for the app? → A: True black dark mode (#000000) with automatic system detection + manual override in settings
- Q: What is the required language support for the app? → A: Chinese (中文) only
- Q: After adding a transaction, where should the user navigate to? → A: Return to Transactions list
- Q: What are the priority UX/interaction improvements for shadcn+tailwind optimization? → A: Overall module layout and component organization restructuring (rather than isolated micro-interactions)
