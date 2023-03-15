import jwt from "jsonwebtoken";
import { Types } from "mongoose";
interface jwtPayload {
  email: string;
  _id: Types.ObjectId;
}

export const signJWT = (payload: jwtPayload): string => {
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) throw new Error("JWT secret key is missing!");
  const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });

  return token;
};
