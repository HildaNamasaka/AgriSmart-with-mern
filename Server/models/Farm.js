import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farm must belong to a user']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: 'My farm'
  },
  
  farmSize: {
    type: Number,
    required: [true, 'Please add farm size'],
    min: [0, 'Farm size cannot be negative']
  },
  
  sizeUnit: {
    type: String,
    enum: ['acres', 'hectares'],
    default: 'acres'
  },
  
  location: {
    county: {
      type: String,
      required: [true, 'Please add county']
    },
    subCounty: {
      type: String,
      trim: true
    },
    ward: {
      type: String,
      trim: true
    },
    village: {
      type: String,
      trim: true
    }
  },
  
  crops: [{
    cropName: {
      type: String,
      required: true
    },
    areaAllocated: {
      type: Number,
      min: 0
    },
    plantingDate: Date,
    expectedHarvestDate: Date,
    status: {
      type: String,
      enum: ['planned', 'planted', 'growing', 'harvested'],
      default: 'planted'
    }
  }],
  
  soilType: {
    type: String,
    enum: ['Clay', 'Sandy', 'Loam', 'Silt', 'Mixed', 'Not Sure']
  },
  
  hasIrrigation: {
    type: Boolean,
    default: false
  },
  
  hasElectricity: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

farmSchema.index({ user: 1 });
farmSchema.index({ 'location.county': 1 });

export default mongoose.model('Farm', farmSchema);