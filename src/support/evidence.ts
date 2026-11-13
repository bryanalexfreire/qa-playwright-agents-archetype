import { test, type Page, type Locator } from '@playwright/test';

/**
 * Takes a screenshot as evidence and attaches it to the test report, also when the test passes.
 * Name it after the test case and the moment it proves: "TC-03-confirmation".
 *
 *   await evidence(page, 'TC-02-cart');                  // viewport
 *   await evidence(page, 'TC-03-form', { target: modal }); // one element only
 *   await evidence(page, 'TC-01-store', { fullPage: true });
 */
export async function evidence(
  page: Page,
  name: string,
  options: { target?: Locator; fullPage?: boolean } = {},
): Promise<void> {
  const info = test.info();
  const file = info.outputPath(`${sanitize(name)}.png`);
  if (options.target) await options.target.screenshot({ path: file });
  else await page.screenshot({ path: file, fullPage: options.fullPage ?? false });
  await info.attach(name, { path: file, contentType: 'image/png' });
}

/** Attaches a value as JSON evidence (for example data shown by the app). */
export async function evidenceData(name: string, data: unknown): Promise<void> {
  await test.info().attach(name, { body: JSON.stringify(data, null, 2), contentType: 'application/json' });
}

const sanitize = (name: string) => name.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '');
