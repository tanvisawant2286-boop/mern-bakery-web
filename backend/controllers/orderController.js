import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { notifyOrderOwner } from "../services/whatsappService.js";

const isText = (value, min, max) => typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
const money = value => `Rs. ${Number(value).toFixed(2)}`;

function buildWhatsAppUrl(order) {
  const ownerNumber = (process.env.OWNER_WHATSAPP || "").replace(/\D/g, "");
  if (!ownerNumber) return null;

  const lines = [
    "*NEW ORDER - Quality Bakery*",
    `Order: ${order._id}`,
    "",
    "*Items:*",
    ...order.items.map(item => `- ${item.name} x ${item.quantity} = ${money(item.price * item.quantity)}`),
    "",
    `*Total: ${money(order.total)}*`,
    `Customer: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}`
  ];

  if (order.location?.lat != null && order.location?.lng != null) {
    lines.push(`Map: https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`);
  }

  return `https://wa.me/${ownerNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function isValidLocation(location) {
  return location && Number.isFinite(Number(location.lat)) && Number.isFinite(Number(location.lng))
    && Number(location.lat) >= -90 && Number(location.lat) <= 90
    && Number(location.lng) >= -180 && Number(location.lng) <= 180;
}

export async function createOrder(req, res, next) {
  try {
    const { name, phone, address, items, location } = req.body ?? {};
    if (!isText(name, 2, 80) || !/^\d{10}$/.test(String(phone ?? "")) || !isText(address, 5, 500)) {
      return res.status(400).json({ error: "Enter a name, valid 10-digit phone number, and delivery address." });
    }
    if (!Array.isArray(items) || items.length < 1 || items.length > 40) {
      return res.status(400).json({ error: "Your cart must contain between 1 and 40 products." });
    }

    const normalized = [];
    for (const item of items) {
      if (!item || !mongoose.isValidObjectId(item.productId) || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1 || Number(item.quantity) > 50) {
        return res.status(400).json({ error: "One or more cart items are invalid." });
      }
      normalized.push({ product: item.productId, quantity: Number(item.quantity) });
    }
    const products = await Product.find({ _id: { $in: normalized.map(item => item.product) }, active: true }).lean();
    if (products.length !== new Set(normalized.map(item => item.product)).size) {
      return res.status(400).json({ error: "A product in your cart is no longer available. Refresh the menu and try again." });
    }
    const byId = new Map(products.map(product => [product._id.toString(), product]));
    const orderItems = normalized.map(({ product, quantity }) => {
      const current = byId.get(product);
      return { product: current._id, name: current.name, price: current.price, quantity };
    });
    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const safeLocation = isValidLocation(location) ? { lat: Number(location.lat), lng: Number(location.lng) } : undefined;
    const order = await Order.create({
      customer: { name: name.trim(), phone: String(phone), address: address.trim() },
      items: orderItems,
      total,
      location: safeLocation
    });
    const whatsappNotification = await notifyOrderOwner(order);
    res.status(201).json({
      message: "Order placed successfully.",
      orderId: order._id,
      total: order.total,
      whatsappNotification,
      whatsappUrl: whatsappNotification.status === "sent" ? null : buildWhatsAppUrl(order)
    });
  } catch (error) {
    next(error);
  }
}
