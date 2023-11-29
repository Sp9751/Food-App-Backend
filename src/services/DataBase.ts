import mongoose from "mongoose";
import { MONGO_URI } from "../conig";

export default async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database Connected");
  } catch (ex) {
    console.log(ex);
  }
};
