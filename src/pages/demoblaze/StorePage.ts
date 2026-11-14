import { expect, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { NavBar } from '../../components/demoblaze/NavBar';
import type { Product } from '../../models/demoblaze';

/** Store home: categories and product cards. */
export class StorePage extends BasePage {
  protected readonly path = '/';
  readonly nav = new NavBar(this.page);

  private get catalog(): Locator {
    return this.page.locator('#tbodyid');
  }

  productLink(name: string): Locator {
    return this.catalog.getByRole('link', { name, exact: true });
  }

  async selectCategory(category: Product['category']): Promise<void> {
    await this.page.getByRole('link', { name: category, exact: true }).click();
  }

  /**
   * Opens a product from the store, filtering by its category first.
   * While the category reloads, the store can briefly render the same card twice
   * (old and new list), so the first matching link is used: both point to the same product.
   */
  async openProduct(product: Product): Promise<void> {
    await this.selectCategory(product.category);
    const link = this.productLink(product.name).first();
    await expect(link).toBeVisible();
    await link.click();
    await this.page.waitForURL(/prod\.html/);
  }
}
