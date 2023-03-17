import { JwtPayload } from "jsonwebtoken";
import { Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  userId?: Types.ObjectId;
  _id: Types.ObjectId;
}

export interface ICategoryModel extends Model<ICategory> {
  createCategory(
    categoryName: string,
    userId: Types.ObjectId
  ): Promise<ICategory>;

  renameCategory(categoryId: string, categoryName: string): Promise<ICategory>;
}
