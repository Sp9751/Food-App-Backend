import express, { Request, Response, NextFunction } from "express";
import {
  AddFood,
  GetFoods,
  GetvandorProfile,
  UpdateVandorCoverImage,
  VandorLogin,
  updatevandorProfile,
  updatevandorService,
} from "../controllers";
import { Authenticate } from "../middlewares";
import multer from "multer";

const router = express.Router();

// C:\Users\dell\Desktop\Food delivery\images

const imagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const images = multer({ storage: imagesStorage }).array("images", 10);

router.post("/login", VandorLogin);

router.use(Authenticate);
router.get("/profile", GetvandorProfile);
router.patch("/profile", updatevandorProfile);
router.patch("/coverimage", images, UpdateVandorCoverImage);
router.patch("/service", updatevandorService);

router.post("/food", images, AddFood);
router.get("/foods", GetFoods);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from VenderRoute" });
});

export { router as VandorRoute };
