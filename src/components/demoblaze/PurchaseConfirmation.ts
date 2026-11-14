import { expect, type Locator, type Page } from '@playwright/test';
import type { OrderConfirmation } from '../../models/demoblaze';

/** "Thank you for your purchase!" dialog shown after a successful order. */
export class PurchaseConfirmation {
  readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('.sweet-alert').filter({ visible: true });
  }

  /** Reads and parses the confirmation ("Id: …", "Amount: … USD", "Card Number: …", "Name: …", "Date: …"). */
  async read(): Promise<OrderConfirmation> {
    await expect(this.root).toBeVisible();
    const title = (await this.root.locator('h2').innerText()).trim();
    const details = await this.root.locator('p.lead').innerText();
    const field = (label: string) => details.match(new RegExp(`${label}:\\s*(.*)`))?.[1]?.trim() ?? '';
    return {
      title,
      id: field('Id'),
      amount: Number(field('Amount').replace(/[^\d.]/g, '')),
      cardNumber: field('Card Number'),
      name: field('Name'),
      date: field('Date'),
    };
  }

  async close(): Promise<void> {
    await this.root.getByRole('button', { name: 'OK' }).click();
  }
}
