import type { Page } from '@playwright/test';

/**
 * Runs an action that opens a native browser dialog (alert/confirm), accepts it
 * and returns its message. The handler is registered before the action, so the
 * dialog never blocks the click that opened it.
 */
export async function acceptDialogAfter(page: Page, action: () => Promise<unknown>): Promise<string> {
  const message = new Promise<string>((resolve) => {
    page.once('dialog', async (dialog) => {
      const text = dialog.message();
      await dialog.accept();
      resolve(text);
    });
  });
  await action();
  return message;
}
