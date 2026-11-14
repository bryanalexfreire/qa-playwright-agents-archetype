/** Domain types of the Demoblaze example. */

export interface Product {
  readonly name: string;
  readonly category: 'Phones' | 'Laptops' | 'Monitors';
  /** Price in USD, as listed in the store. */
  readonly price: number;
}

export interface Customer {
  readonly name: string;
  readonly country: string;
  readonly city: string;
  readonly card: string;
  readonly month: string;
  readonly year: string;
}

export interface CartLine {
  readonly title: string;
  readonly price: number;
}

export interface OrderConfirmation {
  readonly title: string;
  readonly id: string;
  readonly amount: number;
  readonly cardNumber: string;
  readonly name: string;
  readonly date: string;
}

/** One row of the purchase data set (data-driven testing). */
export interface PurchaseScenario {
  readonly id: string;
  readonly description: string;
  readonly products: readonly string[];
  readonly customer: Partial<Customer>;
}

/** One row of the order-form validation data set. */
export interface OrderValidationScenario {
  readonly id: string;
  readonly description: string;
  readonly customer: Partial<Customer>;
  readonly expectedAlert: string;
}
