import {
  getHomeVisits,
  incrementHomeVisits,
} from "../../services/dashboard-anayltics/counter.js";
import Event from "../../models/Event/event.model.js";
import Product from "../../models/Product/product.model.js";
import Service from "../../models/Service/Service.model.js";
import Payment from "../../models/oneTimePayment/payment.model.js";
import Group from '../../models/Group/group.model.js'
export const addHomeVisit = (req, res) => {
  const total = incrementHomeVisits();
  res.json({ message: "Visit counted", total });
};

export const getVisits = (req, res) => {
  const total = getHomeVisits();
  res.json({ total });
};

export const getAllDashboardItems = async (req, res) => {
  try {
    // 📄 Pagination params
    const page = parseInt(req.query.page) || 1; // default page 1
    const limit = parseInt(req.query.limit) || 10; // default 10 items
    const skip = (page - 1) * limit;

    const [events, services, products] = await Promise.all([
      Event.find().populate("user", "fullName").lean(),
      Service.find().populate("user", "fullName").lean(),
      Product.find().populate("user", "fullName").lean(),
    ]);

    const formattedData = [
      ...events.map((e) => ({
        user: e.user?.fullName || "Unknown User",
        date: new Date(e.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        type: "Event",
        status:
          e.adminApprovalStatus === "approved"
            ? "Approved"
            : e.adminApprovalStatus === "pending"
            ? "Pending"
            : "Rejected",
      })),
      ...services.map((s) => ({
        user: s.user?.fullName || "Unknown User",
        date: new Date(s.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        type: s.serviceType.charAt(0).toUpperCase() + s.serviceType.slice(1),
        status:
          s.adminApprovalStatus === "approved"
            ? "Approved"
            : s.adminApprovalStatus === "pending"
            ? "Pending"
            : "Rejected",
      })),
      ...products.map((p) => ({
        user: p.user?.fullName || "Unknown User",
        date: new Date(p.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        type: "Product",
        status: "Approved",
      })),
    ];

    formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    const paginatedData = formattedData.slice(skip, skip + limit);
    res.status(200).json({
      success: true,
      total: formattedData.length,
      currentPage: page,
      totalPages: Math.ceil(formattedData.length / limit),
      data: paginatedData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMonthlyPaymentsStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;

    const payments = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${lastYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // months names
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // initialize all months with 0
    const result = months.map((m, index) => {
      const thisMonthThisYear = payments.find(
        (p) => p._id.year === currentYear && p._id.month === index + 1
      )?.totalAmount || 0;

      const thisMonthLastYear = payments.find(
        (p) => p._id.year === lastYear && p._id.month === index + 1
      )?.totalAmount || 0;

      return {
        month: m,
        thisYear: thisMonthThisYear,
        lastYear: thisMonthLastYear,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching monthly stats" });
  }
};


export const getUsageStats = async (req, res) => {
  try {
    // Count documents from each model
    const [productsCount, servicesCount, groupsCount, eventsCount] = await Promise.all([
      Product.countDocuments(),
      Service.countDocuments(),
      Group.countDocuments(),
      Event.countDocuments()
    ]);

    // Format data for frontend chart or dashboard
    const usageData = [
      { name: "Products", value: productsCount },
      { name: "Services", value: servicesCount },
      { name: "Groups", value: groupsCount },
      { name: "Events", value: eventsCount }
    ];

    res.status(200).json({
      success: true,
      usageData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message
    });
  }
};
