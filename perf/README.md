# Performance tests (k6)

| Script | Purpose | Load |
|---|---|---|
| `smoke.js` | Checks the scenario works and the thresholds hold | 1 virtual user, 30 s |
| `load.js` | Ramps up to 20 users, holds one minute, ramps down | up to 20 virtual users |

```bash
k6 run perf/smoke.js
k6 run -e BASE_URL=https://staging.example.com perf/load.js
```

Install k6: https://grafana.com/docs/k6/latest/set-up/install-k6/

Thresholds are the pass/fail criteria (error rate and p95 latency). k6 exits with a non-zero code when one is crossed, so the same command works in CI (see `.github/workflows/perf.yml`).

Run load tests only against environments you own or that allow them.
