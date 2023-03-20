import { signJWT } from "@/utils/jwt";
import { Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/user";
import { IRequest } from "@/middleware/verifyJwt";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    await User.signup(email, password);

    res.status(200).json({
      message: "Account created succesfully, please sign in to the account!",
    });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);
    const token = signJWT({ email: user.email, _id: user._id });

    res.status(200).json({
      message: "You have logged in succesfully",
      userInfo: user,
      token,
    });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const resetPasswordInstructions = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  try {
    const user = await User.resetPasswordInstructions(email);
    const token = signJWT({ email: user.email, _id: user._id });

    await User.findOneAndUpdate({ email }, { resetPasswordToken: token });

    // Send mail

    res
      .status(200)
      .json({ message: "Password reset instructions has sent on email!" });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  try {
    const decodedToken = jwt.verify(
      resetPasswordToken,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    await User.resetPassword(decodedToken.email, password);

    res.status(200).json({
      message:
        "Password has been updated succesfully!, Login account with the new password!",
    });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};
