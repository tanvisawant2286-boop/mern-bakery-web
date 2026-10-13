# Quality Bakery

A React + Express + MongoDB bakery storefront organized into separate `frontend/` and `backend/` applications.

## Project structure

```text
bakery web/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/BakeryContext.jsx
│   │   ├── data/products.json
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── package.json
└── README.md
```

`frontend/src/pages/` contains the customer-facing Home, Menu, About, Contact, Custom Order, Feedback, Checkout, and Not Found pages. Shared UI lives in `components/`; `services/` handles API calls and `context/` shares menu, cart, database, and theme state.

`backend/` follows a route → controller → model structure. It exposes product, checkout, contact, feedback, and custom order APIs. Orders and submissions are stored in MongoDB. The product catalog is seeded from the frontend's starter data on the first successful database connection.

## Requirements and setup

- Node.js 20.19+ (or 22.12+)
- MongoDB Atlas cluster or local MongoDB server

The `backend/.env` file is configured to use the local MongoDB service:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/quality_bakery
PORT=5001
NODE_ENV=development
OWNER_WHATSAPP=918669112305
```

The backend explicitly loads its own `backend/.env`, even when you start scripts from the project root. To use Atlas instead, replace only `MONGODB_URI` with your private Atlas connection string. Never commit `.env`; it is ignored by Git.

Order notifications are sent automatically through the WhatsApp Business Cloud API when its settings are configured. The current local `.env` does not yet have Cloud API credential values, so automatic delivery remains unavailable until Meta setup is completed. Until then, checkout provides a manual WhatsApp link; the customer must open it and tap **Send**.

To enable automatic notifications:

1. In Meta for Developers, configure a WhatsApp Business Platform app and sender number. Obtain its phone number ID, access token, and the Graph API version shown for your app. Ensure the recipient has agreed to receive these order notifications; test-mode apps may only message configured test recipients.
2. Create and get approval for a Utility message template named `order_notification`. Set its language to the one you configure and use this body, with six placeholders in order:

   ```text
   New bakery order {{1}}. Items: {{2}}. Total: {{3}}. Customer: {{4}}. Phone: {{5}}. Address: {{6}}.
   ```

3. Set `OWNER_WHATSAPP` to the recipient's full international number (digits only), and fill in `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_API_VERSION` (for example, `vXX.X` as provided by Meta), `WHATSAPP_TEMPLATE_NAME`, and `WHATSAPP_TEMPLATE_LANGUAGE` in `backend/.env`. Keep the access token private; do not commit or share it.
4. Restart the backend, place a test order, and check the checkout result. It will report whether the owner was notified; if Meta rejects the notification, the order remains saved and checkout offers the manual WhatsApp link.

Install the workspaces and start both apps from the project root:

```sh
npm install
npm run dev
```

Vite prints the frontend URL (normally `http://localhost:5173`) and proxies `/api` requests to Express on port 5001. The first successful MongoDB connection seeds the bakery products, and checkout/contact/custom-order/feedback submissions are saved to the database.

## Production

```sh
npm run build
npm start
```

Set `NODE_ENV=production`, `MONGODB_URI`, and optionally `PORT` in the backend environment. Express serves the built React app from `frontend/dist`.

## API

- `GET /api/health` — API and database status
- `GET /api/products` — active products; accepts `category` and `search` query parameters
- `POST /api/orders` — create an order using server-side MongoDB prices
- `POST /api/submissions` — save `contact`, `feedback`, or `requirement` submissions

The starter storefront intentionally does not include an admin API or authentication. Add those before exposing staff-only management features.
