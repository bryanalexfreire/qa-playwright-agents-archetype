import { test, expect } from '../../../src/fixtures/demoblaze';
import { CustomerBuilder, PURCHASE_SCENARIOS, product } from '../../../src/data/demoblaze';
import { evidence, evidenceData } from '../../../src/support/evidence';

/**
 * PUR-01..PUR-04 — E2E purchase flow, data-driven: one test per row of
 * src/data/demoblaze/purchase.data.json. Add a row to add a scenario.
 * Each step leaves a screenshot in the report (evidence also when the test passes).
 */
test.describe('Demoblaze purchase flow', { tag: ['@e2e', '@example', '@risk:R-01'] }, () => {
  for (const scenario of PURCHASE_SCENARIOS) {
    test(`PUR-04 · Customer buys ${scenario.description} (${scenario.id})`, async ({ page, addToCart, store, cart }) => {
      const products = scenario.products.map(product);
      const expectedTotal = products.reduce((sum, p) => sum + p.price, 0);
      const customer = CustomerBuilder.aCustomer().with(scenario.customer).build();

      await test.step('PUR-01 · Add two products to the cart', async () => {
        const alerts = await addToCart(products);
        expect(alerts).toEqual(products.map(() => expect.stringMatching(/^Product added\.?$/)));
        await evidence(page, `TC-01-${scenario.id}-last-product-added`);
      });

      await test.step('PUR-02 · Cart lists the products and the right total', async () => {
        await store.nav.openCart();
        await cart.waitForLines(products.length);
        const lines = await cart.lines();
        expect(lines).toEqual(expect.arrayContaining(products.map((p) => ({ title: p.name, price: p.price }))));
        expect(await cart.totalValue()).toBe(expectedTotal);
        await evidence(page, `TC-02-${scenario.id}-cart`);
      });

      const order = await test.step('PUR-03 · Complete the purchase form', async () => {
        const modal = await cart.placeOrder();
        await expect(modal.total).toContainText(String(expectedTotal));
        await modal.fill(customer);
        await evidence(page, `TC-03-${scenario.id}-order-form`, { target: modal.root });
        return modal;
      });

      await test.step('PUR-04 · Finish the purchase and check the confirmation', async () => {
        const confirmation = await order.purchase();
        await evidence(page, `TC-03-${scenario.id}-confirmation`);
        await evidenceData(`TC-03-${scenario.id}-confirmation-data`, confirmation);
        expect.soft(confirmation.title).toBe('Thank you for your purchase!');
        expect.soft(confirmation.id).toMatch(/^\d+$/);
        expect.soft(confirmation.amount).toBe(expectedTotal);
        expect.soft(confirmation.cardNumber).toBe(customer.card);
        expect.soft(confirmation.name).toBe(customer.name);
      });
    });
  }
});
