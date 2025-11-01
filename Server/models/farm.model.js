import mongoose from "mongoose";

const farmSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  farmName: { type: String },
  size: { type: Number, required: true }, // acres or hectares
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [longitude, latitude]
  },
  description: String,
}, { timestamps: true });

farmSchema.index({ location: "2dsphere" }); // enable geo queries

const Farm = mongoose.model('farm', farmSchema);

export default Farm;
