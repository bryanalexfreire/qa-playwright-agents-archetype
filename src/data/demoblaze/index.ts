import catalog from './catalog.json' with { type: 'json' };
import purchaseScenarios from './purchase.data.json' with { type: 'json' };
import orderValidationScenarios from './order-validation.data.json' with { type: 'json' };
import type { OrderValidationScenario, Product, PurchaseScenario } from '../../models/demoblaze';

export const CATALOG = catalog as readonly Product[];
export const PURCHASE_SCENARIOS = purchaseScenarios as readonly PurchaseScenario[];
export const ORDER_VALIDATION_SCENARIOS = orderValidationScenarios as readonly OrderValidationScenario[];

/** Looks a product up in the catalog (the test oracle for prices). */
export function product(name: string): Product {
  const found = CATALOG.find((p) => p.name === name);
  if (!found) throw new Error(`Product "${name}" is not in src/data/demoblaze/catalog.json`);
  return found;
}

export { CustomerBuilder } from './CustomerBuilder';
