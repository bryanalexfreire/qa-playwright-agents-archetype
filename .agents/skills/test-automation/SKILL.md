---
name: test-automation
description: Conventions for turning test conditions and confirmed bugs into Playwright specs with Page Objects, role fixtures, tags and traceability, and for running and repairing them. Use when writing, reviewing or fixing a spec, or when test-generator / test-healer work. Not for exploratory sessions.
metadata:
  version: 1.0.0
---

# Test automation (Playwright)

## Critical
- One condition → one test. Assert only the expected result; never weaken an assertion to make a test pass.
- Test title: `<REQ-ID> · <expected behaviour>` (bugs: `BUG-XXX · <expected behaviour>`). `npm run lint:specs` enforces it.
- Credentials only from `.env` via `tests/auth.setup.ts`; tests use role fixtures (`memberPage`, `adminPage`).

## Project layout
```
src/pages/<Screen>Page.ts      Page Objects (extend BasePage), one per screen
src/fixtures/roles.ts          role fixtures with saved sessions (.auth/<role>.json)
src/data/                      fictitious test data and builders
tests/smoke/                   happy path per screen        @smoke
tests/<screen>/                functional conditions        @regression
tests/bugs/BUG-XXX.spec.ts     one per confirmed bug        @bug (fails while the bug exists)
tests/a11y/                    axe-core checks per screen   @a11y
qa/plans/<screen>.md           source of the conditions (test-planner)
```

## Page Objects
- Name actions as the user does them (`reportTransfer(amount, date)`), not as clicks.
- Locators: `getByRole` > `getByLabel` > `getByText` > `getByTestId`. Never CSS/XPath positions.
- Expose locators for assertions; keep `expect` in tests (except `expectLoaded`).

## Tests
- Web-first assertions (`await expect(locator).toHaveText(...)`); no `waitForTimeout`.
- Independent tests: create or reset the data they need; never rely on test order.
- Tags: priority (`@smoke`/`@regression`), risk (`@risk:R-XX`), type (`@bug`, `@a11y`, `@mobile`).
- Steps with `test.step('...')` for long scenarios, so the report reads like the test case.
- Use `test.info().annotations.push({ type: 'requirement', description: 'REQ-ID' })` when one test covers several requirements.

### Example
```ts
import { test, expect } from '../../src/fixtures/roles';
import { PayPage } from '../../src/pages/PayPage';

test('PAY-04 · Withdraw is not offered on a Confirmed contribution',
  { tag: ['@regression', '@risk:R-01'] },
  async ({ memberPage }) => {
    const pay = new PayPage(memberPage);
    await pay.open({ circle: 1054 });
    await expect(pay.itemState('period 2')).toHaveText('Confirmed');
    await expect(pay.withdrawButton('period 2')).toBeHidden();
  });
```

## Evidence and reports
- At each step that proves a requirement, call `evidence(page, '<TC-ID>-<data row>-<moment>')` (`src/support/evidence.ts`): the screenshot is attached to the report even when the test passes. Use `{ target: locator }` for one element and `evidenceData(name, value)` for values read from the app.
- Failures add screenshot, video and trace automatically (`playwright.config.ts`).
- After a run worth keeping: `npm run report:publish -- --label <name>` → `reports/<date>-<label>/` (HTML report, `summary.md`, JSON, JUnit), `reports/LATEST.md` and `reports/index.md`. Commit it when it backs a delivery or a release.
- CI publishes the same summary in the job page, the JUnit results in the checks tab and the report as an artifact; `@bug` specs are listed as known bugs and do not fail the build.

## Running
- One file while writing: `npx playwright test <file> --project=chromium`.
- Before a PR: `npm run typecheck && npm run lint:specs && npm test`.
- Mobile and other browsers: `npm run test:mobile`, `--project=firefox|webkit`.

## Triage of a failing test (test-healer)
Script broken → fix the Page Object · Product defect → candidate for `bug-verifier`, keep the assertion · Environment → report · Flaky → find the cause, no blind retries.

## If something fails
- No saved session for a role: the test is skipped with a message; ask the human to fill `.env` with test credentials or sign in.
- A locator cannot be found by role/label: ask the developers for an accessible name or a `data-testid` (and log it as an accessibility finding if a label is missing).
