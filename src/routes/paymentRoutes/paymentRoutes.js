import express from "express";
import {
  captureOrder,
  createOrder,
} from "../../services/payment/paymentService.js";
const paymentRouter = express.Router();

paymentRouter.post("/paypal/create-order", createOrder);
paymentRouter.post("/paypal/capture-order/:orderId", captureOrder);


export default paymentRouter;
