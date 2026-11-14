---
name: exploratory-testing
description: Reconnaissance, test plan and time-boxed exploratory charters (session-based test management) for a web app, functional and non-functional, screen by screen. Use when starting a test session, planning charters or running one. Not for writing bug reports (use bug-report) or automation (use test-automation).
metadata:
  version: 1.0.0
---

# Exploratory testing

## Critical
- The human approves the plan and each charter before it runs.
- Browser agents run one at a time (they share one browser). Agents without a browser (report-reviewer) can run in parallel.
- Every candidate goes to `bug-verifier` before it becomes a bug.

## 1. Reconnaissance (≈ 8 % of the time)
Navigate the app with the accessibility snapshot. Map it with SFDIPOT (Structure, Function, Data, Interfaces, Platform, Operations, Time). Write `qa/sessions/<session>/recon.md`: product overview, product map table (Area | Key functions | Data/inputs | Notes), roles and accounts, critical flows, early observations (observed vs assumed), open questions.

Also draw the main user journeys found during reconnaissance as Mermaid flowcharts in `qa/flows/<feature>/journey.md` (screens as nodes, user actions as edges).

## 2. Risks and plan (≈ 6 %)
- Skill `risk-analysis` → `qa/risks.md`.
- Agent `test-planner` → `qa/plans/<screen>.md` and one functional flow diagram per test case in `qa/flows/<feature>/<TC-ID>.md` (always; see the agent for the format).
- Test plan `qa/test-plan.md`: Introduction & scope · Test strategy & techniques · Test environment & data (browser/device strategy by customer usage) · Risks & assumptions · Roles & schedule · Exit criteria.
- Charters `qa/sessions/<session>/charters.md`:
  `| ID | Charter | Risks | Quality characteristic | Techniques | Priority | Timebox | Status |`
  Charter text: `Explore <target> with <resources/techniques> to discover <information>`. At least one non-functional charter (security, accessibility, mobile, performance by observation).

## 3. Execution (≈ 70 %)
For each charter in risk order: agent `charter-explorer` → candidates → agent `bug-verifier` → skill `bug-report` for CONFIRMED ones → agent `test-generator` for the regression spec. Unconfirmed findings go to `qa/sessions/<session>/candidates.md` with the reason.
Reset test data before verification when earlier tests changed it.

## 4. Close (≈ 15 %)
Skill `test-summary-report`, then agent `report-reviewer`.

## Non-functional checklist
- Security: other users' URLs (expect 404/403), back button after sign out, `Cache-Control: no-store` on private pages, sign-in errors that do not reveal accounts, markup shown as text, CSRF, confirmation for destructive actions.
- Accessibility: keyboard only with visible focus, labels, states not only by colour, nothing on a timer, 200 % zoom (640 px), selects that do not act by themselves (WCAG 3.2.2).
- Mobile: 375 px viewport; no page overflow; controls reachable (tables may scroll inside their container).
- Performance: observe load times and failing requests only; never load-test.

## If something fails
- Browser closed or session lost: ask the human to sign in again in the browser window.
- App down or slow: note the time as an observation and tell the human.
