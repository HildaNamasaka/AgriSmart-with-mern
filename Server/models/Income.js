import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  
  crop: {
    type: String,
    required: [true, 'Please specify crop/product sold']
  },
  
  quantity: {
    type: Number,
    required: [true, 'Please add quantity sold'],
    min: 0
  },
  
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'bags', 'crates', 'bunches', 'pieces', 'liters', 'Other']
  },
  
  pricePerUnit: {
    type: Number,
    required: [true, 'Please add price per unit'],
    min: 0
  },
  
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  buyer: {
    type: String,
    trim: true
  },
  
  buyerPhone: {
    type: String,
    trim: true
  },
  
  market: {
    type: String,
    trim: true
  },
  
  date: {
    type: Date,
    required: [true, 'Please add sale date'],
    default: Date.now
  },
  
  paymentMethod: {
    type: String,
    enum: ['Cash', 'M-PESA', 'Bank Transfer', 'Credit', 'Other'],
    default: 'Cash'
  },
  
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Partial'],
    default: 'Paid'
  },
  
  notes: {
    type: String,
    trim: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

incomeSchema.pre('save', function(next) {
  this.totalAmount = this.quantity * this.pricePerUnit;
  next();
});

incomeSchema.index({ user: 1, date: -1 });
incomeSchema.index({ crop: 1 });

export default mongoose.model('Income', incomeSchema);