import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import { browserStrategy } from './src/support/browsers';

// Which browser the Chromium projects use: Playwright's Chromium, or the installed Chrome / Edge when it
// could not be downloaded (see src/support/browsers.ts). Printed once, in the main process only.
const browsers = browserStrategy('retain-on-failure');
const notable = browsers.messages.filter((m) => !m.startsWith('Chromium projects: Playwright Chromium'));
const printAll = process.env.PW_PRINT_BROWSERS === '1'; // npm run setup prints the full status
if (!process.env.TEST_WORKER_INDEX && (notable.length || printAll)) {
  console.warn((printAll ? browsers.messages : notable).map((m) => `[browsers] ${m}`).join('\n'));
}

// Unit tests of the support code (tests/unit/*.test.ts) run without a browser in the "unit" project.
const notUnit = /tests[\\/]unit[\\/]/;

/**
 * Browser and device strategy (risk-based, by expected customer usage).
 * Order the projects by priority for your product; CI runs all of them.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  // html = full report with steps and evidence · json = input of `npm run report:publish`
  // junit = per-test results for CI (test report in the pull request)
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/junit.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: browsers.video, // 'retain-on-failure', or 'off' when ffmpeg is missing
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    // Signs in once per role and saves the session to .auth/<role>.json.
    { name: 'setup', testMatch: /auth\.setup\.ts/, use: { ...browsers.chromiumUse } },
    { name: 'unit', testMatch: /tests[\\/]unit[\\/].*\.test\.ts/ },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], ...browsers.chromiumUse, viewport: { width: 1366, height: 768 } },
      dependencies: ['setup'],
      testIgnore: notUnit,
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'], testIgnore: notUnit },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'], testIgnore: notUnit },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'], ...browsers.chromiumUse }, dependencies: ['setup'], testIgnore: notUnit },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] }, dependencies: ['setup'], testIgnore: notUnit },
  ],
});
