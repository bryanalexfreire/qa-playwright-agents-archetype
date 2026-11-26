import type { Locator, Page } from '@playwright/test';

/** Top navigation shared by every Demoblaze screen (component object). */
export class NavBar {
  readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('#navbarExample');
  }

  async goHome(): Promise<void> {
    await this.root.getByRole('link', { name: /Home/ }).click();
  }

  async openCart(): Promise<void> {
    await this.root.getByRole('link', { name: 'Cart', exact: true }).click();
    await this.page.waitForURL(/cart\.html/);
  }
}
