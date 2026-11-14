# Severity and priority

## Severity (technical and user impact)
| Level | Criteria | Examples |
|---|---|---|
| Critical | Data loss or corruption; wrong money or critical calculation; main flow blocked with no alternative; security failure exposing data or access | Wrong order total; refund paid before money arrives; another user's data visible |
| Major | Important function fails or gives a wrong result; hard workaround | Main filter returns wrong results; a final state can be undone |
| Minor | Secondary function fails or easy workaround; validation wrong without serious consequence | Wrong error message order; stale data on one page |
| Trivial | Cosmetic, text, alignment | Typo; misaligned label |

## Priority (business urgency)
- **High:** revenue, trust, compliance or a very visible flow.
- **Medium:** part of the users or there is a workaround.
- **Low:** low visibility or impact.

## Calibration mistakes
- Inflating severity to impress.
- Critical for something with an easy workaround.
- Not explaining why priority differs from severity.
