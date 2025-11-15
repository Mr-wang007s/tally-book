# Research: Ledger Analytics (Multi‑platform)

## Decisions and Rationale

### Technology Stack
- Decision: Use React Native with Expo SDK to target Web, iOS, Android
- Rationale: Expo provides unified tooling and deployment workflows across platforms; supports Web via React Native Web
- Alternatives considered: Separate native projects (higher cost), Flutter (not chosen due to team context), pure web (missing native experiences)

### Visual Reference
- Decision: Follow iOS 18 visual language (iOS 26 site used for inspiration only) for clarity, spacing, and motion
- Rationale: Consistent premium feel; aligns with Visual Excellence principle
- Alternatives: Material-like visuals; fully custom design system

### Categories Customization
- Decision: Phase 1 uses default categories only (no create/rename/hide)
- Rationale: Reduce scope; ensures UX consistency and data model stability
- Alternatives: Full customization (deferred), partial rename only

### Data Export
- Decision: Defer CSV/Excel export to a later milestone
- Rationale: Core value is capture + insights; export increases scope and QA surface
- Alternatives: Minimal CSV export; share-only

### Privacy / App Lock
- Decision: Defer local PIN/biometric lock to security milestone
- Rationale: Not essential for initial value; add later with proper UX and policies
- Alternatives: Optional PIN in settings (deferred)

## Patterns & Best Practices
- Expo multi‑platform parity: Prefer platform‑agnostic UI patterns; avoid platform‑specific gestures unless justified
- Accessibility: Ensure contrast, focus, labels; charts have accessible summaries; respect dynamic type
- Performance: Keep initial bundle light; lazy‑load heavy visualizations; memoize derived aggregates and trends
- Testing discipline: Unit tests for calculations; scenario tests for flows; smoke E2E across three platforms in CI

## Open Questions (Resolved)
- None; all current NEEDS CLARIFICATION items are resolved per decisions above
