import express from "express";

const router = express.Router();
import { protect } from "../middleWare/authMiddleware.js";
import {
  createFoodOrder,
  getFoodOrders,
  updateFoodOrderStatus,
  deleteFoodOrder,
} from "../controllers/foodorderController.js";

router.get("/", protect, getFoodOrders);
router.post("/", protect, createFoodOrder);
router.patch("/:id/status", protect, updateFoodOrderStatus);
router.delete("/:id", protect, deleteFoodOrder);
export default router;
