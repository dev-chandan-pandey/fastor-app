/** Consolidate duplicate product rows and reject quantities outside checkout limits. */
export function consolidateItems(items) {
  const quantities = new Map();
  for (const item of items) {
    if (!item || typeof item.productId !== 'string' || !item.productId.trim()) {
      throw new TypeError('Each cart item must have a productId.');
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
      throw new RangeError('Each item quantity must be between 1 and 50.');
    }
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
  }
  if ([...quantities.values()].some(quantity => quantity > 50)) {
    throw new RangeError('The quantity for an item cannot exceed 50.');
  }
  return quantities;
}

/** Prices are expected to come from trusted database product records, never client input. */
export function calculateOrderTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= 299 ? 0 : 30;
  const tax = Math.round(subtotal * 0.05);
  return { subtotal, deliveryFee, tax, total: subtotal + deliveryFee + tax };
}
