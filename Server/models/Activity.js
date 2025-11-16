import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  
  activityType: {
    type: String,
    required: [true, 'Please specify activity type'],
    enum: [
      'Land Preparation', 'Planting', 'Weeding', 'Fertilizing', 
      'Spraying', 'Watering', 'Pruning', 'Harvesting',
      'Post-Harvest', 'Marketing', 'Other'
    ]
  },
  
  crop: {
    type: String,
    required: [true, 'Please specify crop']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  date: {
    type: Date,
    required: [true, 'Please add activity date'],
    default: Date.now
  },
  
  quantity: {
    type: Number,
    min: 0
  },
  
  unit: {
    type: String,
    enum: ['kg', 'bags', 'liters', 'acres', 'hours', 'pieces', 'Other']
  },
  
  cost: {
    type: Number,
    default: 0,
    min: 0
  },
  
  laborUsed: {
    type: Number,
    default: 1,
    min: 0
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

activitySchema.index({ user: 1, date: -1 });
activitySchema.index({ crop: 1 });

export default mongoose.model('Activity', activitySchema);