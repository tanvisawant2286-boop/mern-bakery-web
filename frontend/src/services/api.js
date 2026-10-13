async function request(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Could not connect to the bakery server.");
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "The request could not be completed.");
  return result;
}

export function getHealth() {
  return request("/api/health");
}

export function getProducts(params = {}) {
  const query = new URLSearchParams(params);
  return request(`/api/products${query.size ? `?${query}` : ""}`);
}

export function createOrder(data) {
  return request("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export function createSubmission(type, data) {
  return request("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, data })
  });
}
