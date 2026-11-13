import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

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
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    // Signs in once per role and saves the session to .auth/<role>.json.
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } }, dependencies: ['setup'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'] },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, dependencies: ['setup'] },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] }, dependencies: ['setup'] },
  ],
});
