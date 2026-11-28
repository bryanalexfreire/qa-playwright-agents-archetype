# Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/) and [SemVer](https://semver.org/).

## [Unreleased]
### Added
- `uniqueId()` helper in `src/data/unique.ts` (unique per parallel worker and run) and its unit tests.

## [1.0.0] - 2026-11-26
### Added
- API example (`examples/api/`): typed client, contract and negative tests on the Posts API; `api` Playwright project (no browser).
- k6 scripts (`perf/smoke.js`, `perf/load.js`) with thresholds and a manual workflow (`.github/workflows/perf.yml`).
- Accessibility helper `expectNoA11yViolations` (axe-core, WCAG 2.1 A/AA) and its tests in `tests/a11y/`.
- ESLint (with `eslint-plugin-playwright`) and Prettier, checked in CI.
- Optional live report on GitHub Pages (`ENABLE_PAGES=true`).
- MIT license, badges and a "What it demonstrates" section in the README.

### Changed
- The Demoblaze example moved to `examples/demoblaze/`; the archetype folders under `src/` and `tests/` are clean.
- `link-agents` and `remove-example` are Node scripts (`npm run agents:link`, `npm run example:remove`) and work on Windows, macOS and Linux. The `.bat` files are gone.
- `report:publish` no longer copies the HTML report into `reports/` (use `--with-html`); CI uploads it as an artifact.
- Source files formatted with Prettier.

## [0.2.0] - 2026-11-15
### Added
- Browser resolution with fallback (`src/support/browsers.ts`): Chromium projects use the installed Chrome or Edge when Playwright's Chromium is missing; video turns off when ffmpeg is missing; clear `[browsers]` messages; `PW_CHROMIUM_CHANNEL` and `PW_DOWNLOAD_MIRROR`.
- `npm run setup` (`scripts/install-browsers.mjs`): download, retry through a mirror, status of every project.
- `unit` project and `npm run test:unit` for support code; unit tests run first in CI.

## [0.1.0]
### Added
- Playwright base: multi-browser and mobile projects, role fixtures with saved sessions, BasePage, smoke example, traceability check.
- Agents: test-planner, charter-explorer, bug-verifier, test-generator, test-healer, report-reviewer.
- Skills: risk-analysis, exploratory-testing, bug-report, test-automation, test-summary-report.
- Git flow guide, PR template and CI for develop, release and hotfix branches.
- Evidence per step (`evidence()`), JUnit reporter, `npm run report:publish` (versioned reports in `reports/`), CI job summary, checks-tab test report and report artifact.
- Vendor-neutral agent files (`AGENTS.md`, `.agents/`) and `link-agents`.
<!-- example:start -->
- Removable worked example (Demoblaze purchase): POM, component objects, fixtures, data-driven tests, builder, bug spec, functional flow diagrams; removable with `remove-example.bat`.
<!-- example:end -->
