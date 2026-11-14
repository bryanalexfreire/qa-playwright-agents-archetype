import type { Customer } from '../../models/demoblaze';

/**
 * Builds fictitious customers (Builder pattern). Each build has a unique name,
 * so parallel runs never collide. The card value is a clearly fake label,
 * not a card number: the demo store accepts any text.
 */
export class CustomerBuilder {
  private data: Customer;

  private constructor() {
    const suffix = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
    this.data = {
      name: `QA Tester ${suffix}`,
      country: 'Colombia',
      city: 'Medellín',
      card: `TEST-CARD-${suffix.toUpperCase()}`,
      month: '11',
      year: '2026',
    };
  }

  static aCustomer(): CustomerBuilder {
    return new CustomerBuilder();
  }

  with(overrides: Partial<Customer>): this {
    this.data = { ...this.data, ...overrides };
    return this;
  }

  build(): Customer {
    return { ...this.data };
  }
}
