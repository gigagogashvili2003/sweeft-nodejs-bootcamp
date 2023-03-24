import { model, Schema, Types } from "mongoose";
import {
  ICategoriesQueryParams,
  ICategory,
  ICategoryModel,
  IIncome,
  IIncomesQueryParams,
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
        createdAt: {
          type: Date,
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

// Every user should have default category when registers!
categorySchema.index({ name: 1, userId: 1 }, { unique: true });

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

      return newCategory;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

categorySchema.static(
  "deleteCategory",
  async function (categoryName: string, userId: Types.ObjectId) {
    try {
      const category = await this.findOneAndDelete({
        userId,
        name: categoryName,
      });

      const user = await User.findOne({ _id: userId });
      const defaultCategory = await this.findOne({ userId, name: "default" });
      if (!user) throw new Error("User not found!");

      if (!category) throw new Error("Category with given name not found!");

      user.categories = user.categories.filter(
        (item) => item.toString() !== category._id.toString()
      );

      if (defaultCategory) {
        defaultCategory.incomes = defaultCategory.incomes.concat(
          category.incomes
        );
        defaultCategory.outcomes = defaultCategory.outcomes.concat(
          category.outcomes
        );
      } else {
        throw new Error("Some unexcpected error occur!");
      }

      await user.save();
      await defaultCategory?.save();
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

categorySchema.static(
  "renameCategory",
  async function (
    categoryId: Types.ObjectId,
    categoryName: string,
    userId: Types.ObjectId
  ) {
    try {
      const categoryObjectId = new Types.ObjectId(categoryId);

      const renamedCategory: ICategory | null = await this.findOneAndUpdate(
        { userId, _id: categoryObjectId },
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
  async function addIncomes(
    categoryNames: string[],
    income: IIncome,
    userId: Types.ObjectId
  ) {
    try {
      let customMessage: string = "";

      if (!categoryNames?.length) {
        categoryNames = ["default"];
        customMessage =
          "Cause you didn't provide us the name of the category, we inserted income in default category!";
      }

      const updatedCategories: IUpdateManyResponse = await this.updateMany(
        { userId, name: { $in: categoryNames } },
        { $push: { incomes: income } }
      );

      if (!updatedCategories.modifiedCount)
        throw new Error("There isn't any category with given names!");

      return customMessage || "Income added succesfully!";
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
      let customMessage: string = "";

      if (!categoryNames?.length) {
        categoryNames = ["default"];
        customMessage =
          "Cause you didn't provide us the name of the category, we inserted outcome in default category!";
      }

      const updatedCategories: IUpdateManyResponse = await this.updateMany(
        { userId, name: { $in: categoryNames } },
        { $push: { outcomes: outcome } }
      );

      if (!updatedCategories.modifiedCount)
        throw new Error("There isn't any category with given names!");

      return customMessage || "Outcome added succesfully!";
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

      if (categoryName) {
        filterOptions.name = categoryName;
      }

      if (startDate) {
        filterOptions.createdAt = { $gte: startDate };
      }

      if (endDate) {
        filterOptions.createdAt.$lte = new Date(endDate);
      }

      const filteredCategories: any = await this.find({
        userId,
        ...filterOptions,
      }).sort(sortOptions);

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
      const {
        startDate,
        endDate,
        status,
        totalFrom,
        totalTo,
        sortProperty,
        sortDirection,
      } = params;
      const filterOptions: Record<string, any> = {};
      let sortOptions: Record<string, any> = {};

      if (sortProperty && sortDirection) {
        sortOptions[`outcomes.${sortProperty}`] = Number(sortDirection);
      }

      if (status) {
        filterOptions["outcomes.status"] = status;
      }

      if (totalFrom)
        filterOptions["outcomes.total"] = { $gte: Number(totalFrom) };

      if (totalTo) filterOptions["outcomes.total"] = { $lte: Number(totalTo) };

      if (startDate) {
        filterOptions["outcomes.createdAt"] = {
          $gte: new Date(startDate),
        };
      }

      if (endDate) {
        filterOptions["outcomes.createdAt"] = {
          $lte: new Date(endDate),
        };
      }

      const filteredOutcomes: any = await this.aggregate([
        { $match: { userId: userId } },
        { $unwind: "$outcomes" },
        { $match: filterOptions },
        {
          $sort: Object.keys(sortOptions).length
            ? sortOptions
            : { "outcomes.total": -1 },
        },
        { $group: { _id: "$_id", filteredOutcomes: { $push: "$outcomes" } } },
        { $project: { _id: 1, filteredOutcomes: 1 } },
      ]);

      return filteredOutcomes;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

categorySchema.static(
  "getIncomes",
  async function getIncomes(
    params: IIncomesQueryParams,
    userId: Types.ObjectId
  ) {
    try {
      const {
        startDate,
        endDate,

        sortProperty,
        sortDirection,
        totalFrom,
        totalTo,
      } = params;
      const filterOptions: Record<string, any> = {};
      let sortOptions: Record<string, any> = {};

      if (sortProperty && sortDirection) {
        sortOptions[`incomes.${sortProperty}`] = Number(sortDirection);
      }

      if (totalFrom)
        filterOptions["incomes.total"] = { $gte: Number(totalFrom) };

      if (totalTo) filterOptions["incomes.total"] = { $lte: Number(totalTo) };

      if (startDate) {
        filterOptions["incomes.createdAt"] = {
          $gte: new Date(startDate),
        };
      }

      if (endDate) {
        filterOptions["incomes.createdAt"] = {
          $lte: new Date(endDate),
        };
      }

      const filteredIncomes: any = await this.aggregate([
        { $match: { userId: userId } },
        { $unwind: "$incomes" },
        { $match: filterOptions },
        {
          $sort: Object.keys(sortOptions).length
            ? sortOptions
            : { "incomes.total": 1 },
        },
        { $group: { _id: "$_id", filteredIncomes: { $push: "$incomes" } } },
        { $project: { _id: 1, filteredIncomes: 1 } },
      ]);

      return filteredIncomes;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

export default model<ICategory, ICategoryModel>("Category", categorySchema);
