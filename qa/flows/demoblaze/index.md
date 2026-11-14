# Demoblaze — functional flow diagrams

> Example. Removed by `remove-example.bat`.

| TC | Condition | Requirements | Diagram | Automated in |
|---|---|---|---|---|
| — | Purchase journey (reconnaissance) | PUR-01..04 | [journey.md](journey.md) | — |
| TC-01 | Two products are added and listed with their prices | PUR-01, PUR-02 | [TC-01.md](TC-01.md) | `tests/e2e/demoblaze/purchase.spec.ts` |
| TC-02 | Cart total equals the sum of the product prices | PUR-02 | [TC-02.md](TC-02.md) | `tests/e2e/demoblaze/purchase.spec.ts` |
| TC-03 | Valid purchase shows a matching confirmation | PUR-03, PUR-04 | [TC-03.md](TC-03.md) | `tests/e2e/demoblaze/purchase.spec.ts` |
| TC-04 | Empty Name or Credit card is refused | PUR-03 | [TC-04.md](TC-04.md) | `tests/e2e/demoblaze/order-validation.spec.ts` |
| TC-05 | Confirmation date is today | PUR-04 | [TC-05.md](TC-05.md) | `tests/bugs/demoblaze/BUG-001.spec.ts` |
