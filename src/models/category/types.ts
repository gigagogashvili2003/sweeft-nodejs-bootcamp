import { Model, Types } from "mongoose";

export type IOutcomeStatus = "Processing" | "Completed" | "Rejected";

export interface IIncome {
  description: string;
  total: number;
}

export interface IOutcome extends IIncome {
  status: IOutcomeStatus;
}

export interface ICategory extends Document {
  name: string;
  userId?: Types.ObjectId;
  _id: Types.ObjectId;
  incomes: IIncome[];
  outcomes: IOutcome[];
}

export interface IUpdateManyResponse {
  acknowledged: boolean;
  insertedId?: null | Types.ObjectId;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
}

export interface ICategoryModel extends Model<ICategory> {
  createCategory(
    categoryName: string,
    userId: Types.ObjectId
  ): Promise<ICategory>;

  renameCategory(categoryId: string, categoryName: string): Promise<ICategory>;
  addIncomes(categoryNames: string[], income: IIncome): Promise<ICategory>;
  addOutcomes(categoryNames: string[], outcome: IOutcome): Promise<ICategory>;
}
