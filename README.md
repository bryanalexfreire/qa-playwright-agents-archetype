# qa-playwright-agents-archetype

[![CI](https://github.com/bryanalexfreire/qa-playwright-agents-archetype/actions/workflows/ci.yml/badge.svg)](https://github.com/bryanalexfreire/qa-playwright-agents-archetype/actions/workflows/ci.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.56%2B-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![k6](https://img.shields.io/badge/k6-performance-7D64FF?logo=k6&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A Playwright test architecture you can start a project from: web E2E, API, performance (k6) and accessibility in one repository, with AI testing agents that cover the full cycle (risk analysis, plan per screen, exploratory charters, independent bug verification, bug reports, automated regression tests and the final report) and a human approving every step.

## What it demonstrates
| Area | How | Where |
|---|---|---|
| E2E with a maintainable design | Page Object Model, component objects, fixtures, data-driven tests, builders, typed models | `src/pages`, `examples/demoblaze/` |
| API testing | Typed client, contract checks, negative tests; no browser, runs once | `examples/api/` |
| Performance | k6 smoke and load scripts with pass/fail thresholds, manual CI workflow | `perf/`, `.github/workflows/perf.yml` |
| Accessibility | axe-core helper (WCAG 2.1 A/AA) that fails on serious violations and attaches the findings | `src/support/a11y.ts`, `tests/a11y/` |
| Traceability | Requirement ID in every test title, checked in CI | `scripts/check-traceability.mjs` |
| Quality gates in CI | Types, ESLint, Prettier, traceability, unit tests, multi-browser E2E, JUnit checks, evidence per step | `.github/workflows/ci.yml` |
| Resilient setup | Browser download with mirror and system Chrome/Edge fallback, unit-tested | `src/support/browsers.ts` |
| Agentic testing | Agents and skills with human approval and an audit log | `AGENTS.md`, `.agents/` |

Everything uses public practice sites and fictitious data.

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
   ```bash
   npm run agents:link -- <client-folder> <client-rules-file>
   ```
   It creates a local link to `.agents/` (a junction on Windows) and a hard link to `AGENTS.md`, and excludes both from Git (`.git/info/exclude`), so nothing client-specific is committed. It works on Windows, macOS and Linux. Undo with `npm run agents:link -- --remove <client-folder> <client-rules-file>`. Clients that read `AGENTS.md` natively need no link for the rules.
7. Open the folder with your agent client: it loads the project rules, the agents, the skills and the browser server (`.mcp.json`).

## Structure
```
AGENTS.md      project rules for the agents (lifecycle, approvals, workspace)
.agents/
  agents/      test-planner · charter-explorer · bug-verifier · test-generator · test-healer · report-reviewer
  skills/      risk-analysis · exploratory-testing · bug-report · test-automation · test-summary-report
  settings.json  permissions (agents cannot commit, push, read .env or saved sessions)
.github/       CI (Git flow branches) and PR template
qa/            requirements, risks, test plan, plans per screen, sessions (notes, bugs, evidence, summary)
src/pages/       Page Objects (one per screen, extend BasePage)
src/components/  component objects reused across screens (nav bars, modals, dialogs)
src/fixtures/    role fixtures with saved sessions (.auth/<role>.json) and page-object fixtures
src/models/      typed domain models used by pages and data
src/data/        test-data helpers: `uniqueId()` for records that never collide between parallel workers (data sets and builders live next to each example)
src/support/     shared helpers (e.g. native dialog handling)
tests/           auth.setup · smoke · e2e · bugs · a11y · unit
examples/        runnable examples, removable: demoblaze (E2E) and api (REST)
perf/            k6 scripts (smoke, load)
docs/            project documentation
reports/         published test reports (index, latest, one folder per run) — see reports/README.md
scripts/         check-traceability · publish-report · install-browsers · link-agents · remove-example
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
## Worked examples (removable)
### Demoblaze purchase, E2E (`examples/demoblaze/`)
A complete E2E example on https://www.demoblaze.com shows every convention of the archetype:

| Practice | Where |
|---|---|
| Page Object Model + OOP (inheritance from `BasePage`, encapsulated locators, user-level actions) | `examples/demoblaze/pages/` |
| Component objects (navigation, order modal, confirmation dialog) | `examples/demoblaze/components/` |
| Page objects injected as fixtures (no `new` in tests), own base URL | `examples/demoblaze/fixtures.ts` |
| Data-driven testing (one test per data row) | `examples/demoblaze/data/*.json` → `examples/demoblaze/tests/e2e/` |
| Builder pattern for fictitious test data | `examples/demoblaze/data/CustomerBuilder.ts` |
| Unique ids for data created by tests (safe in parallel) | `src/data/unique.ts` |
| Typed domain models | `examples/demoblaze/models.ts` |
| Requirement traceability (PUR-01..04) and steps per requirement | test titles and `test.step` |
| Known-bug spec that fails until the fix | `examples/demoblaze/tests/bugs/BUG-001.spec.ts` |
| Requirements, screen plan, exercise deliverables | `examples/demoblaze/qa/`, `examples/demoblaze/docs/` |
| Functional flow diagram per test case (Mermaid) and the purchase journey | `examples/demoblaze/qa/flows/` |

### Posts API, REST (`examples/api/`)
Contract, behaviour and negative tests of a REST resource against the public JSONPlaceholder API: a typed client (`PostsClient`), a runtime contract check, create/read/update/delete, filters, 404 and a response-time budget. It uses Playwright's request client, so it runs once, without a browser. Point it at another environment with `API_BASE_URL`.

```bash
npm run test:example          # Demoblaze E2E on chromium
npm run test:api              # Posts API tests
npm run example:remove -- --dry-run   # list what would be removed
npm run example:remove                # delete the examples and keep the clean archetype (asks first; --yes skips the prompt)
```
<!-- example:end -->

## Commands
| Command | What it does |
|---|---|
| `npm test` | All projects (chromium, firefox, webkit, mobile-chrome, mobile-safari) |
| `npm run test:smoke` | `@smoke` tests |
| `npm run test:mobile` | Mobile projects |
| `npm run test:unit` | Unit tests of the support code (no browser) |
| `npm run test:api` | API tests (no browser) |
| `npm run test:a11y` | Accessibility checks (axe-core) |
| `npm run perf:smoke` | k6 smoke test (needs [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)); more in `perf/README.md` |
| `npm run setup [-- chromium]` | Download Playwright's browsers (mirror retry, fallback status; see Browsers) |
| `npm run test:ui` | Playwright UI mode |
| `npm run report` | Open the HTML report of the last run |
| `npm run report:publish -- --label <name>` | Save the last run in `reports/<date>-<label>/` (summary, JSON, JUnit; add `--with-html` to keep the full HTML report too) |
| `npm run typecheck` · `npm run lint` · `npm run format:check` · `npm run lint:specs` | Static checks used by CI (`npm run format` fixes the style) |

## Browsers

`npm run setup` downloads Playwright's browsers and ffmpeg (video). If the download fails, the run does not stop:

| Need | 1st choice | Fallback when it is missing | Otherwise |
|---|---|---|---|
| Chromium projects (`chromium`, `mobile-chrome`, `setup`) | Playwright's Chromium | installed **Google Chrome**, then **Microsoft Edge** (`channel`; any version works) | message with the fix |
| Firefox / WebKit projects | Playwright's builds | none (Playwright needs its own builds) | message: run `npm run setup` |
| Video (`retain-on-failure`) | Playwright's ffmpeg | video off for the run; traces and screenshots still work | — |

- The decision is printed at the start of a run as `[browsers] ...` lines when something is missing (`npm run setup` prints the full status).
- Corporate network blocking the download: set `PW_DOWNLOAD_MIRROR` (or `PLAYWRIGHT_DOWNLOAD_HOST`) to an internal mirror; `npm run setup` retries through it.
- Force a browser for the Chromium projects: `PW_CHROMIUM_CHANNEL=chromium | chrome | msedge`.
- Logic in `src/support/browsers.ts`, unit tests in `tests/unit/browsers.test.ts` (`npm run test:unit`).

## Reports and evidence
- Every step that proves a requirement attaches a screenshot (`evidence()`), also when the test passes; failures add screenshot, video and trace.
- `npm run report:publish` turns the last run into a versioned `summary.md` with the results table, known bugs and evidence list. The heavy HTML report is not committed: CI uploads it as a run artifact and, when enabled, publishes it to GitHub Pages.
- Live report: set the repository variable `ENABLE_PAGES=true` and Settings → Pages → Source = GitHub Actions; every push to `main` then updates `https://<user>.github.io/<repository>/`.
- CI (GitHub Actions) writes the summary on the job page, the JUnit results in the checks tab, and uploads the report and evidence as an artifact. Known-bug specs (`@bug`) are reported but do not fail the build; any other failure does.

## Branching
Git flow — see [CONTRIBUTING.md](CONTRIBUTING.md). Agents never commit or push.

## Principles
- Human approval for every charter, data reset and submission.
- No bug without independent verification; quality over quantity.
- No credentials typed by agents; test accounts only; fictitious data.
- Requirement IDs in test titles for traceability; no hard waits; locators by role and label.

## License
MIT, see [LICENSE](LICENSE).
