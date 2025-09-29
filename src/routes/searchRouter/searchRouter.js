
import express from "express";
import { searchQuery } from "../../controllers/searchController/searchController.js";

const searchRouter = express.Router();
searchRouter.get("/" ,searchQuery);


export default searchRouter;