import { Router } from "express";
import { createSubmission } from "../controllers/submissionController.js";
import { requireDatabase } from "../middleware/databaseMiddleware.js";

const router = Router();
router.post("/", requireDatabase, createSubmission);

export default router;
