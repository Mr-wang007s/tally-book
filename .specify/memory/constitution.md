<!--
SYNC IMPACT REPORT
- Version: 1.0.0 -> 1.1.0
- Modified Principles: None
- Added Sections:
  - Principle 4: Comprehensive Test Coverage
- Removed Sections: None
- Templates Requiring Updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ⚠ .specify/templates/checklist-template.md (no change required, reference only)
- Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Determine the project's official start date.
-->

# My Tally Book Constitution

**VERSION**: `1.1.0`
**RATIFICATION_DATE**: `TODO(RATIFICATION_DATE): Determine the project's official start date.`
**LAST_AMENDED_DATE**: `2025-11-15`

## 1. Overview

This document outlines the core principles and governance for the `My Tally Book` project. Its purpose is to ensure alignment, consistency, and quality across all development efforts.

## 2. Core Principles

These principles are the foundational rules for the project. All code, specifications, and plans MUST adhere to them.

### Principle 1: Cross-Platform First

The application MUST be built using React Native and Expo to ensure it runs on Web, iOS, and Android from a single codebase. User experience and functionality MUST be consistent across all platforms.

**Rationale**: To maximize reach and minimize development overhead by maintaining a unified codebase for all target platforms.

### Principle 2: User-Centric Design

The application's interface and interaction flow MUST be intuitive, simple, and easy to use. Every feature MUST be designed with the end-user's convenience in mind.

**Rationale**: To ensure high user adoption and satisfaction by creating a frictionless and enjoyable accounting experience.

### Principle 3: Polished Aesthetics

The application's visual design MUST be beautiful, modern, and clean, drawing inspiration from Apple's iOS design guidelines to create a premium look and feel.

**Rationale**: A high-quality visual presentation enhances user perception of the app's quality and trustworthiness, making it more engaging.

### Principle 4: Comprehensive Test Coverage

All features MUST include automated tests (unit, component, and critical end-to-end flows) with agreed coverage thresholds. Tests MUST run in CI for Web, iOS, and Android targets.

**Rationale**: Strong test coverage ensures reliability, prevents regressions across platforms, and accelerates safe iteration.

## 3. Governance

### Amendment Process

Amendments to this constitution require a proposal and review. The version MUST be updated according to semantic versioning.

### Versioning

- **MAJOR**: Backward-incompatible changes to governance or removal/redefinition of principles.
- **MINOR**: New principle or material expansion of guidance.
- **PATCH**: Clarifications, wording, or non-semantic refinements.

### Compliance and Review

- All artifacts (code, plans, specs, tasks) MUST comply with the principles.
- A constitution alignment check MUST occur before merging significant features and before release.
- A periodic review SHOULD occur at least once per quarter to consider amendments.
