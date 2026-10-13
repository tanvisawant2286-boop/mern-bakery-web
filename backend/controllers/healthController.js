import { isDatabaseConnected } from "../config/db.js";

export function health(_req, res) {
  res.json({ ok: true, database: isDatabaseConnected() ? "connected" : "disconnected" });
}
