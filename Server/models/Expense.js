import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  
  category: {
    type: String,
    required: [true, 'Please specify expense category'],
    enum: [
      'Seeds', 'Fertilizer', 'Pesticides', 'Labor', 'Equipment',
      'Transport', 'Irrigation', 'Storage', 'Marketing',
      'Veterinary', 'Feed', 'Rent', 'Other'
    ]
  },
  
  description: {
    type: String,
    required: [true, 'Please add expense description'],
    trim: true
  },
  
  amount: {
    type: Number,
    required: [true, 'Please add amount'],
    min: [0, 'Amount cannot be negative']
  },
  
  date: {
    type: Date,
    required: [true, 'Please add expense date'],
    default: Date.now
  },
  
  paymentMethod: {
    type: String,
    enum: ['Cash', 'M-PESA', 'Bank Transfer', 'Credit', 'Other'],
    default: 'Cash'
  },
  
  receiptNumber: {
    type: String,
    trim: true
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

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ category: 1 });

export default mongoose.model('Expense', expenseSchema);