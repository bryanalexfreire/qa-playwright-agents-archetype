# Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/) and [SemVer](https://semver.org/).

## [Unreleased]

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
- Vendor-neutral agent files (`AGENTS.md`, `.agents/`) and `link-agents.bat`.
<!-- example:start -->
- Removable worked example (Demoblaze purchase): POM, component objects, fixtures, data-driven tests, builder, bug spec, functional flow diagrams; removable with `remove-example.bat`.
<!-- example:end -->
