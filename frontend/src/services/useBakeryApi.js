import { createOrder, createSubmission } from "./api.js";
import { useBakery } from "../context/BakeryContext.jsx";

const databaseMessage = "MongoDB is not connected. Add MONGODB_URI to backend/.env and restart the server.";

export default function useBakeryApi() {
  const { databaseReady } = useBakery();

  async function submitForm(type, data) {
    if (!databaseReady) return { ok: false, message: databaseMessage };
    try {
      const result = await createSubmission(type, data);
      return { ok: true, message: result.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async function submitOrder(data) {
    if (!databaseReady) return { ok: false, message: databaseMessage };
    try {
      const result = await createOrder(data);
      return {
        ok: true,
        message: `${result.message} Your order reference is ${result.orderId}.`,
        whatsappNotification: result.whatsappNotification,
        whatsappUrl: result.whatsappUrl
      };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  return { submitForm, submitOrder };
}
