import {
  addIncomes,
  addOutcomes,
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

router.put(
  "/add-incomes",
  body("categoryNames")
    .isArray()
    .isLength({ min: 1 })
    .withMessage("Categorynames array is empty!")
    .custom((val) => {
      if (!Array.isArray(val))
        throw new Error("Categorynames have to be an array!");

      if (!val.length) throw new Error("Categorynames Array is empty!");

      const isEveryElString = val.every((el) => typeof el === "string");

      if (!isEveryElString) {
        throw new Error(
          "Categorynames array should only icnlude strings in it!"
        );
      }

      return true;
    }),
  body("income").isObject(),
  verifyJwt,
  addIncomes
);

router.put("/add-outcomes", verifyJwt, addOutcomes);

export default router;
