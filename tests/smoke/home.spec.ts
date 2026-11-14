import { test, expect } from '../../src/fixtures/roles';
import { HomePage } from '../../src/pages/HomePage';

/**
 * Title convention: "<REQ-ID> · <expected behaviour>" + tags for priority and risk.
 * The REQ-ID links the test to the requirement it checks (traceability).
 */
test('HOME-01 · Home page loads with its main navigation', { tag: ['@smoke', '@risk:R-01'] }, async ({ page }) => {
  const home = new HomePage(page);
  await home.open();
  await expect(home.mainNavigation).toBeVisible();
});
