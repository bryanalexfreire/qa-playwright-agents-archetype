import { test as setup } from '@playwright/test';
import fs from 'node:fs';
import { ROLES, authFile } from '../src/fixtures/roles';

/**
 * Signs in once per role with TEST credentials from .env and saves the session.
 * Adapt the sign-in steps to your product (labels, button names, landing page).
 */
for (const role of ROLES) {
  setup(`sign in as ${role}`, async ({ page }) => {
    const user = process.env[`${role.toUpperCase()}_USER`];
    const password = process.env[`${role.toUpperCase()}_PASSWORD`];
    setup.skip(!user || !password, `No test credentials for role "${role}" in .env`);

    await page.goto('/sign-in');
    await page.getByLabel(/email|user/i).fill(user!);
    await page.getByLabel(/password/i).fill(password!);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('sign-in'));

    fs.mkdirSync('.auth', { recursive: true });
    await page.context().storageState({ path: authFile(role) });
  });
}
