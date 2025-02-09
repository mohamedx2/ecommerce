import mongoose, { Schema, Document } from 'mongoose'

export interface IOrder extends Document {
  userId: string;
  items: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  }
}, {
  timestamps: true
})

// Add indexes for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 })
OrderSchema.index({ status: 1 })

// Calculate total before saving
OrderSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }
  next()
})

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
