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

  /** Opens a product from the store, filtering by its category first. */
  async openProduct(product: Product): Promise<void> {
    await this.selectCategory(product.category);
    await expect(this.productLink(product.name)).toBeVisible();
    await this.productLink(product.name).click();
    await this.page.waitForURL(/prod\.html/);
  }
}
