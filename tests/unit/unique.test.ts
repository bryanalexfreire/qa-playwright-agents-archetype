import { test, expect } from '@playwright/test';
import { uniqueId } from '../../src/data/unique';

// Unit tests of the unique-id helper (no browser needed): npm run test:unit

test.describe('uniqueId', () => {
  test('never repeats, even when called many times in the same millisecond', () => {
    const ids = Array.from({ length: 1000 }, () => uniqueId('order'));
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('starts with the given prefix and defaults to "qa"', () => {
    expect(uniqueId('customer')).toMatch(/^customer-/);
    expect(uniqueId()).toMatch(/^qa-/);
  });

  test('includes the worker index so parallel workers never collide', () => {
    expect(uniqueId('x', '7').split('-')[2]).toBe('7');
  });
});
