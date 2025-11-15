# Feature Specification: Personal Expense/Income & Analytics

## 1. Requirements

### 1.1 Feature Summary
A personal bookkeeping feature enabling users to manually record expenses and incomes and view summaries with trend analysis.

### 1.2 In-Scope
- Record transactions
  - Create, edit, delete a transaction
  - Fields: type (expense | income), amount, date/time, category, notes (optional)
- View history
  - List with filters: date range, type, category, min/max amount, keyword (notes)
  - Sort by date (desc by default) and amount
- Summary & analytics
  - Period totals: daily, weekly, monthly, yearly
  - Category breakdown (share and amount)
  - Trend over time (e.g., daily/weekly/monthly line chart)
  - Net balance over selected period
- Data persistence across app restarts
- Basic privacy: data visible only to the owner on the same device/account

### 1.3 Out of Scope (for this feature)
- Budgeting, alerts, goals
- Multi-user sharing
- Advanced export/import formats
- Integrations with banks/payment providers

### 1.4 Non-Functional Requirements
- Usability: new users can add their first transaction within 30 seconds without guidance
- Accessibility: color-safe visuals, meaningful labels/hints, keyboard navigation where applicable
- Performance: history list loads within 1 second for 5,000 records; filters apply within 1 second
- Reliability: no data loss during normal usage; edits and deletes are atomic from user perspective
- Localization readiness: copy and formats designed to be localizable
- Data retention: data retained unless explicitly deleted by user

### 1.5 Assumptions
- Single-account usage per device/session
- Reasonable default categories provided if user does not customize
- Timezone uses device/account settings for date grouping

### 1.6 Constraints
- Only manually entered transactions (no auto-import in this scope)
- Analytics computed over transactions available to the user within selected range

### 1.7 Actors
- End User: records transactions, views history, reads summaries and trends

### 1.8 User Scenarios & Testing
- Add expense: user enters amount, selects category/date, optionally notes; transaction appears in history and affects summaries immediately
- Add income: similar to expense; impacts net balance and trends
- Edit transaction: change amount/category/date; summaries and lists reflect changes
- Delete transaction: item removed; summaries and trends update accordingly
- Filter and analyze: user sets a date range (e.g., last 30 days) to view totals, category breakdown, and trend over time

### 1.9 Functional Requirements (Testable)
FR-01 Create transaction
- User can create expense or income with required fields (type, amount, date) and optional fields (category, notes)
- Acceptance: after save, transaction is visible in history with accurate values

FR-02 Edit transaction
- User can modify any field of an existing transaction
- Acceptance: updates reflect in history, summaries, and trends without stale values

FR-03 Delete transaction
- User can delete a transaction with a confirmation step
- Acceptance: item no longer appears in history; summaries recalculate accordingly

FR-04 List & filter
- User can view a paginated list and filter by date range, type, category, amount range, and keyword in notes
- Acceptance: applying filters only changes the result set; clearing filters restores defaults

FR-05 Sort
- User can sort by date (default desc) and amount
- Acceptance: sorting changes the order without altering the set of results

FR-06 Summary totals
- System provides totals for selected period (daily/weekly/monthly/yearly) and net balance
- Acceptance: totals equal the sum of included transactions under current filters

FR-07 Category breakdown
- System provides category distribution (amount and percentage) for the selected period
- Acceptance: sum of category amounts equals total expense (and/or income) for the period

FR-08 Trend over time
- System provides a time series of totals by chosen granularity within the date range
- Acceptance: each point equals the sum of transactions in its interval; no gaps when intervals exist

FR-09 Data persistence
- Transactions persist across app restarts
- Acceptance: after closing and reopening, previously saved data remains

FR-10 Basic privacy
- Only the current user can view and manage their transactions
- Acceptance: no cross-user leakage under normal usage

### 1.10 Success Criteria (Measurable, Tech‑Agnostic)
- SC-01 Onboarding speed: 90% of first-time users can add a transaction within 30 seconds
- SC-02 Query responsiveness: 95% of list loads and filter actions complete within 1 second for up to 5,000 records
- SC-03 Accuracy: 100% of summaries reflect underlying transactions given the same filters
- SC-04 Task completion: 95% of users can locate month total and top 3 categories without assistance
- SC-05 Reliability: 0 critical data-loss defects in acceptance and release testing

### 1.11 Edge Cases
- Zero or negative amounts: disallow negative; zero amount rejected with clear message
- Future dates: allowed but visually indicated; included in analytics if in range
- Missing category: allowed; grouped into “Uncategorized” in breakdown
- Large notes: truncated in lists; full content available in detail view
- Duplicate transactions: allowed; deduplication is not in scope

### 1.12 Clarifications Resolved
- Categories: 内置分类为主，暂不支持用户自定义分类（后续可扩展）；视觉统一
- Currency: 单一币种（跟随设备/账户设置）；无汇率换算
- Data scope: 本地存储，仅当前设备可见与可用；不涉及跨设备同步

## 2. Design

Note: This section focuses on product/experience design and observable behavior; it avoids implementation details.

### 2.1 Information Architecture
- Primary tabs/sections: Record, History, Analytics
- Record: quick entry with numeric keypad, recent categories, and last-used date defaults
- History: searchable/filterable list with inline summary of the current filter window
- Analytics: period totals, category breakdown, and trend visualization with consistent legends and units

### 2.2 Interaction Flows
- Add Flow: open Record → enter amount → pick type → choose category/date → save → confirmation feedback → History updated
- Edit Flow: open item detail from History → edit fields → save → History and Analytics refresh
- Filter Flow: open filter panel → set date range/type/category/amount range → apply → results and summaries update

### 2.3 Validation Rules (observable)
- Amount must be > 0 and ≤ maximum allowed per transaction [assume 1,000,000]
- Date must be a valid calendar date; default to “today” when unspecified
- Notes optional; length up to 500 characters; safe characters displayed as-is

### 2.4 Error/Empty States
- No transactions: show helpful prompt to add the first one and quick tips
- No results after filters: clear message with option to reset filters
- Save failures: preserve user input and show actionable guidance to retry

### 2.5 Security & Privacy (product-level)
- User data is private to the user of the device/account
- Clear delete confirmation; deleted data not shown in UI after confirmation

## 3. Constitution Alignment
- Cross-Platform First: Feature behavior and visuals remain consistent across target platforms
- User-Centric Design: Quick entry, simple filters, clear summaries, and accessible UI
- Polished Aesthetics: Clean, modern visuals and consistent, readable charts and lists
- Comprehensive Test Coverage: Unit-level calculations, component behaviors, and critical end-to-end flows covered; executed in continuous testing
