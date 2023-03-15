import { signJWT } from "@/utils/jwt";
import { Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/user";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.signup(email, password);
    const token = signJWT({ email: user.email, _id: user._id });

    res.status(200).json({ message: "Account created succesfully!", token });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.login(email, password);
    const token = signJWT({ email: user.email, _id: user._id });

    res
      .status(200)
      .json({ message: "You have logged in succesfully", user, token });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const resetPasswordInstructions = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.resetPasswordInstructions(email, password);
    const token = signJWT({ email: user.email, _id: user._id });

    await User.findOneAndUpdate({ email }, { resetPasswordToken: token });

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
