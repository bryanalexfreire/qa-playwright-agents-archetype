import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, type TestInfo } from '@playwright/test';

export type Impact = 'minor' | 'moderate' | 'serious' | 'critical';

const ORDER: Impact[] = ['minor', 'moderate', 'serious', 'critical'];

export interface A11yOptions {
  /** Lowest impact that fails the test. Default: serious (serious and critical fail). */
  failFrom?: Impact;
  /** Limit the scan to a part of the page (CSS selector). */
  include?: string;
  /** Rule ids to skip, each with a reason in the test that passes them. */
  disableRules?: string[];
}

/**
 * Scans the current page with axe-core (WCAG 2.1 A and AA), attaches the full result to the report
 * and fails when there are violations at or above `failFrom`.
 */
export async function expectNoA11yViolations(page: Page, testInfo: TestInfo, options: A11yOptions = {}): Promise<void> {
  const { failFrom = 'serious', include, disableRules = [] } = options;
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  if (include) builder = builder.include(include);
  if (disableRules.length) builder = builder.disableRules(disableRules);

  const { violations } = await builder.analyze();
  await testInfo.attach('a11y-violations.json', {
    body: JSON.stringify(violations, null, 2),
    contentType: 'application/json',
  });

  const limit = ORDER.indexOf(failFrom);
  const blocking = violations.filter((v) => ORDER.indexOf((v.impact ?? 'minor') as Impact) >= limit);
  const summary = blocking.map((v) => `${v.impact} · ${v.id} · ${v.help} (${v.nodes.length} elements)`);
  expect(summary, `Accessibility violations from "${failFrom}" up`).toEqual([]);
}
