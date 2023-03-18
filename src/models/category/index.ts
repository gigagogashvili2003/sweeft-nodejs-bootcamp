import { Model, model, Query, Schema, Types } from "mongoose";
import {
  ICategory,
  ICategoryModel,
  IIncome,
  IOutcome,
  IUpdateManyResponse,
} from "./types";
import User from "@/models/user/index";

const categorySchema = new Schema<ICategory, ICategoryModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: Types.ObjectId,
      ref: "User",
    },

    incomes: [
      {
        description: {
          type: String,
          required: true,
        },

        total: {
          type: Number,
          required: true,
        },
      },
    ],

    outcomes: [
      {
        description: {
          type: String,
          required: true,
        },

        total: {
          type: Number,
          required: true,
        },

        status: {
          type: String,
          enum: ["Processing", "Completed", "Rejected"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// add, remove, rename, addincomes,addoutcomes logic.

categorySchema.static(
  "createCategory",
  async function (categoryName: string, userId: Types.ObjectId) {
    try {
      const newCategory: ICategory = await this.create({
        name: categoryName,
        userId,
      });

      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { categories: newCategory._id } }
      );

      return newCategory;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

categorySchema.static(
  "renameCategory",
  async function (categoryId: Types.ObjectId, categoryName: string) {
    try {
      const categoryObjectId = new Types.ObjectId(categoryId);

      const renamedCategory: ICategory | null = await this.findOneAndUpdate(
        { _id: categoryObjectId },
        { name: categoryName }
      );

      if (!renamedCategory)
        throw new Error("Category with given id not found!");

      return renamedCategory;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

categorySchema.static(
  "addIncomes",
  async function addIncomes(categoryNames: string[], income: IIncome) {
    try {
      const updatedCategories: IUpdateManyResponse = await this.updateMany(
        { name: { $in: categoryNames } },
        { $push: { incomes: income } }
      );

      if (!updatedCategories.modifiedCount)
        throw new Error("There isn't any category with given names!");

      return updatedCategories;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

categorySchema.static(
  "addOutcomes",
  async function addOutcomes(categoryNames: string[], outcome: IOutcome) {
    try {
      const updatedCategories: IUpdateManyResponse = await this.updateMany(
        { name: { $in: categoryNames } },
        { $push: { outcomes: outcome } }
      );

      if (!updatedCategories.modifiedCount)
        throw new Error("There isn't any category with given names!");

      return updatedCategories;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

// filters,sorts

export default model<ICategory, ICategoryModel>("Category", categorySchema);
