import { z } from 'zod';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
const createSchema = z.object({ body: z.object({ items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(50) })).min(1).max(30), instructions: z.string().max(500).optional().default(''), address: z.string().trim().min(5).max(300), paymentMethod: z.enum(['cash']).optional().default('cash') }) });
export const validateCreateOrder = validate(createSchema);
export const createOrder = asyncHandler(async (req, res) => {
  const { items, instructions, address, paymentMethod } = req.validated.body;
  const slugs = items.map(i => i.productId);
  const products = await Product.find({ slug: { $in: slugs }, available: true });
  if (products.length !== new Set(slugs).size) throw new ApiError(400, 'One or more items are unavailable. Refresh your cart and try again.');
  const bySlug = new Map(products.map(p => [p.slug, p]));
  const orderItems = items.map(i => { const p = bySlug.get(i.productId); return { product: p._id, name: p.name, image: p.image, unitPrice: p.price, quantity: i.quantity }; });
  const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= 299 ? 0 : 30;
  const tax = Math.round(subtotal * 0.05);
  const order = await Order.create({ user: req.user._id, items: orderItems, instructions, address, paymentMethod, subtotal, deliveryFee, tax, total: subtotal + deliveryFee + tax });
  res.status(201).json({ success: true, data: order });
});
export const listOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: orders });
});
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!order) throw new ApiError(404, 'Order not found.');
  res.json({ success: true, data: order });
});
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new ApiError(404, 'Order not found.');
  if (!['confirmed', 'preparing'].includes(order.status)) throw new ApiError(409, 'This order can no longer be cancelled.');
  order.status = 'cancelled'; await order.save();
  res.json({ success: true, data: order });
});
