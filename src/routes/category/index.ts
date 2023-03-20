import {
  addIncomes,
  addOutcomes,
  createCategory,
  renameCategory,
  getOutcomes,
  getCategories,
} from "@/controllers/category";
import { validateData } from "@/middleware/validatons";
import { verifyJwt } from "@/middleware/verifyJwt";
import { arrayOfStringsValidation } from "@/utils/category-utils";
import { Router } from "express";
import { body, param } from "express-validator";

const router = Router();

router.use(verifyJwt);

router.post(
  "/new-category",
  //   Validations
  body("categoryName")
    .trim()
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "Category name must be a string, with min 3, max 20 characters!"
    ),
  validateData,
  createCategory
);

router.put(
  "/rename-category/:categoryId",
  // Validations
  body("categoryName")
    .trim()
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "Category name must be a string, with min 3, max 20 characters!"
    ),
  param("categoryId").notEmpty().withMessage("Category id is missing!"),
  validateData,
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
  validateData,
  addIncomes
);

router.put(
  "/add-outcomes",
  body("categoryNames")
    .isArray()
    .isLength({ min: 1 })
    .withMessage("Categorynames array is empty!")
    .custom(arrayOfStringsValidation),
  body("outcome").isObject(),
  validateData,
  addOutcomes
);

router.get("/get-outcomes", getOutcomes);
router.get("/get-categories", getCategories);

export default router;
