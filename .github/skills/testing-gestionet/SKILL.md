---
name: testing-gestionet
user-invocable: true
description: "Workflow de testing real para Grupo Gestionet. Use when: ejecutar testing E2E en Docker, investigar fallos Playwright, validar UI-API-BBDD, estabilizar tests flaky, generar reporte QA con evidencias y riesgos. Keywords: testing real, qa, playwright, docker compose, e2e, regresion, badge, quiz, gestionet"
---

# Testing Gestionet (Real-World QA Skill)

## Purpose

Use this skill to run, debug, and report end-to-end testing in a reproducible environment for Grupo Gestionet.

Primary goals:
- Run tests in isolated containers.
- Detect and explain root causes quickly.
- Fix regressions with minimal code changes.
- Produce QA evidence and actionable summaries.

## Scope

Use when the user asks to:
- run real testing in company-like conditions
- validate E2E flows and business rules
- investigate failing or flaky Playwright tests
- verify consistency between UI, API, and SQLite data
- prepare release-readiness testing reports

Do not use for:
- broad architecture redesign not tied to tests
- non-testing feature implementation without a QA objective

## Repo Conventions

Expected project context:
- App service via Docker Compose
- Playwright tests in demo-playwright/tests
- Backend logic in demo-playwright/server.js
- Database layer in demo-playwright/db/database.js
- Playwright config in demo-playwright/playwright.config.js

## Standard Workflow

### 1. Baseline and Environment

1. Validate compose config:
   - docker compose config
   - docker compose --profile tests config
2. If daemon is unavailable, stop and report environment blocker.

### 2. Run Isolated E2E

Run tests in containerized mode:
- docker compose --profile tests run --rm demo-playwright-tests

If needed, run local comparison:
- cd demo-playwright && npm test

### 3. Capture Evidence

Collect and summarize:
- terminal output (failing test names, stack traces)
- demo-playwright/playwright-report
- demo-playwright/test-results

Never claim a test passed if it was not executed.

### 4. Root Cause Analysis

For each failure, map symptom to likely source:
- UI interaction/selectors/timing -> demo-playwright/public/app.js or test locators
- API contract/validation -> demo-playwright/server.js
- persistence mismatch -> demo-playwright/db/database.js
- startup/baseURL/webServer issues -> demo-playwright/playwright.config.js

### 5. Apply Minimal Fix

Rules:
- prefer smallest safe patch
- avoid unrelated refactors
- keep existing public behavior unless bug fix requires change
- add concise comments only where logic is non-obvious

### 6. Re-run and Confirm

Re-run failing scope first, then full suite:
- docker compose --profile tests run --rm demo-playwright-tests

Confirm artifacts are generated and consistent with reported results.

### 7. Deliver QA Report

Always include:
- What failed and why
- What changed (files)
- What passed after fix
- Residual risks and recommended next checks

## Fast Triage Heuristics

- Flaky timing: replace brittle waits with event/state-based waits.
- Selector fragility: prefer role/label/test-id over deep CSS chains.
- Data races: verify transaction order and timestamp assumptions.
- Multi-browser drift: confirm differences between chromium/firefox/webkit.

## Output Template

Use this response skeleton:

1. Test execution summary
2. Failures by severity with file references
3. Root cause per failure
4. Implemented fixes
5. Validation rerun results
6. Residual risks
7. Next recommended action

## Quality Gate (Must Pass Before Closing)

- Compose config valid
- Test command executed in target mode (Docker profile tests)
- No unverified claims
- File-level change summary provided
- Clear go/no-go recommendation for release confidence
