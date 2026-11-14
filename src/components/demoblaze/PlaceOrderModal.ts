import { expect, type Locator, type Page } from '@playwright/test';
import type { Customer, OrderConfirmation } from '../../models/demoblaze';
import { PurchaseConfirmation } from './PurchaseConfirmation';
import { acceptDialogAfter } from '../../support/dialogs';

/**
 * "Place order" form (component object, lives inside the Cart page).
 * The fields are located by id on purpose: the app links the "Total" label
 * to the Name input too (two labels for="name"), so the accessible name of
 * Name is ambiguous. Reported as an accessibility finding in conclusiones.txt.
 */
export class PlaceOrderModal {
  readonly root: Locator;
  private readonly fields: Record<keyof Customer, Locator>;

  constructor(private readonly page: Page) {
    this.root = page.locator('#orderModal');
    this.fields = {
      name: this.root.locator('#name'),
      country: this.root.locator('#country'),
      city: this.root.locator('#city'),
      card: this.root.locator('#card'),
      month: this.root.locator('#month'),
      year: this.root.locator('#year'),
    };
  }

  get total(): Locator {
    return this.root.locator('#totalm');
  }

  async waitUntilOpen(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.fields.name).toBeEditable();
  }

  /** Fills every field of the customer; empty strings leave a field empty. */
  async fill(customer: Customer): Promise<void> {
    for (const [field, value] of Object.entries(customer) as [keyof Customer, string][]) {
      await this.fields[field].fill(value);
    }
  }

  /** Submits a valid order and returns the confirmation shown to the customer. */
  async purchase(): Promise<OrderConfirmation> {
    await this.root.getByRole('button', { name: 'Purchase' }).click();
    return new PurchaseConfirmation(this.page).read();
  }

  /** Submits the form expecting the browser alert of a refused order; returns its text. */
  async purchaseExpectingAlert(): Promise<string> {
    return acceptDialogAfter(this.page, () => this.root.getByRole('button', { name: 'Purchase' }).click());
  }
}
