import { IRequest } from "@/middleware/verifyJwt";
import { Response } from "express";
import Category from "@/models/category/index";
import {
  ICategoriesQueryParams,
  IIncome,
  IOutcome,
  IOutcomesQueryParams,
} from "@/models/category/types";

export const createCategory = async (req: IRequest, res: Response) => {
  try {
    const { categoryName } = req.body;
    const user = req.user;

    if (!user)
      return res.status(401).json({ errorMessage: "User not authenticated!" });

    await Category.createCategory(categoryName, user._id);

    res.status(200).json({ message: `New category created succesfully!` });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const deleteCategory = async (req: IRequest, res: Response) => {
  try {
    const { categoryName } = req.body;
    const user = req.user;

    if (!user)
      return res.status(401).json({ errorMessage: "User not authenticated!" });

    await Category.deleteCategory(categoryName, user._id);

    res.status(200).json({ message: `Category deleted succesfully!` });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const renameCategory = async (req: IRequest, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { categoryName } = req.body;
    const user = req.user;

    if (!user)
      return res.status(401).json({ errorMessage: "User not authenticated!" });

    await Category.renameCategory(categoryId, categoryName, user._id);

    res.status(200).json({ message: "Category renamed succesfully!" });
  } catch (err: any) {
    res.status(401).json({ errorMessage: err.message });
  }
};

export const addIncomes = async (req: IRequest, res: Response) => {
  try {
    const categoryNames: string[] = req.body.categoryNames;
    const income: IIncome = req.body.income;
    const user = req.user;
    const currentTime = new Date();
    const transformedIncome: IIncome = { ...income, createdAt: currentTime };

    if (!user)
      return res.status(401).json({ errorMessage: "User not authenticated!" });

    const customMessage = await Category.addIncomes(
      categoryNames,
      transformedIncome,
      user._id
    );

    res.status(200).json({ message: customMessage });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const addOutcomes = async (req: IRequest, res: Response) => {
  try {
    const categoryNames: string[] = req.body.categoryNames;
    const outcome: IOutcome = req.body.outcome;
    const user = req.user;
    const currentTime = new Date();
    const transformedOutcome: IOutcome = { ...outcome, createdAt: currentTime };

    if (!user)
      return res.status(401).json({ errorMessage: "User not authenticated!" });

    const customMessage = await Category.addOutcomes(
      categoryNames,
      transformedOutcome,
      user._id
    );

    res.status(200).json({ message: customMessage });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const getCategories = async (req: IRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user)
      return res.status(401).json({ errorMessage: "User not authenticated!" });

    const queryParams: ICategoriesQueryParams = req.query;

    const filteredCategories = await Category.getCategories(
      queryParams,
      user._id
    );

    res
      .status(200)
      .json({ message: "Filtered succesfully", filteredCategories });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};

export const getOutcomes = async (req: IRequest, res: Response) => {
  try {
    const queryParams: IOutcomesQueryParams = req.query;
    const user = req.user;

    if (!user)
      return res.status(401).json({ errorMessage: "User not authenticated!" });

    const filteredOutcomes = await Category.getOutcomes(queryParams, user._id);
    res
      .status(200)
      .json({ message: "Filtered succesfully", outcomes: filteredOutcomes });
  } catch (err: any) {
    res.status(400).json({ errorMessage: err.message });
  }
};
