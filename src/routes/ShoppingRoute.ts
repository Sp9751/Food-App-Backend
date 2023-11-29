import express, { Request, Response, NextFunction } from "express";
import {
  GetFoodAvailability,
  GetFoodIn30Min,
  GetTopRestaurant,
  RestaurantById,
  SearchFood,
} from "../controllers";

const router = express.Router();

router.get("/:pincode", GetFoodAvailability);
router.get("/top-restaurant/:pincode", GetTopRestaurant);
router.get("/food-in-30-min/:pincode", GetFoodIn30Min);
router.get("/search/:pincode", SearchFood);
router.get("/restaurant/:id", RestaurantById);

export { router as ShoppingRoute };
