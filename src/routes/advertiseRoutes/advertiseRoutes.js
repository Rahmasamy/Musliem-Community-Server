import express from "express";
import { createAdvertise, getAllAdvertisements } from "../../controllers/advertiseController/advertiseController.js";

const advertiseRouter = express.Router();

advertiseRouter.post("/", createAdvertise);
advertiseRouter.get("/", getAllAdvertisements);

export default advertiseRouter;
