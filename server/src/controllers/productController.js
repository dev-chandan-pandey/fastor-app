import { Product } from '../models/Product.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
export const listProducts = asyncHandler(async (req, res) => {
  const { q, category, veg, sort } = req.query;
  const filter = { available: true };
  if (category && category !== 'All') filter.category = category;
  if (veg === 'true') filter.veg = true;
  if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }, { category: { $regex: q, $options: 'i' } }];
  const query = Product.find(filter);
  if (sort === 'price-low') query.sort({ price: 1 }); else if (sort === 'rating') query.sort({ rating: -1 }); else query.sort({ createdAt: 1 });
  const products = await query.lean();
  res.json({ success: true, data: products.map(p => ({ ...p, id: p.slug, _id: undefined, __v: undefined, rating: p.rating.toFixed(1) })) });
});
export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Product.distinct('category', { available: true });
  res.json({ success: true, data: categories.sort() });
});
