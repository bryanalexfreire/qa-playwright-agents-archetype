# qa-playwright-agents-archetype

Playwright archetype with AI testing agents. It covers the full testing cycle for a web app — risk analysis, plan per screen, exploratory charters, independent bug verification, bug reports, automated regression tests and the final report — with a human approving every step.

## Use this template
1. On GitHub: **Use this template → Create a new repository** (or clone and change the remote).
2. Install:
   ```bash
   npm ci
   npm run setup
   ```
3. Copy `.env.example` to `.env`, set `BASE_URL` and **test** credentials per role.
4. Put the product requirements in `qa/requirements/`.
5. Rename `src/pages/HomePage.ts` and `tests/smoke/home.spec.ts` to your first screen.
6. Connect your agent client (once per machine). The agent files are vendor-neutral; link them to the folder and rules file your client reads:
   ```bat
   link-agents.bat <client-folder> <client-rules-file>
   ```
   It creates a local junction to `.agents/` and a hard link to `AGENTS.md`, and excludes both from Git (`.git/info/exclude`), so nothing client-specific is committed. Undo with `link-agents.bat /remove <client-folder> <client-rules-file>`. Clients that read `AGENTS.md` natively need no link for the rules.
7. Open the folder with your agent client: it loads the project rules, the agents, the skills and the browser server (`.mcp.json`).

## Structure
```
AGENTS.md      project rules for the agents (lifecycle, approvals, workspace)
.agents/
  agents/      test-planner · charter-explorer · bug-verifier · test-generator · test-healer · report-reviewer
  skills/      risk-analysis · exploratory-testing · bug-report · test-automation · test-summary-report
  settings.json  permissions (agents cannot commit, push, read .env or saved sessions)
link-agents.bat     links .agents/ and AGENTS.md to your agent client (local only)
.github/       CI (Git flow branches) and PR template
qa/            requirements, risks, test plan, plans per screen, sessions (notes, bugs, evidence, summary)
src/pages/       Page Objects (one per screen, extend BasePage)
src/components/  component objects reused across screens (nav bars, modals, dialogs)
src/fixtures/    role fixtures with saved sessions (.auth/<role>.json) and page-object fixtures
src/models/      typed domain models used by pages and data
src/data/        data sets for data-driven tests (JSON) and builders
src/support/     shared helpers (e.g. native dialog handling)
tests/           auth.setup · smoke · e2e · bugs · a11y
docs/            project documentation
reports/         published test reports (index, latest, one folder per run) — see reports/README.md
scripts/         check-traceability · publish-report
```

## How the agents work together
| Step | Agent / skill | Output |
|---|---|---|
| 1. Risks | `risk-analysis` | `qa/risks.md` |
| 2. Plan per screen | `test-planner` | `qa/plans/<screen>.md` |
| 3. Explore (one charter at a time) | `exploratory-testing` + `charter-explorer` | notes, candidates |
| 4. Verify each candidate | `bug-verifier` | CONFIRMED / NOT_REPRODUCED / … |
| 5. Report | `bug-report` | `BUG-XXX.md` (human approves before submitting) |
| 6. Automate | `test-generator` + `test-automation` | `tests/**`, `src/pages/**` |
| 7. Keep the suite green | `test-healer` | repaired specs or new candidates |
| 8. Close | `test-summary-report` + `report-reviewer` | ISO/IEC/IEEE 29119-3 report |

Example prompts:
- "Analyse the risks of `qa/requirements/` and plan the Pay screen."
- "Run charter CH-02 for 20 minutes."
- "Generate the regression tests for `qa/plans/pay.md`."
- "Run the suite and heal what broke."

<!-- example:start -->
## Worked example: Demoblaze purchase (removable)
A complete E2E example on https://www.demoblaze.com shows every convention of the archetype:

| Practice | Where |
|---|---|
| Page Object Model + OOP (inheritance from `BasePage`, encapsulated locators, user-level actions) | `src/pages/demoblaze/` |
| Component objects (navigation, order modal, confirmation dialog) | `src/components/demoblaze/` |
| Page objects injected as fixtures (no `new` in tests), own base URL | `src/fixtures/demoblaze.ts` |
| Data-driven testing (one test per data row) | `src/data/demoblaze/*.json` → `tests/e2e/demoblaze/` |
| Builder pattern for fictitious test data | `src/data/demoblaze/CustomerBuilder.ts` |
| Typed domain models | `src/models/demoblaze.ts` |
| Requirement traceability (PUR-01..04) and steps per requirement | test titles and `test.step` |
| Known-bug spec that fails until the fix | `tests/bugs/demoblaze/BUG-001.spec.ts` |
| Requirements, screen plan, exercise deliverables | `qa/requirements/`, `qa/plans/`, `docs/example-demoblaze/` |
| Functional flow diagram per test case (Mermaid) and the purchase journey | `qa/flows/demoblaze/` |

```bash
npm run test:example          # run the example on chromium
remove-example.bat /dry      # list what would be removed (Windows)
remove-example.bat           # delete the example and keep the clean archetype (asks first; /y skips the prompt)
```
<!-- example:end -->

## Commands
| Command | What it does |
|---|---|
| `npm test` | All projects (chromium, firefox, webkit, mobile-chrome, mobile-safari) |
| `npm run test:smoke` | `@smoke` tests |
| `npm run test:mobile` | Mobile projects |
| `npm run test:ui` | Playwright UI mode |
| `npm run report` | Open the HTML report of the last run |
| `npm run report:publish -- --label <name>` | Save the last run in `reports/<date>-<label>/` (HTML with evidence per step, summary, JSON, JUnit) to commit it |
| `npm run typecheck` / `npm run lint:specs` | Static checks used by CI |

## Reports and evidence
- Every step that proves a requirement attaches a screenshot (`evidence()`), also when the test passes; failures add screenshot, video and trace.
- `npm run report:publish` turns the last run into a committed report with `summary.md`.
- CI (GitHub Actions) writes the summary on the job page, the JUnit results in the checks tab, and uploads the report and evidence as an artifact. Known-bug specs (`@bug`) are reported but do not fail the build; any other failure does.

## Branching
Git flow — see [CONTRIBUTING.md](CONTRIBUTING.md). Agents never commit or push.

## Principles
- Human approval for every charter, data reset and submission.
- No bug without independent verification; quality over quantity.
- No credentials typed by agents; test accounts only; fictitious data.
- Requirement IDs in test titles for traceability; no hard waits; locators by role and label.
