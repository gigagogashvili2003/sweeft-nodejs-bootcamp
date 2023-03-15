import { Model, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  resetPasswordToken: string | null;
  _id: Types.ObjectId;
}

export interface IUserModel extends Model<IUser> {
  signup(email: string, password: string): Promise<IUser>;
  login(email: string, password: string): Promise<IUser>;
  resetPasswordInstructions(email: string, password: string): Promise<IUser>;
  resetPassword(token: string, password: string): Promise<void>;
}
