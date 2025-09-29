import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const BASE_URL = process.env.PAYMENT_BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLINET_SECRET
async function getAccessToken() {
  const response = await axios.post(
    `${BASE_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET, 
      },
    }
  );

  return response.data.access_token;
}

export const createOrder = async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const amount = req.body?.purchase_units?.[0]?.amount?.value;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const response = await axios.post(
      `${BASE_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        payment_source: {
          paypal: {
            experience_context: {
              return_url: "http://localhost:3001/success-payment",
              cancel_url: "http://localhost:3001/failed-payment",
              user_action: "PAY_NOW",
            },
          },
        },
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toString(), // لازم string
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Something went wrong" });
  }
};



export const captureOrder = async (req, res) => {
  const { orderId } = req.params;
  const accessToken = await getAccessToken();
  const response = await axios.post(
    `${BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
    res.json(response.data);

};
