import {
  addIncomes,
  addOutcomes,
  createCategory,
  renameCategory,
  getOutcomes,
  getCategories,
  deleteCategory,
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

router.delete(
  "/delete-category",
  body("categoryName")
    .trim()
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "Category name must be a string, with min 3, max 20 characters!"
    )
    .custom((val) => {
      if (val === "default") {
        throw new Error("You cann't delete default category!");
      }

      return true;
    }),
  validateData,
  deleteCategory
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
    .withMessage(
      "You must provide us an array of category names or name, wich u want to update!"
    ),
  body("income").isObject(),
  validateData,
  addIncomes
);

router.put(
  "/add-outcomes",
  body("categoryNames")
    .isArray()
    .withMessage(
      "You must provide us an array of category names or name, wich u want to update!"
    ),
  body("outcome").isObject(),
  validateData,
  addOutcomes
);

router.get("/get-outcomes", getOutcomes);
router.get("/get-categories", getCategories);

export default router;
