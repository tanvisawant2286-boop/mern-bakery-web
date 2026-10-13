import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ["cakes", "pastries", "breads"] },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, min: 0, max: 5, default: 5 },
  image: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true },
  legacyId: { type: Number, unique: true, sparse: true }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
