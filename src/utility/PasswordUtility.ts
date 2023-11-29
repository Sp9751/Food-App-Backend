import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { VandorPayload } from "../dto";
import { Secret_Code } from "../conig";
import { AuthPayload } from "../dto/Auth.dto";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, Secret_Code, { expiresIn: "1d" });
};

export const validateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = jwt.verify(
      signature.split(" ")[1],
      Secret_Code
    ) as AuthPayload;

    req.user = payload;

    return true;
  }

  return false;
};
