import { Router } from "express";
import {
  categoryNews,
  recommendations,
  search,
  status,
  topHeadlines,
} from "../controllers/newsController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const newsRouter = Router();

newsRouter.get("/status", status);
newsRouter.get("/top", asyncHandler(topHeadlines));
newsRouter.get("/category/:category", asyncHandler(categoryNews));
newsRouter.get("/search", asyncHandler(search));
newsRouter.get("/recommendations", asyncHandler(recommendations));
