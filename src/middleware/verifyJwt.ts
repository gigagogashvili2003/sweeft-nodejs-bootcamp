import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface IRequest extends Request {
  user?: JwtPayload;
}

export const verifyJwt = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) res.status(401).json({ errorMessage: "Token is missing!" });

  const token = authHeader?.split(" ")[1] as string;

  try {
    const decodedUser = (await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    )) as JwtPayload;
    req.user = decodedUser;
    next();
  } catch (err: any) {
    res.status(401).json({ errorMessage: "Invalid Token!", error: err });
  }
};
