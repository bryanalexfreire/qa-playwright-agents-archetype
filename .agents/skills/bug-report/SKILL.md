---
name: bug-report
description: Classifies, verifies and writes jury-quality bug reports (severity, priority, IEEE 1044, traceability, light evidence) and keeps the bug index. Use for any suspicious behaviour or when someone says "this fails" or "report this bug". Not for static review questions about requirements.
metadata:
  version: 1.0.0
---

# Bug report

## Critical
- No report without a `CONFIRMED` verdict from `bug-verifier`.
- One bug per report. Usability, accessibility, performance and security defects are bugs too.
- No personal or sensitive data (names of real people, bank names, account numbers, emails) beyond what the steps strictly need; use the test accounts' roles.
- The human approves every submission to the tracker.

## Steps
1. Triage: product defect → continue; works as designed / ambiguous requirement → `candidates.md` and a question for the product owner; environment → `candidates.md`.
2. Duplicates: same root cause as an existing bug → extend that bug.
3. Severity (impact) and priority (urgency) with `severity-rubric.md`. Justify in one line when they differ.
4. Copy `template.md` to `qa/sessions/<session>/bugs/BUG-XXX.md` (next ID from `bugs/index.md`) and fill it in English.
5. Add the row to `bugs/index.md`: `| ID | Title | Severity | Priority | Area | Status | Time | Tracker |` (status: draft, submitted, duplicate, withdrawn).
6. Ask `test-generator` for `tests/bugs/BUG-XXX.spec.ts`.
7. Show the report to the human, ready to paste or to fill in the tracker form; submit only after approval.

## Writing
Short sentences, no emotional words. Numbered steps, one action each, exact data. Expected result always with its basis (requirement ID quoted). Actual result with exact texts in quotes.

## If something fails
- The tracker rejects the report: show the error as it is and keep the bug as draft.
