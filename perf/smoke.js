// k6 smoke test: 1 virtual user, 30 s. Proves the scenario works before any load test.
//   k6 run perf/smoke.js
//   k6 run -e BASE_URL=https://staging.example.com perf/smoke.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://test-api.k6.io';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // under 1 % of requests fail
    http_req_duration: ['p(95)<800'], // 95 % of requests answer in under 800 ms
    checks: ['rate>0.99'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/public/crocodiles/`);
  check(response, {
    'status is 200': (r) => r.status === 200,
    'answers a list': (r) => Array.isArray(r.json()) && r.json().length > 0,
  });
  sleep(1);
}
