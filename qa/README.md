# qa/

Living test basis, versioned with the code.

| Path | Content | Written by |
|---|---|---|
| `requirements/` | Specs, user stories, acceptance criteria (the oracle) | Product / human |
| `risks.md` | Product risk register (R-01…) | skill `risk-analysis` |
| `test-plan.md` | Test plan (scope, strategy, environment, roles, exit criteria) | skill `exploratory-testing` |
| `plans/<screen>.md` | Plan per screen with test conditions | agent `test-planner` |
| `flows/<feature>/` | Mermaid diagrams: user journey (`journey.md`) and one functional flow per test case (`TC-XX.md`), indexed in `index.md` | agents `test-planner`, skill `exploratory-testing` |
| `sessions/<YYYY-MM-DD>-<label>/` | recon, charters, notes, bugs, evidence, candidates, ai-log, summary | agents and skills |

Keep evidence light (PNG/JPG). Videos are git-ignored.
