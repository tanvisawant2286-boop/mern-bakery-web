import mongoose from "mongoose";
import products from "../../frontend/src/data/products.json" with { type: "json" };
import Product from "../models/Product.js";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.warn("MONGODB_URI is blank. The storefront will use its preview catalog; database actions are paused.");
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    if (await Product.estimatedDocumentCount() === 0) {
      await Product.insertMany(products.map(({ id, ...product }) => ({ ...product, legacyId: id })));
      console.log(`Seeded ${products.length} bakery products into MongoDB.`);
    }
    console.log("Connected to MongoDB.");
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error("Check MONGODB_URI in backend/.env. The server will continue in preview mode.");
    return false;
  }
}

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;

mongoose.connection.on("disconnected", () => console.error("MongoDB disconnected."));
mongoose.connection.on("error", error => console.error(`MongoDB error: ${error.message}`));
