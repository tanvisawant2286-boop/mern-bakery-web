import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDatabase } from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import { handleError, notFound } from "./middleware/errorMiddleware.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(here, "../frontend/dist");

dotenv.config({ path: path.join(here, ".env") });

const app = express();
const port = Number(process.env.PORT) || 5000;

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "32kb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 180, standardHeaders: "draft-7", legacyHeaders: false }));

app.use("/api/health", healthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api", notFound);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => res.sendFile(path.join(frontendDist, "index.html")));
}

app.use(handleError);

await connectDatabase();
app.listen(port, () => console.log(`Quality Bakery API listening on http://localhost:${port}`));
