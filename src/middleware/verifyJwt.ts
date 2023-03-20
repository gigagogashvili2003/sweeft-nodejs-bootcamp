import { NextFunction, Request, Response } from "express";
import User from "@/models/user/index";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface IRequest extends Request {
  user?: JwtPayload | null;
}

export const verifyJwt = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization)
      return res.status(401).json({ errorMessage: "Token is missing!" });

    const token = authorization?.split(" ")[1] as string;

    const decodedUser = (await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    )) as JwtPayload;

    const { _id: userId, email: userEmail } = decodedUser;

    const user = await User.findOne({ _id: userId, email: userEmail }).select(
      "_id email"
    );

    req.user = user;

    next();
  } catch (err: any) {
    res.status(401).json({ errorMessage: "Invalid Token!", error: err });
  }
};
