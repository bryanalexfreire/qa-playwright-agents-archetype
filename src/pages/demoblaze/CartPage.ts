import { expect, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { NavBar } from '../../components/demoblaze/NavBar';
import { PlaceOrderModal } from '../../components/demoblaze/PlaceOrderModal';
import type { CartLine } from '../../models/demoblaze';

/** Cart: product rows, total and the entry to the order form. */
export class CartPage extends BasePage {
  protected readonly path = '/cart.html';
  readonly nav = new NavBar(this.page);

  get rows(): Locator {
    return this.page.locator('#tbodyid > tr');
  }

  get total(): Locator {
    return this.page.locator('#totalp');
  }

  /** The cart loads its rows asynchronously: wait for the expected number first. */
  async waitForLines(count: number): Promise<void> {
    await expect(this.rows).toHaveCount(count);
  }

  async lines(): Promise<CartLine[]> {
    const lines: CartLine[] = [];
    for (const row of await this.rows.all()) {
      const cells = row.locator('td');
      lines.push({
        title: (await cells.nth(1).innerText()).trim(),
        price: Number((await cells.nth(2).innerText()).trim()),
      });
    }
    return lines;
  }

  async totalValue(): Promise<number> {
    await expect(this.total).not.toBeEmpty();
    return Number((await this.total.innerText()).trim());
  }

  async placeOrder(): Promise<PlaceOrderModal> {
    await this.page.getByRole('button', { name: 'Place Order' }).click();
    const modal = new PlaceOrderModal(this.page);
    await modal.waitUntilOpen();
    return modal;
  }
}
