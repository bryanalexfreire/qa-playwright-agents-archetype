import { test as base } from '@playwright/test';
import { StorePage } from '../pages/demoblaze/StorePage';
import { ProductPage } from '../pages/demoblaze/ProductPage';
import { CartPage } from '../pages/demoblaze/CartPage';
import type { Product } from '../models/demoblaze';

export const DEMOBLAZE_URL = process.env.DEMOBLAZE_URL ?? 'https://www.demoblaze.com';

type DemoblazeFixtures = {
  store: StorePage;
  productPage: ProductPage;
  cart: CartPage;
  /** Adds the products from the store, one by one, and returns the alert text of each addition. */
  addToCart: (products: readonly Product[]) => Promise<string[]>;
};

/**
 * Page objects injected as fixtures (no `new` in tests) and a base URL of its own,
 * so the example never depends on the archetype's BASE_URL.
 * Each test gets a fresh browser context, so the Demoblaze cart starts empty.
 */
export const test = base.extend<DemoblazeFixtures>({
  baseURL: async ({}, use) => use(DEMOBLAZE_URL),
  store: async ({ page }, use) => use(new StorePage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cart: async ({ page }, use) => use(new CartPage(page)),
  addToCart: async ({ store, productPage }, use) => {
    await use(async (products) => {
      const alerts: string[] = [];
      for (const product of products) {
        await store.open();
        await store.openProduct(product);
        alerts.push(await productPage.addToCart());
      }
      return alerts;
    });
  },
});

export { expect } from '@playwright/test';
