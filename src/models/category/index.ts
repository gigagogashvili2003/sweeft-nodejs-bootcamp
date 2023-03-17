import { Model, model, Schema, Types } from "mongoose";
import { ICategory, ICategoryModel, IIncome } from "./types";
import User from "@/models/user/index";

const categorySchema = new Schema<ICategory, ICategoryModel>({
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
});

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
  async function addIncomes(categoryNames: string[] | string, income: IIncome) {
    try {
      let categories;

      if (Array.isArray(categoryNames)) {
        categories = await this.updateMany(
          { name: { $in: categoryNames } },
          { $push: { incomes: income } }
        );

        if (!categories.modifiedCount)
          throw new Error("There isn't any category with given names!");
      } else {
        categories = await this.findOneAndUpdate(
          { name: categoryNames },
          { $push: { incomes: income } }
        );
      }

      if (!categories)
        throw new Error("Couldn't found any category with this name!");

      return categories;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

export default model<ICategory, ICategoryModel>("Category", categorySchema);
