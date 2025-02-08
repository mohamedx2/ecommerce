import mongoose from 'mongoose'

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  _id: true,
  timestamps: true
})

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  items: [CartItemSchema],
}, {
  timestamps: true
})

export const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema)
