import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  crop: { type: mongoose.Schema.Types.ObjectId, ref: "Crop" },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  available: { type: Boolean, default: true },
}, 
{ timestamps: true }
);

const Product = mongoose.model('product', productSchema);

export default Product;
