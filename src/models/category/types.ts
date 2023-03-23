import { Model, Types } from "mongoose";

export type IOutcomeStatus = "Processing" | "Completed" | "Rejected";
export type SortDirection =
  | "ASC"
  | "asc"
  | "ascending"
  | "ASCENDING"
  | "DESC"
  | "DESCENDING"
  | "descending"
  | "desc"
  | 1
  | -1;
export interface IIncome {
  description: string;
  total: number;
  createdAt: Date;
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

interface TimeStamps {
  startDate?: string | number;
  endDate?: string | number;
}

interface ISort {
  sortProperty?: string;
  sortDirection?: SortDirection;
}

export interface IOutcomesQueryParams extends TimeStamps, ISort {
  status?: IOutcomeStatus;
  total?: number;
}

export interface ICategoriesQueryParams extends TimeStamps, ISort {
  categoryName?: string;
}
export interface ICategoryModel extends Model<ICategory> {
  createCategory(categoryName: string, userId: Types.ObjectId): Promise<void>;
  deleteCategory(categoryName: string, userId: Types.ObjectId): Promise<void>;
  renameCategory(categoryId: string, categoryName: string): Promise<void>;
  addIncomes(
    categoryNames: string[],
    income: IIncome,
    userId: Types.ObjectId
  ): Promise<void>;
  addOutcomes(
    categoryNames: string[],
    outcome: IOutcome,
    userId: Types.ObjectId
  ): Promise<void>;
  getOutcomes(
    queryParams: IOutcomesQueryParams,
    userId: Types.ObjectId
  ): Promise<ICategory>;
  getCategories(
    queryParams: ICategoriesQueryParams,
    userId: Types.ObjectId
  ): Promise<ICategory>;
}
