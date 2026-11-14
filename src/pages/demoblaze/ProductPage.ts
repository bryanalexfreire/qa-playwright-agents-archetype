import { expect, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { NavBar } from '../../components/demoblaze/NavBar';

/** Product detail page. */
export class ProductPage extends BasePage {
  protected readonly path = '/prod.html';
  readonly nav = new NavBar(this.page);

  get title(): Locator {
    return this.page.locator('#tbodyid h2.name');
  }

  get price(): Locator {
    return this.page.locator('#tbodyid h3.price-container');
  }

  async priceValue(): Promise<number> {
    await expect(this.price).toBeVisible();
    return Number((await this.price.innerText()).replace(/[^\d.]/g, ''));
  }

  /** Adds the product and returns the text of the browser alert ("Product added"). */
  async addToCart(): Promise<string> {
    await expect(this.title).toBeVisible();
    return this.acceptDialogAfter(() => this.page.getByRole('link', { name: 'Add to cart' }).click());
  }
}
