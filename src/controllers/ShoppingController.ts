import express, { Request, Response, NextFunction } from "express";
import { FoodDoc, Vandor } from "../models";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: "Data Not Found" });
};

export const GetTopRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort([["rating", "descending"]])
    .limit(1);

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: "Data Not Found" });
};

export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result.length > 0) {
    let FoodResult: any = [];

    result.map((vandor) => {
      const foods = vandor.foods as [FoodDoc];

      FoodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });

    return res.status(200).json(FoodResult);
  }

  return res.status(400).json({ message: "Data Not Found" });
};

export const SearchFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result.length > 0) {
    let FoodResult: any = [];

    result.map((item) => FoodResult.push(...item.foods));

    return res.status(200).json(FoodResult);
  }

  return res.status(400).json({ message: "Data Not Found" });
};

export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const result = await Vandor.findById(id).populate("foods");

  if (result) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: "Data Not Found" });
};
