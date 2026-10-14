import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderTotals, consolidateItems } from '../src/utils/orderPricing.js';

test('consolidates duplicate product rows', () => {
  assert.deepEqual([...consolidateItems([
    { productId: 'pizza', quantity: 2 },
    { productId: 'pizza', quantity: 3 },
    { productId: 'salad', quantity: 1 },
  ])], [['pizza', 5], ['salad', 1]]);
});

test('rejects combined quantities above the limit', () => {
  assert.throws(() => consolidateItems([
    { productId: 'pizza', quantity: 30 },
    { productId: 'pizza', quantity: 21 },
  ]), /cannot exceed 50/);
});

test('rejects malformed or invalid quantities', () => {
  assert.throws(() => consolidateItems([{ productId: 'pizza', quantity: 0 }]), /between 1 and 50/);
  assert.throws(() => consolidateItems([{ productId: '', quantity: 1 }]), /productId/);
});

test('calculates delivery fee and tax below free-delivery threshold', () => {
  assert.deepEqual(calculateOrderTotals([{ unitPrice: 100, quantity: 2 }]), {
    subtotal: 200, deliveryFee: 30, tax: 10, total: 240,
  });
});

test('waives delivery at the threshold', () => {
  assert.deepEqual(calculateOrderTotals([{ unitPrice: 299, quantity: 1 }]), {
    subtotal: 299, deliveryFee: 0, tax: 15, total: 314,
  });
});
