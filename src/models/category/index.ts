import { model, Schema, Types } from "mongoose";
import { ICategory, ICategoryModel } from "./types";
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

export default model<ICategory, ICategoryModel>("Category", categorySchema);
