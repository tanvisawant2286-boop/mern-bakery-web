import Product from "../models/Product.js";

export async function listProducts(req, res, next) {
  try {
    const filter = { active: true };
    if (["cakes", "pastries", "breads"].includes(req.query.category)) filter.category = req.query.category;
    if (typeof req.query.search === "string" && req.query.search.trim()) {
      const escaped = req.query.search.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: escaped, $options: "i" };
    }
    const products = await Product.find(filter).sort({ name: 1 }).lean();
    res.json(products.map(({ _id, __v, ...product }) => ({ ...product, id: _id.toString() })));
  } catch (error) {
    next(error);
  }
}
