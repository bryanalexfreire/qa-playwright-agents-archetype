// k6 load test: ramps up to 20 virtual users, holds, then ramps down.
// Run it only against environments you own or that allow load tests (never a third-party production site).
//   k6 run -e BASE_URL=https://staging.example.com perf/load.js
import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://test-api.k6.io';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // ramp up
    { duration: '1m', target: 20 }, // hold
    { duration: '15s', target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],
    'http_req_duration{group:::list}': ['p(95)<1000'],
    'http_req_duration{group:::detail}': ['p(95)<1000'],
  },
};

export default function () {
  let firstId;

  group('list', () => {
    const list = http.get(`${BASE_URL}/public/crocodiles/`);
    check(list, { 'list is 200': (r) => r.status === 200 });
    firstId = list.json()[0].id;
  });

  group('detail', () => {
    const detail = http.get(`${BASE_URL}/public/crocodiles/${firstId}/`);
    check(detail, {
      'detail is 200': (r) => r.status === 200,
      'detail has a name': (r) => typeof r.json().name === 'string',
    });
  });

  sleep(1);
}
