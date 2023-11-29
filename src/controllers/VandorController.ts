import { Request, Response, NextFunction } from "express";
import { EditVandorInput, VandorLoginInput } from "../dto";
import { FindVandor } from "./AdminController";
import { GenerateSignature, validatePassword } from "../utility";
import { createFoodInputs } from "../dto/Food.dto";
import { Food } from "../models";

export const VandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VandorLoginInput>req.body;

  const existingVandor = await FindVandor("", email);

  if (existingVandor !== null) {
    const validation = await validatePassword(
      password,
      existingVandor.password,
      existingVandor.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: existingVandor.id,
        email: existingVandor.email,
        foodTypes: existingVandor.foodType,
        name: existingVandor.name,
      });

      return res.json(signature);
    } else {
      return res.json({ message: "Password is not valid" });
    }
  }

  return res.json({ message: "Login credentail not valid" });
};

export const GetvandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);
    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor Information not found" });
};

export const updatevandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, foodTypes, address, phone } = <EditVandorInput>req.body;

  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);

    if (existingVandor) {
      existingVandor.name = name;
      existingVandor.address = address;
      existingVandor.phone = phone;
      existingVandor.foodType = foodTypes;
    }

    const savedResult = await existingVandor?.save();
    return res.json(savedResult);
  }

  return res.json({ message: "Vandor Information not found" });
};

export const UpdateVandorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vandor = await FindVandor(user._id);

    if (vandor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vandor.coverImage.push(...images);

      const result = await vandor.save();

      return res.json(result);
    }
  }

  return res.json({ message: "something went wrong" });
};

export const updatevandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);

    if (existingVandor) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
      const savedResult = await existingVandor.save();
      return res.json(savedResult);
    }
    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor Information not found" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const { name, description, category, price, readyTime, foodType } = <
      createFoodInputs
    >req.body;

    const vandor = await FindVandor(user._id);

    if (vandor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const createdFood = await Food.create({
        vandorId: vandor._id,
        name: name,
        description: description,
        category: category,
        price: price,
        readyTime: readyTime,
        foodType: foodType,
        images: images,
        rating: 0,
      });

      vandor.foods.push(createdFood);
      const result = await vandor.save();

      return res.json(result);
    }
  }

  return res.json({ message: "something went wrong with Add Food" });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vandorId: user._id });

    if (foods !== null) {
      return res.json(foods);
    }
  }

  return res.json({ message: "Foods information Not found" });
};
