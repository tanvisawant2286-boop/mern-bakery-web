export function notFound(_req, res) {
  res.status(404).json({ error: "API route not found." });
}

export function handleError(error, _req, res, _next) {
  console.error("API error:", error.message);
  res.status(500).json({ error: "The server could not complete this request." });
}
