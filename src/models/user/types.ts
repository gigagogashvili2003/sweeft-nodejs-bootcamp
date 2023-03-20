import { Model, ToObjectOptions, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  resetPasswordToken: string | null;
  _id: Types.ObjectId;
  categories: Types.ObjectId[];
  toObject(options?: ToObjectOptions): any;
}

export interface IUserModel extends Model<IUser> {
  signup(email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<IUser>;
  resetPasswordInstructions(email: string): Promise<IUser>;
  resetPassword(token: string, password: string): Promise<void>;
}
