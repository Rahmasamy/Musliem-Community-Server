import express from "express";
import {
  captureOrder,
  createOrder,
  getOrderDetails,
} from "../../services/payment/paymentService.js";
import { createPayment, getAllPayments, getAllUserPayments, getCountOfAllPamyents } from "../../services/dashboard-anayltics/payments.js";
import { getMonthlyPaymentsStats } from "../../controllers/DashboardController/DashboardController.js";
import protect from "../../middlewares/auth/authMiddleware.js";
const paymentRouter = express.Router();

paymentRouter.post("/paypal/create-order", createOrder);
paymentRouter.get("/get-count-payments", getCountOfAllPamyents);
// paymentRouter.get("/get-all-payments", getA);
paymentRouter.post("/paypal/capture-order/:orderId", captureOrder);
paymentRouter.get("/paypal/get-order/:orderId", getOrderDetails);
paymentRouter.get("/monthly-stats", getMonthlyPaymentsStats);
paymentRouter.post("/create-payment", createPayment);
paymentRouter.get("/all-payments", getAllPayments);
paymentRouter.get("/all-login-payments",protect, getAllUserPayments);


export default paymentRouter;
