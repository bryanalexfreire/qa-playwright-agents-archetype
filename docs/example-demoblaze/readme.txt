DEMOBLAZE E2E PURCHASE - EXECUTION GUIDE
=========================================

Goal: automated functional E2E test of the purchase flow on https://www.demoblaze.com/
  1. Add two products to the cart
  2. View the cart
  3. Complete the purchase form
  4. Finish the purchase

Technologies and versions
-------------------------
- Node.js 24.16.0 (minimum 20)
- npm 12.2.2
- Playwright Test 1.65.0 (@playwright/test)
- TypeScript 5.9.3
- Browsers: Chromium (Playwright build), optional Firefox / WebKit / mobile emulation
- OS used: Windows 11 (also runs on macOS and Linux)

Step by step
------------
1. Install Node.js 20 or newer: https://nodejs.org
2. Clone the repository and open a terminal in its folder.
3. Install dependencies:
     npm ci
4. Install the browsers:
     npx playwright install chromium
   (all browsers and devices: npm run setup)
5. Run the example (Chromium):
     npm run test:example
6. Open the HTML report (screens, steps, traces and videos of failures):
     npm run report

Other runs
----------
- One browser/device:   npx playwright test tests/e2e/demoblaze --project=firefox
- Mobile emulation:     npx playwright test tests/e2e/demoblaze --project=mobile-chrome
- Watch it run:         npx playwright test tests/e2e/demoblaze --project=chromium --headed
- UI mode:              npm run test:ui

What runs
---------
tests/e2e/demoblaze/purchase.spec.ts          3 data-driven E2E purchases (DD-01..03)
tests/e2e/demoblaze/order-validation.spec.ts  3 data-driven negative checks of the form (DD-V01..03)
tests/bugs/demoblaze/BUG-001.spec.ts          known defect: expected to FAIL until fixed

Test data: src/data/demoblaze/*.json (add a row to add a scenario; no code changes).
No account or password is needed. Customer data is fictitious (CustomerBuilder);
the card field uses a fake label, not a card number.

Expected result: 6 passed, 1 failed (BUG-001, documented in conclusiones.txt).
