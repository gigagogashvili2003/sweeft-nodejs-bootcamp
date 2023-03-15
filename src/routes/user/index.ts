import {
  login,
  resetPassword,
  resetPasswordInstructions,
  signup,
} from "@/controllers/user";
import { Router } from "express";
import { body, param } from "express-validator";

const router = Router();

router.post(
  "/signup",
  //   Validations
  body("email")
    .trim()
    .isEmail()
    .withMessage("You have to specify correct email address!"),
  body("password")
    .trim()
    .isStrongPassword()
    .withMessage("Password isn't strong enough!"),
  signup
);

router.post(
  "/login",
  //   Validations
  body("email").notEmpty().withMessage("Email address missing!"),
  body("password").notEmpty().withMessage("Password missing!"),
  login
);

router.post(
  "/reset-password",
  //   Validations
  body("email").notEmpty().withMessage("Email address missing!"),
  body("password").notEmpty().withMessage("Password missing!"),
  resetPasswordInstructions
);

router.post(
  "/reset-password/:resetPasswordToken",
  // Validations,
  param("resetPasswordToken").notEmpty(),
  body("password")
    .trim()
    .isStrongPassword()
    .withMessage("Password isn't strong enough!"),
  resetPassword
);

export default router;
