import { IRequest } from "@/middleware/verifyJwt";
import { Response } from "express";
import { validationResult } from "express-validator";
import Category from "@/models/category/index";
import { JwtPayload } from "jsonwebtoken";
import { IIncome, IOutcome } from "@/models/category/types";

export const createCategory = async (req: IRequest, res: Response) => {
  const { categoryName } = req.body;
  const user = req.user as JwtPayload;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newCategory = await Category.createCategory(categoryName, user._id);

    res.status(200).json({
      message: `New category created succesfully!`,
      category: newCategory,
    });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const renameCategory = async (req: IRequest, res: Response) => {
  const { categoryId } = req.params;
  const { categoryName } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const renamedCategory = await Category.renameCategory(
      categoryId,
      categoryName
    );

    res
      .status(200)
      .json({ message: "Category updated succesfully!", renamedCategory });
  } catch (err: any) {
    res.status(401).json({ errorMessage: err.message });
  }
};

export const addIncomes = async (req: IRequest, res: Response) => {
  const categoryNames: string[] = req.body.categoryNames;
  const income: IIncome = req.body.income;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedCategories = await Category.addIncomes(categoryNames, income);

    res
      .status(200)
      .json({ message: "Income added to categories!", updatedCategories });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const addOutcomes = async (req: IRequest, res: Response) => {
  const categoryNames: string[] = req.body.categoryNames;
  const outcome: IOutcome = req.body.outcome;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedCategories = await Category.addOutcomes(
      categoryNames,
      outcome
    );

    res
      .status(200)
      .json({ message: "Outcome added to categories!", updatedCategories });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};
