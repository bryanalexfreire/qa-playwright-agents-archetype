import { test, expect } from '../../../src/fixtures/demoblaze';
import { CustomerBuilder, product } from '../../../src/data/demoblaze';
import { evidence } from '../../../src/support/evidence';

/**
 * BUG-001 (example) — the purchase confirmation shows the previous month
 * (e.g. "13/10/2026" on 13 Nov 2026): the month looks zero-based.
 * Requirement PUR-04: "Date (today)". This spec asserts the EXPECTED result,
 * so it fails while the bug exists and passes once it is fixed.
 */
test('BUG-001 · Purchase confirmation shows today\'s date', { tag: ['@bug', '@example'] }, async ({ page, addToCart, store, cart }) => {
  await addToCart([product('Sony xperia z5')]);
  await store.nav.openCart();
  await cart.waitForLines(1);
  const modal = await cart.placeOrder();
  await modal.fill(CustomerBuilder.aCustomer().build());

  const confirmation = await modal.purchase();
  await evidence(page, 'BUG-001-confirmation-date');

  const today = new Date();
  expect(confirmation.date).toBe(`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`);
});
