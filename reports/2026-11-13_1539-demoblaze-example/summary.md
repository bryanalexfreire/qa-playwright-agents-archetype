# Test run 2026-11-13_1539-demoblaze-example

**Result:** PASSED · Passed 6 · Failed 1 (known bugs 1) · Flaky 0 · Skipped 0 · Duration 45.5 s

Open the full report: [html/index.html](html/index.html) (or `npx playwright show-report reports/2026-11-13_1539-demoblaze-example/html`).

## Results
| Status | Test | Project | Duration | Evidence |
|---|---|---|---|---|
| 🐞 failed | BUG-001 · Purchase confirmation shows today's date | chromium | 9.7 s | 1 |
| ✅ passed | PUR-03 · Order is refused with empty name (DD-V01) | chromium | 9.5 s | 2 |
| ✅ passed | PUR-03 · Order is refused with empty credit card (DD-V02) | chromium | 4.8 s | 2 |
| ✅ passed | PUR-03 · Order is refused with all fields empty (DD-V03) | chromium | 4.6 s | 2 |
| ✅ passed | PUR-04 · Customer buys two phones (DD-01) | chromium | 7.1 s | 4 |
| ✅ passed | PUR-04 · Customer buys a laptop and a monitor (DD-02) | chromium | 8.7 s | 4 |
| ✅ passed | PUR-04 · Customer buys a phone and a laptop, only the mandatory fields (DD-03) | chromium | 20.0 s | 4 |

## Known bugs (fail until fixed)
- **BUG-001 · Purchase confirmation shows today's date** (chromium): Error: expect(received).toBe(expected) // Object.is equality Expected: "13/11/2026" Received: "13/10/2026"

## Evidence attached to the report
- BUG-001 · Purchase confirmation shows today's date (chromium): BUG-001-confirmation-date
- PUR-03 · Order is refused with empty name (DD-V01) (chromium): TC-04-DD-V01-form-before-purchase, TC-04-DD-V01-form-still-open
- PUR-03 · Order is refused with empty credit card (DD-V02) (chromium): TC-04-DD-V02-form-before-purchase, TC-04-DD-V02-form-still-open
- PUR-03 · Order is refused with all fields empty (DD-V03) (chromium): TC-04-DD-V03-form-before-purchase, TC-04-DD-V03-form-still-open
- PUR-04 · Customer buys two phones (DD-01) (chromium): TC-01-DD-01-last-product-added, TC-02-DD-01-cart, TC-03-DD-01-order-form, TC-03-DD-01-confirmation
- PUR-04 · Customer buys a laptop and a monitor (DD-02) (chromium): TC-01-DD-02-last-product-added, TC-02-DD-02-cart, TC-03-DD-02-order-form, TC-03-DD-02-confirmation
- PUR-04 · Customer buys a phone and a laptop, only the mandatory fields (DD-03) (chromium): TC-01-DD-03-last-product-added, TC-02-DD-03-cart, TC-03-DD-03-order-form, TC-03-DD-03-confirmation
