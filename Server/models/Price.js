import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: [true, 'Please specify crop'],
    trim: true
  },
  
  county: {
    type: String,
    required: [true, 'Please add county']
  },
  
  market: {
    type: String,
    required: [true, 'Please add market name'],
    trim: true
  },
  
  minPrice: {
    type: Number,
    required: true,
    min: 0
  },
  
  maxPrice: {
    type: Number,
    required: true,
    min: 0
  },
  
  averagePrice: {
    type: Number,
    required: true,
    min: 0
  },
  
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'bag (90kg)', 'bag (50kg)', 'crate', 'bunch', 'piece', 'liter'],
    default: 'kg'
  },
  
  quality: {
    type: String,
    enum: ['Grade A', 'Grade B', 'Grade C', 'Mixed'],
    default: 'Mixed'
  },
  
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  source: {
    type: String,
    enum: ['User Reported', 'Market Survey', 'Government', 'Cooperative', 'API'],
    default: 'User Reported'
  },
  
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  verified: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

priceSchema.index({ crop: 1, county: 1, date: -1 });
priceSchema.index({ market: 1 });

priceSchema.pre('save', function(next) {
  if (!this.averagePrice) {
    this.averagePrice = (this.minPrice + this.maxPrice) / 2;
  }
  next();
});

export default mongoose.model('Price', priceSchema);