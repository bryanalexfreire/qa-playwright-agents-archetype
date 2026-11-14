import { test, expect } from '../../../src/fixtures/demoblaze';
import { CustomerBuilder, ORDER_VALIDATION_SCENARIOS, product } from '../../../src/data/demoblaze';
import { evidence, evidenceData } from '../../../src/support/evidence';

/**
 * PUR-03 — mandatory fields of the order form, data-driven (equivalence partitioning):
 * one test per row of src/data/demoblaze/order-validation.data.json.
 */
test.describe('Demoblaze order form validation', { tag: ['@regression', '@example', '@risk:R-01'] }, () => {
  test.beforeEach(async ({ addToCart, store, cart }) => {
    await addToCart([product('Samsung galaxy s6')]);
    await store.nav.openCart();
    await cart.waitForLines(1);
  });

  for (const scenario of ORDER_VALIDATION_SCENARIOS) {
    test(`PUR-03 · Order is refused with ${scenario.description} (${scenario.id})`, async ({ page, cart }) => {
      const customer = CustomerBuilder.aCustomer().with(scenario.customer).build();
      const modal = await cart.placeOrder();
      await modal.fill(customer);
      await evidence(page, `TC-04-${scenario.id}-form-before-purchase`, { target: modal.root });

      const alert = await modal.purchaseExpectingAlert();

      await evidenceData(`TC-04-${scenario.id}-alert`, { message: alert });
      expect(alert).toBe(scenario.expectedAlert);
      await expect(modal.root).toBeVisible();
      await evidence(page, `TC-04-${scenario.id}-form-still-open`, { target: modal.root });
    });
  }
});
