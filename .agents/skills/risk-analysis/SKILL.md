---
name: risk-analysis
description: Express product risk analysis (ISTQB CTFL v4.0, likelihood × impact, ISO/IEC 25010) that writes qa/risks.md to prioritise screens, charters and automation. Use after reconnaissance or when someone asks "what do we test first". Not for project/schedule risks.
metadata:
  version: 1.0.0
---

# Risk analysis

## Critical
- Write each risk as "If <cause>, then <consequence>". 8–12 risks maximum.
- Rate likelihood (P) and impact (I) from 1 to 3. Level = P × I: 1–2 Low, 3–4 Medium, 6–9 High.
- Prioritise money and calculations, personal data, authentication and authorization, the main business flow, visible integrations.

## Steps
1. Read `qa/requirements/` and the reconnaissance notes.
2. Identify risks per area and give each one an ISO/IEC 25010 characteristic: Functional suitability, Performance efficiency, Compatibility, Interaction capability, Reliability, Security, Maintainability, Flexibility, Safety.
3. Justify P and I in a few words (complexity, money, visible validation, console/network signals). When unsure, use the higher value.
4. Map each risk to charters and to automation priority (High = automate first, run on every PR).

## Output: `qa/risks.md`
```
## Top risks          (3 lines)
## Risk register
| ID | Risk | Quality characteristic | P | I | Level | Charters | Automation |
## Assumptions
```
IDs: R-01, R-02, …

## If something fails
- No requirements available: base the risks on the app's visible functions and write that assumption.
- The human disagrees with a level: their decision wins; record it in the AI log.
