import Submission from "../models/Submission.js";

const isText = (value, min, max) => typeof value === "string" && value.trim().length >= min && value.trim().length <= max;

function validateSubmission(type, data) {
  if (!isText(data.name, 2, 80)) return "Please enter your name.";
  if (data.phone && !/^\d{10}$/.test(String(data.phone))) return "Enter a valid 10-digit phone number.";
  if (type === "contact") {
    if (typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Enter a valid email address.";
    if (!isText(data.message, 5, 1200)) return "Please enter a message between 5 and 1200 characters.";
  }
  if (type === "feedback") {
    if (!Number.isInteger(Number(data.rating)) || Number(data.rating) < 1 || Number(data.rating) > 5) return "Choose a rating from 1 to 5.";
    if (!isText(data.topic, 1, 60) || !isText(data.recommend, 1, 10) || !isText(data.message, 5, 1200)) return "Complete all feedback fields.";
  }
  if (type === "requirement" && !["occasion", "itemType", "flavour", "weight", "design", "date", "time"].every(field => isText(data[field], 1, 600))) {
    return "Complete all required custom order details.";
  }
  return null;
}

function cleanSubmission(data) {
  const cleaned = Object.fromEntries(Object.entries(data).map(([key, value]) => {
    if (typeof value === "string") return [key, value.trim().slice(0, 1200)];
    if (typeof value === "boolean" || typeof value === "number") return [key, value];
    return [key, undefined];
  }).filter(([, value]) => value !== undefined));
  if (isValidLocation(data.location)) {
    cleaned.location = { lat: Number(data.location.lat), lng: Number(data.location.lng) };
  }
  return cleaned;
}

function isValidLocation(location) {
  return location && Number.isFinite(Number(location.lat)) && Number.isFinite(Number(location.lng))
    && Number(location.lat) >= -90 && Number(location.lat) <= 90
    && Number(location.lng) >= -180 && Number(location.lng) <= 180;
}

export async function createSubmission(req, res, next) {
  try {
    const { type, data } = req.body ?? {};
    if (!["contact", "feedback", "requirement"].includes(type) || !data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({ error: "Choose a valid form type and provide form details." });
    }
    if (data.website) return res.status(201).json({ message: "Submission received." });
    const validationError = validateSubmission(type, data);
    if (validationError) return res.status(400).json({ error: validationError });
    await Submission.create({ type, data: cleanSubmission(data) });
    res.status(201).json({ message: "Your submission has been received." });
  } catch (error) {
    next(error);
  }
}
