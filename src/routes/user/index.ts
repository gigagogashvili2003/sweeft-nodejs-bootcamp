import {
  login,
  resetPassword,
  resetPasswordInstructions,
  signup,
} from "@/controllers/user";
import { validateData } from "@/middleware/validatons";
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
  validateData,
  signup
);

router.post(
  "/login",
  //   Validations
  body("email").notEmpty().withMessage("Email address missing!"),
  body("password").notEmpty().withMessage("Password missing!"),
  validateData,
  login
);

router.post("/reset-password", validateData, resetPasswordInstructions);

router.put(
  "/reset-password/:resetPasswordToken",
  // Validations,
  param("resetPasswordToken").notEmpty(),
  body("password")
    .trim()
    .isStrongPassword()
    .withMessage("Password isn't strong enough!"),
  validateData,
  resetPassword
);

export default router;
