const requiredSettings = [
  "OWNER_WHATSAPP",
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_API_VERSION",
  "WHATSAPP_TEMPLATE_NAME",
  "WHATSAPP_TEMPLATE_LANGUAGE"
];

const money = value => `Rs. ${Number(value).toFixed(2)}`;

export async function notifyOrderOwner(order) {
  const missingSettings = requiredSettings.filter(name => !process.env[name]?.trim());
  if (missingSettings.length) {
    return {
      status: "not_configured",
      message: `Automatic WhatsApp notifications are not configured. Add ${missingSettings.join(", ")} to backend/.env.`
    };
  }

  const ownerNumber = process.env.OWNER_WHATSAPP.replace(/\D/g, "");
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID.trim();
  const apiVersion = process.env.WHATSAPP_API_VERSION.trim();
  if (!/^\d{8,15}$/.test(ownerNumber) || !/^\d+$/.test(phoneNumberId) || !/^v\d+\.\d+$/.test(apiVersion)) {
    return {
      status: "not_configured",
      message: "Automatic WhatsApp notifications need a valid international owner number, phone number ID, and Graph API version in backend/.env."
    };
  }

  const items = order.items
    .map(item => `${item.name} x ${item.quantity} (${money(item.price * item.quantity)})`)
    .join("; ");
  const templateParameters = [
    order._id.toString(),
    items,
    money(order.total),
    order.customer.name,
    order.customer.phone,
    order.customer.address
  ].map(text => ({ type: "text", text }));

  try {
    const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: ownerNumber,
        type: "template",
        template: {
          name: process.env.WHATSAPP_TEMPLATE_NAME.trim(),
          language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE.trim() },
          components: [{ type: "body", parameters: templateParameters }]
        }
      }),
      signal: AbortSignal.timeout(10000)
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const errorCode = result?.error?.code;
      console.error(`WhatsApp Cloud API rejected an order notification (HTTP ${response.status}${errorCode ? `, code ${errorCode}` : ""}).`);
      return {
        status: "failed",
        message: "The order was saved, but WhatsApp could not send the automatic notification. Check the backend logs and Cloud API settings."
      };
    }

    return { status: "sent", message: "WhatsApp accepted the order notification for delivery to the bakery owner." };
  } catch (error) {
    console.error("WhatsApp Cloud API request failed:", error.message);
    return {
      status: "failed",
      message: "The order was saved, but WhatsApp could not send the automatic notification. Check the backend logs and Cloud API settings."
    };
  }
}
