# Demoblaze — functional flow diagrams

> Example. Removed by `npm run example:remove`.

| TC | Condition | Requirements | Diagram | Automated in |
|---|---|---|---|---|
| — | Purchase journey (reconnaissance) | PUR-01..04 | [journey.md](journey.md) | — |
| TC-01 | Two products are added and listed with their prices | PUR-01, PUR-02 | [TC-01.md](TC-01.md) | `examples/demoblaze/tests/e2e/purchase.spec.ts` |
| TC-02 | Cart total equals the sum of the product prices | PUR-02 | [TC-02.md](TC-02.md) | `examples/demoblaze/tests/e2e/purchase.spec.ts` |
| TC-03 | Valid purchase shows a matching confirmation | PUR-03, PUR-04 | [TC-03.md](TC-03.md) | `examples/demoblaze/tests/e2e/purchase.spec.ts` |
| TC-04 | Empty Name or Credit card is refused | PUR-03 | [TC-04.md](TC-04.md) | `examples/demoblaze/tests/e2e/order-validation.spec.ts` |
| TC-05 | Confirmation date is today | PUR-04 | [TC-05.md](TC-05.md) | `examples/demoblaze/tests/bugs/BUG-001.spec.ts` |
