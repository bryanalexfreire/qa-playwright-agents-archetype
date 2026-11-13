---
name: test-summary-report
description: Writes the test completion report (ISO/IEC/IEEE 29119-3) in English with verdict, coverage vs risk, defects, automation status, residual risks, recommendations and use of AI. Use at the end of a session or release, or when someone asks for "the summary" or "the final report". Not for intermediate checkpoints.
metadata:
  version: 1.0.0
---

# Test summary report

## Critical
- Facts only from files: `qa/risks.md`, `qa/test-plan.md`, charters, notes, `bugs/index.md`, bug files, `candidates.md`, AI log, Playwright `test-results/report.json`.
- Counts must match the bug index; severities must match the reports.
- No personal or sensitive data (real names, bank names, account numbers).
- "No failures in the checks run" instead of "all passed" when coverage is partial.

## Output: `qa/sessions/<session>/summary.md`
```
# Test Completion Report — <Product>
Team · Test window · Environment (browsers/devices actually used) · Oracle
## 1. Overall assessment     Verdict: Not ready / Release with known risks / Ready — 2–4 lines why
## 2. Testing performed      charters, techniques, deviations from the plan
## 3. Coverage vs. risk      | Risk | Level | Charters | Coverage | Bugs |  + by ISO/IEC 25010 characteristic
## 4. Defect summary         counts by severity, IEEE 1044 classes, most important bugs, automated regression status
## 5. Residual risks and not tested   incl. browsers/devices not covered
## 6. Recommendations
## 7. Use of AI              how, human control, examples of human judgement (from the AI log)
## 8. Lessons learned
```

## Steps
1. Gather the facts; compute counts from the files.
2. Write the draft; send it to `report-reviewer`; apply its must-fix items.
3. Show it to the human; deliver only after approval.

## If something fails
- A number cannot be backed by a file: remove it or say how it was estimated.
