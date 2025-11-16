import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  type: {
    type: String,
    required: true,
    enum: ['sell', 'buy']
  },
  
  product: {
    type: String,
    required: [true, 'Please specify product'],
    trim: true
  },
  
  category: {
    type: String,
    required: true,
    enum: ['Crops', 'Livestock', 'Equipment', 'Seeds', 'Fertilizer', 'Other']
  },
  
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: 0
  },
  
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'bags', 'crates', 'pieces', 'liters', 'acres', 'Other']
  },
  
  price: {
    type: Number,
    required: [true, 'Please add price'],
    min: 0
  },
  
  priceNegotiable: {
    type: Boolean,
    default: true
  },
  
  description: {
    type: String,
    required: [true, 'Please add description'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  location: {
    county: {
      type: String,
      required: true
    },
    subCounty: String,
    specificLocation: String
  },
  
  contactPhone: {
    type: String,
    required: [true, 'Please add contact phone']
  },
  
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'removed'],
    default: 'active'
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000)
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

listingSchema.index({ user: 1 });
listingSchema.index({ type: 1, status: 1 });
listingSchema.index({ 'location.county': 1 });
listingSchema.index({ category: 1 });

export default mongoose.model('Listing', listingSchema);