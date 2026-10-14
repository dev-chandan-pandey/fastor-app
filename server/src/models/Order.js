import mongoose from 'mongoose';
const orderItemSchema = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, name: String, image: String, unitPrice: Number, quantity: { type: Number, min: 1, required: true } }, { _id: false });
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true }, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], validate: v => v.length > 0 }, instructions: { type: String, maxlength: 500, default: '' },
  address: { type: String, trim: true, maxlength: 300, required: true }, paymentMethod: { type: String, enum: ['cash'], default: 'cash' },
  subtotal: Number, deliveryFee: Number, tax: Number, total: Number,
  status: { type: String, enum: ['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });
orderSchema.pre('validate', function(next) { if (!this.orderNumber) this.orderNumber = `FS${Date.now().toString().slice(-8)}${Math.floor(Math.random()*90+10)}`; next(); });
export const Order = mongoose.model('Order', orderSchema);
