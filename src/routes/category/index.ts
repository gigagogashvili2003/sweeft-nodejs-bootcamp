import {
  addIncomes,
  createCategory,
  renameCategory,
} from "@/controllers/category";
import { verifyJwt } from "@/middleware/verifyJwt";
import { Router } from "express";
import { body, param } from "express-validator";

const router = Router();

router.post(
  "/new-category",
  verifyJwt,
  //   Validations
  body("categoryName")
    .trim()
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "Category name must be a string, with min 3, max 20 characters!"
    ),
  createCategory
);

router.put(
  "/rename-category/:categoryId",
  verifyJwt,
  // Validations
  body("categoryName")
    .trim()
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "Category name must be a string, with min 3, max 20 characters!"
    ),
  param("categoryId").notEmpty().withMessage("Category id is missing!"),
  renameCategory
);

router.put("/add-incomes/:categoryNames", verifyJwt, addIncomes);

export default router;
