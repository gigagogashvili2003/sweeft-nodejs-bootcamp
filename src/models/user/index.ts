import { model, Schema, Types } from "mongoose";
import { IUser, IUserModel } from "./types";
import {
  comparePasswords,
  hashPassword,
  userWithoutSensitiveData,
} from "@/utils/user-utils";

export const UserSchema = new Schema<IUser, IUserModel>(
  {
    email: {
      required: true,
      unique: true,
      type: String,
    },

    password: {
      required: true,
      type: String,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    categories: [{ type: Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

// Static Methods
UserSchema.static(
  "signup",
  async function signup(email: string, password: string) {
    try {
      const emailExists = await this.findOne({ email });
      if (emailExists) throw new Error("Email already exists!");

      const encryptedPassword = await hashPassword(password, 10);

      await this.create({
        email,
        password: encryptedPassword,
      });
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

UserSchema.static(
  "login",
  async function login(email: string, password: string) {
    try {
      const user: IUser | null = await this.findOne({
        email,
      });

      if (!user) throw new Error("User with this email doesn't exists!");

      const passwordsMatch = await comparePasswords(password, user.password);

      if (!passwordsMatch) throw new Error("Invalid Passwrod!");

      const userInfo = userWithoutSensitiveData(user);

      return userInfo;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

UserSchema.static(
  "resetPasswordInstructions",
  async function resetPasswordInstructions(email: string) {
    try {
      const user: IUser | null = await this.findOne({ email });

      if (!user) throw new Error("User with this email doesn't exists!");

      const userInfo = userWithoutSensitiveData(user);

      return userInfo;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

UserSchema.static(
  "resetPassword",
  async function resetPassword(email: string, password: string) {
    try {
      const encryptedPassword = await hashPassword(password);

      const user: IUser | null = await this.findOneAndUpdate(
        { email },
        { resetPasswordToken: null, password: encryptedPassword }
      );

      if (!user) throw new Error("User not found!");
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

export default model<IUser, IUserModel>("User", UserSchema);
