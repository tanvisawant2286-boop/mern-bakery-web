import { Router } from "express";
import { createOrder } from "../controllers/orderController.js";
import { requireDatabase } from "../middleware/databaseMiddleware.js";

const router = Router();
router.post("/", requireDatabase, createOrder);

export default router;
