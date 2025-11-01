import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  activityType: {
    type: String,
    enum: ["planting", "watering", "weeding", "harvesting", "fertilizing"],
    required: true,
  },
  date: { type: Date, default: Date.now },
  notes: String,
}, 
{ timestamps: true }
);

const Activity = mongoose.model('activity', activitySchema)
export default Activity;
