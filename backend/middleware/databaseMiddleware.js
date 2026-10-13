import { isDatabaseConnected } from "../config/db.js";

export function requireDatabase(_req, res, next) {
  if (!isDatabaseConnected()) {
    return res.status(503).json({ error: "MongoDB is not connected. Add MONGODB_URI to backend/.env and restart the server." });
  }
  next();
}
