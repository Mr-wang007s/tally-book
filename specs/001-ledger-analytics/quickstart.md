# Quickstart: Ledger Analytics (Multi‑platform)

This plan targets Web, iOS, and Android using React Native with Expo SDK.

## Development Commands

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

## Key Flows

### Adding a Transaction
1. Navigate to Transactions tab
2. Tap the floating + button
3. Select Income or Expense type
4. Enter amount, date, and select category
5. Optionally add note and payment method
6. Tap "Save Transaction"

### Viewing Summary
1. Navigate to Summary tab
2. Use period filter to select Month, Week, or Last 30 Days
3. View income, expense, and balance cards
4. Summary updates instantly when period changes

### Analyzing Trends
1. Navigate to Trends tab
2. Select granularity (Day, Week, Month)
3. View expense trends over time chart
4. Scroll down to see category breakdown

### Editing/Deleting Transactions
1. From Transactions list, tap any transaction
2. Modify fields as needed
3. Tap "Save Changes" to update or "Delete Transaction" to remove

## Implementation Status

✅ **Phase 1**: Project setup, TypeScript, ESLint, design tokens
✅ **Phase 2**: Data models, storage, aggregates, validation
✅ **Phase 3**: Transaction recording with form validation
✅ **Phase 4**: Financial summaries with period filtering
✅ **Phase 5**: Spending trends with time-series and category charts
✅ **Phase 6**: Edit and delete transaction functionality
✅ **Phase 7**: Accessibility, performance SLOs, visual polish

## Next Steps (Future Enhancements)
- Add unit and E2E tests
- Implement custom category creation
- Add CSV/Excel export functionality
- Add local PIN/biometric authentication
- Implement cross-device sync
