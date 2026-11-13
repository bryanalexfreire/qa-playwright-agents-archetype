# Demoblaze purchase — Store, Product, Cart, Place order

> Example plan (agent `test-planner` format). Removed by `remove-example.bat`.

Roles: anonymous customer (no sign-in needed) · Requirements: PUR-01..PUR-04

## Elements and actions
| Screen | Elements | Actions |
|---|---|---|
| Store (`/`) | Categories (Phones, Laptops, Monitors), product cards (title, price) | open a product |
| Product (`/prod.html?idp_=N`) | title, price "$N *includes tax", "Add to cart" | add to cart → browser alert "Product added" |
| Cart (`/cart.html`) | rows (Pic, Title, Price, x Delete), Total, "Place Order" | delete row, open order form |
| Place order (modal) | Total, Name, Country, City, Credit card, Month, Year, Close, Purchase | purchase |
| Confirmation (modal) | "Thank you for your purchase!", Id, Amount, Card Number, Name, Date, OK | close → back to store |

## Business rules
- PUR-02: Total = sum of the prices in the cart.
- PUR-03: "Please fill out Name and Creditcard." when Name or Credit card is empty.
- PUR-04: Amount = cart total; Name and Card Number = form values; Date = today.

## Test conditions
| ID | Condition | Technique | Priority | Requirement | Automate? | Flow |
|---|---|---|---|---|---|---|
| TC-01 | Two products from different categories are added and listed with their prices | Scenario testing | High | PUR-01, PUR-02 | yes (data-driven) | [TC-01](../flows/demoblaze/TC-01.md) |
| TC-02 | Cart total equals the sum of the product prices | Scenario testing | High | PUR-02 | yes | [TC-02](../flows/demoblaze/TC-02.md) |
| TC-03 | Purchase with all fields shows the confirmation with matching Amount, Name, Card | Scenario testing | High | PUR-03, PUR-04 | yes | [TC-03](../flows/demoblaze/TC-03.md) |
| TC-04 | Empty Name or empty Credit card is refused with the exact message | Equivalence partitioning | High | PUR-03 | yes (data-driven) | [TC-04](../flows/demoblaze/TC-04.md) |
| TC-05 | Confirmation date is today | Boundary value analysis | Medium | PUR-04 | yes | [TC-05](../flows/demoblaze/TC-05.md) |
| TC-06 | Order form fields have unique accessible labels | Checklist-based testing | Low | — | later (a11y) | — |

## Open questions
- Should optional fields (Country, City, Month, Year) be validated (format, month 1–12)?
