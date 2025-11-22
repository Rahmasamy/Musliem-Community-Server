import express from "express";
import { addHomeVisit, getAllDashboardItems, getUsageStats, getVisits } from "../../controllers/DashboardController/DashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.post("/home-visit", addHomeVisit);
dashboardRouter.get("/home-visits", getVisits);
dashboardRouter.get("/projects",getAllDashboardItems)
dashboardRouter.get("/usageStats", getUsageStats);

export default dashboardRouter;
