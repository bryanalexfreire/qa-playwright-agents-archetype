import { expect, type Locator, type Page } from '@playwright/test';
import { acceptDialogAfter } from '../support/dialogs';

/**
 * Base for every Page Object: one class per screen, named <Screen>Page.
 * Rules (test-automation conventions):
 * - Locators by role, label or text (what a user sees), never CSS positions.
 * - Methods are user actions ("reportTransfer"), not clicks on elements.
 * - Assertions stay in tests; a Page Object may expose locators for them.
 */
export abstract class BasePage {
  /** Path of the screen, relative to baseURL. */
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async open(params: Record<string, string | number> = {}): Promise<void> {
    let url = this.path;
    for (const [key, value] of Object.entries(params)) url = url.replace(`:${key}`, String(value));
    await this.page.goto(url);
  }

  /** Flash or status message shown after an action. */
  get status(): Locator {
    return this.page.getByRole('status').or(this.page.getByRole('alert'));
  }

  heading(name: string | RegExp): Locator {
    return this.page.getByRole('heading', { name });
  }

  async expectLoaded(name: string | RegExp): Promise<void> {
    await expect(this.heading(name)).toBeVisible();
  }

  /**
   * Runs an action that opens a native browser dialog (alert/confirm), accepts it
   * and returns its message. The handler is registered before the action so the
   * dialog never blocks the click that opened it.
   */
  async acceptDialogAfter(action: () => Promise<unknown>): Promise<string> {
    return acceptDialogAfter(this.page, action);
  }

  /** Confirms the app's own confirmation dialog (destructive actions). */
  async confirmDialog(buttonName: string | RegExp): Promise<void> {
    await this.page.getByRole('dialog').getByRole('button', { name: buttonName }).click();
  }
}
