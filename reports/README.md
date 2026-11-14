# reports/

Versioned test reports, committed with the code so reviewers can open them without running anything.

```bash
npx playwright test            # or npm run test:example
npm run report:publish -- --label <name>
```

| Path | Content |
|---|---|
| `index.md` | History of runs, newest first |
| `LATEST.md` | Pointer to the newest run |
| `<YYYY-MM-DD_HHmm>-<label>/html/` | Full Playwright HTML report: steps, screenshots per step (`evidence()`), traces and videos of failures |
| `<…>/summary.md` | Results table, known bugs, unexpected failures, evidence list |
| `<…>/results.json`, `junit.xml` | Raw results (JSON) and JUnit for CI tools |

Evidence naming: `<TC-ID>-<data row>-<moment>` (for example `TC-03-DD-01-confirmation`), so each screenshot points to its test case and flow diagram in `qa/flows/`.
Keep only the runs that matter (release candidates, exercise deliveries); delete old folders in a normal commit.
