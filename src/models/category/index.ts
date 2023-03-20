import { Model, model, Query, Schema, Types } from "mongoose";
import {
  ICategoriesQueryParams,
  ICategory,
  ICategoryModel,
  IIncome,
  IOutcome,
  IOutcomesQueryParams,
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

        createdAt: {
          type: Date,
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

      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { categories: newCategory._id } }
      );

      if (!user) throw new Error("User not found!");
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
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

categorySchema.static(
  "addOutcomes",
  async function addOutcomes(
    categoryNames: string[],
    outcome: IOutcome,
    userId: Types.ObjectId
  ) {
    try {
      const updatedCategories: IUpdateManyResponse = await this.updateMany(
        { userId, name: { $in: categoryNames } },
        { $push: { outcomes: outcome } }
      );

      console.log(updatedCategories);

      if (!updatedCategories.modifiedCount)
        throw new Error("There isn't any category with given names!");
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

// filters,sorts

categorySchema.static(
  "getCategories",
  async function getCategories(
    params: ICategoriesQueryParams,
    userId: Types.ObjectId
  ) {
    try {
      const { categoryName, startDate, endDate, sortDirection, sortProperty } =
        params;

      const filterOptions: Record<string, any> = {};
      let sortOptions: Record<string, any> = {};

      if (sortProperty && sortDirection) {
        sortOptions[sortProperty] = sortDirection;
      }

      if (userId) filterOptions.userId = userId;

      if (categoryName) {
        filterOptions.name = categoryName;
      }

      if (startDate) {
        filterOptions.createdAt = { $gte: startDate };
      }

      if (endDate) {
        if (!startDate) filterOptions.createdAt = {};
        filterOptions.createdAt.$lte = new Date(endDate as string | number);
      }

      const filteredCategories: any = await this.find(filterOptions).sort(
        sortOptions
      );

      return filteredCategories;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

categorySchema.static(
  "getOutcomes",
  async function getOutcomes(
    params: IOutcomesQueryParams,
    userId: Types.ObjectId
  ) {
    try {
      const { startDate, endDate, status, total, sortProperty, sortDirection } =
        params;
      const filterOptions: Record<string, any> = {};
      let sortOptions: Record<string, any> = {};

      if (userId) filterOptions.userId = userId;

      if (sortProperty && sortDirection) {
        sortOptions[`outcomes.${sortProperty}`] = sortDirection;
      }

      if (status) {
        filterOptions["outcomes.status"] = status;
      }

      if (total) filterOptions["outcomes.total"] = total;

      if (startDate) {
        filterOptions["outcomes.createdAt"] = {
          $gte: new Date(startDate as string | number),
        };
      }

      if (endDate) {
        filterOptions["outcomes.createdAt"] = {
          $lte: new Date(endDate as string | number),
        };
      }

      const filteredOutcomes: any = await this.find(filterOptions)
        .sort(sortOptions)
        .select("outcomes");

      // const outcomes = filteredOutcomes.reduce((acc: any, outcome: any) => {
      //   const filtered = outcome.outcomes.filter(
      //     (item: any) => status && item.satus === "Completed"
      //   );

      //   return [...acc, ...filtered];
      // }, []);

      return filteredOutcomes;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

export default model<ICategory, ICategoryModel>("Category", categorySchema);
