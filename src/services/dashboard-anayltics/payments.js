import Payment from "../../models/oneTimePayment/payment.model.js";

export const getCountOfAllPamyents = async (req,res) => {
  try {
    const count = await Payment.countDocuments();
    res.status(200).json({ success: true, totalPayments: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { userId, productType, productId, eventId, ServiceId, amount, currency, transactionId, meta } = req.body;

    const newPayment = new Payment({
      userId,
      productType,
      productId,
      eventId,
      ServiceId,
      amount,
      currency,
      transactionId,
      meta,
    });

    const savedPayment = await newPayment.save();

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: savedPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating payment",
    });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      total: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching payments",
    });
  }
};


export const getAllUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;

    const payments = await Payment.find({ userId })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 }); // الأحدث أولاً

    res.status(200).json({
      success: true,
      total: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user payments",
    });
  }
};
