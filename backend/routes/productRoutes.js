import { Router } from "express";
import { listProducts } from "../controllers/productController.js";
import { requireDatabase } from "../middleware/databaseMiddleware.js";

const router = Router();
router.get("/", requireDatabase, listProducts);

export default router;
