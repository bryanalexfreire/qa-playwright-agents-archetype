import { test, expect } from '@playwright/test';
import { expectNoA11yViolations } from '../../src/support/a11y';

/**
 * Accessibility checks with axe-core. These two tests prove the helper on local markup (no network):
 * accessible markup passes, and a missing alt text / form label is caught.
 * In your own specs call it on a real screen: `await expectNoA11yViolations(page, testInfo)`.
 */
test.describe('Accessibility helper', { tag: '@a11y' }, () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'axe results are the same in every browser; run once');

  test('A11Y-01 · Accessible markup has no serious violations', async ({ page }, testInfo) => {
    await page.setContent(`
      <html lang="en"><head><title>Sign in</title></head><body>
        <main>
          <h1>Sign in</h1>
          <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Company logo">
          <form>
            <label for="email">Email</label><input id="email" type="email">
            <button type="submit">Sign in</button>
          </form>
        </main>
      </body></html>`);
    await expectNoA11yViolations(page, testInfo);
  });

  test('A11Y-02 · A missing alt text and form label are reported', async ({ page }, testInfo) => {
    await page.setContent(`
      <html lang="en"><head><title>Sign in</title></head><body>
        <main>
          <h1>Sign in</h1>
          <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
          <form><input id="email" type="email"><button type="submit">Sign in</button></form>
        </main>
      </body></html>`);
    await expect(expectNoA11yViolations(page, testInfo)).rejects.toThrow(/image-alt|label/);
  });
});
