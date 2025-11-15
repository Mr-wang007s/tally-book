# My Tally Book

A multi-platform personal finance tracker built with React Native and Expo, targeting Web, iOS, and Android.

## Features

- **Record Transactions**: Track income and expenses with detailed categorization
- **Financial Summaries**: View total income, expenses, and balance for custom periods
- **Spending Trends**: Analyze spending patterns over time with interactive charts
- **Category Analytics**: Break down expenses by category to understand spending habits
- **Edit & Delete**: Manage transactions with full edit and delete capabilities

## Tech Stack

- **Framework**: React Native with Expo SDK
- **Language**: TypeScript
- **Storage**: AsyncStorage for local persistence
- **Navigation**: Expo Router (file-based routing)
- **Design**: iOS-inspired visual language with design tokens

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- For iOS: macOS with Xcode
- For Android: Android Studio with emulator
- For Web: Modern browser

### Installation

```bash
npm install
```

### Running the App

```bash
# Start development server
npm start

# Run on specific platform
npm run web      # Run in browser
npm run ios      # Run on iOS simulator (macOS only)
npm run android  # Run on Android emulator
```

### Code Quality

```bash
npm run lint       # Run ESLint
npm run format     # Run Prettier
npm run type-check # Run TypeScript compiler check
```

## Project Structure

```
my-tally-book/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   ├── transactions/      # Transaction management
│   ├── summary/           # Financial summary
│   └── trends/            # Spending trends
├── src/
│   ├── models/            # Data models (Transaction, Category, etc.)
│   ├── services/          # Business logic (aggregates, validation, etc.)
│   ├── storage/           # Persistence layer
│   ├── components/        # Reusable UI components
│   ├── theme/             # Design tokens (colors, typography, spacing)
│   └── constants/         # App constants (performance SLOs, etc.)
├── specs/                 # Feature specifications
└── .specify/              # Project templates and workflows
```

## Terminology

- **Transaction**: A single financial record (income or expense)
- **Category**: A classification for transactions (e.g., Food, Salary)
- **Period**: A date range for filtering and aggregating data
- **Summary**: Aggregated financial totals for a period
- **Trend**: Time-series data showing changes over time
- **Granularity**: Time interval for trend analysis (day, week, month)

## UX Patterns

### Navigation
- Bottom tabs for primary sections (Transactions, Summary, Trends)
- Stack navigation within sections for detail views
- Floating Action Button (FAB) for quick transaction creation

### Visual Feedback
- Color coding: Green for income, Red for expenses, Blue for balance
- Loading states with activity indicators
- Empty states with actionable guidance
- Success/error alerts for user actions

### Data Entry
- Type toggle for income/expense selection
- Category chips for quick selection
- Date picker for transaction dates
- Validation with inline error messages

### Accessibility
- Semantic labels for screen readers
- High contrast colors meeting WCAG standards
- Focus indicators for keyboard navigation
- Descriptive button labels and hints

## Performance SLOs

- Screen interactive time: ≤ 1.5s for up to 5,000 transactions
- User interaction response: ≤ 150ms
- Chart/aggregation updates: ≤ 1s for granularity changes
- Target frame rate: 60 FPS for scrolling

## License

Private project - All rights reserved

## Contributing

This is a personal project. Feature specifications and planning workflows are available in the `specs/` directory.

For development workflows and tooling, see `.specify/` templates.
