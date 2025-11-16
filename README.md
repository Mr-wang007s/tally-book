# My Tally Book

A multi-platform personal finance tracker built with React Native and Expo, targeting Web, iOS, and Android.

## Features

- **Record Transactions**: Track income and expenses with detailed categorization
- **Financial Summaries**: View total income, expenses, and balance for custom periods
- **Spending Trends**: Analyze spending patterns over time with interactive charts
- **Category Analytics**: Break down expenses by category to understand spending habits
- **Edit & Delete**: Manage transactions with full edit and delete capabilities
- **Multi-language Support**: Chinese (zh-CN) and English localization with automatic device locale detection

## Tech Stack

- **Framework**: React Native with Expo SDK
- **Language**: TypeScript
- **Storage**: AsyncStorage for local persistence
- **Navigation**: Expo Router (file-based routing)
- **Internationalization**: i18next with react-i18next and react-native-localize
- **Design**: iOS-inspired visual language with design tokens (shadcn-inspired components)

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

## Language Support

The app supports **Chinese (zh-CN)** as the primary language with **English (en)** fallback. Language is automatically detected from device settings using `react-native-localize`.

### Available Languages

- **中文 (Chinese)**: Default language with full coverage
- **English**: Complete fallback translation

### Changing Language in Development

To test different languages during development, modify your device/emulator language settings, or use the language switcher in app settings (if implemented).

### Translation Structure

Translations are organized by feature namespace:
- `common`: Shared UI elements (OK, Cancel, Save, etc.)
- `transactions`: Transaction-related screens and forms
- `home`: Home dashboard content
- `summary`: Financial summary screens
- `trends`: Trend analysis screens
- `categories`: Category management
- `messages`: Success/error messages

Translation files are located in `src/i18n/locales/` and use the type-safe `useTranslation()` hook for autocomplete and validation.

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
│   ├── components/        # Reusable UI components (feature-based organization)
│   │   ├── ui/           # Design system primitives (Button, Input, Card, etc.)
│   │   ├── forms/        # Form components and validation
│   │   ├── surfaces/     # Layout and container components
│   │   ├── charts/       # Data visualization
│   │   ├── animations/   # Animation wrappers
│   │   ├── layouts/      # Screen-level layouts
│   │   └── screens/      # Full-screen feature components
│   ├── i18n/             # Internationalization configuration and translations
│   │   ├── config.ts     # i18next configuration with locale detection
│   │   ├── locales/      # Translation files (zh-CN.json, en.json)
│   │   └── useTranslation.ts  # Type-safe translation hook
│   ├── tokens/           # Design tokens (colors, typography, spacing, elevation, animations)
│   ├── contracts/        # TypeScript type definitions for navigation and i18n
│   ├── theme/            # Theme provider and context
│   └── constants/        # App constants (performance SLOs, etc.)
├── specs/                # Feature specifications
└── .specify/             # Project templates and workflows
```

## Component Organization

Components follow a **feature-based structure** inspired by shadcn design patterns:

- **ui/**: Reusable primitives that can be copied and customized
- **forms/**: Form-specific components with unified validation
- **surfaces/**: Layout containers and cards
- **charts/**: Data visualization components
- **animations/**: Animation wrappers and transitions
- **layouts/**: Screen-level layout components
- **screens/**: Full-screen components for each feature

See `src/components/README.md` for detailed component patterns and usage guidelines.

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
