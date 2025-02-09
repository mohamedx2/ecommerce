import mongoose, { Schema } from 'mongoose'

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
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

const CartSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  items: [CartItemSchema],
}, {
  timestamps: true // Add this to enable automatic createdAt and updatedAt
})

export const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema)
