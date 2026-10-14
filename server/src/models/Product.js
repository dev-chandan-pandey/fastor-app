import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, name: { type: String, required: true, trim: true },
  description: { type: String, default: '' }, price: { type: Number, required: true, min: 0 },
  rating: { type: Number, min: 0, max: 5, default: 4.5 }, time: { type: String, default: '20–25 min' },
  image: { type: String, default: '' }, category: { type: String, required: true }, veg: { type: Boolean, default: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });
export const Product = mongoose.model('Product', productSchema);
