import { test as base, type Browser, type Page, type TestInfo } from '@playwright/test';
import fs from 'node:fs';

/**
 * One fixture per role. Each role reuses the session saved by tests/auth.setup.ts
 * in .auth/<role>.json, so tests and agents never type passwords.
 * To add a role: add it to ROLES, add a `<role>Page` fixture below and its keys to .env.example.
 */
export const ROLES = ['member', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export const authFile = (role: Role) => `.auth/${role}.json`;

async function pageFor(role: Role, browser: Browser, testInfo: TestInfo, use: (page: Page) => Promise<void>) {
  const file = authFile(role);
  testInfo.skip(!fs.existsSync(file), `No saved session for role "${role}" (${file}).`);
  const context = await browser.newContext({ ...testInfo.project.use, storageState: file });
  const page = await context.newPage();
  await use(page);
  await context.close();
}

type RoleFixtures = {
  memberPage: Page;
  adminPage: Page;
};

export const test = base.extend<RoleFixtures>({
  memberPage: async ({ browser }, use, testInfo) => pageFor('member', browser, testInfo, use),
  adminPage: async ({ browser }, use, testInfo) => pageFor('admin', browser, testInfo, use),
});

export { expect } from '@playwright/test';
