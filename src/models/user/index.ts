import { model, Schema, Types } from "mongoose";
import { IUser, IUserModel } from "./types";
import { comparePasswords, hashPassword } from "@/utils/user-utils";

export const UserSchema = new Schema<IUser, IUserModel>({
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
    default: null,
    type: String,
    unique: true,
  },

  categories: [{ type: Types.ObjectId, ref: "Category" }],
});

// Static Methods
UserSchema.static(
  "signup",
  async function signup(email: string, password: string) {
    try {
      const emailExists = await this.findOne({ email });
      if (emailExists) throw new Error("Email already exists!");

      const encryptedPassword = await hashPassword(password, 10);

      const user: IUser | null = await this.create({
        email,
        password: encryptedPassword,
      });

      return user;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

UserSchema.static(
  "login",
  async function login(email: string, password: string) {
    try {
      const user: IUser | null = await this.findOne({ email });

      if (!user) throw new Error("User with this email doesn't exists!");

      const passwordsMatch = await comparePasswords(password, user.password);

      if (!passwordsMatch) throw new Error("Invalid Passwrod!");

      return user;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

UserSchema.static(
  "resetPasswordInstructions",
  async function resetPasswordInstructions(email: string, password: string) {
    try {
      const user: IUser | null = await this.findOne({ email });

      if (!user) throw new Error("User with this email doesn't exists!");

      const passwordsMatch = await comparePasswords(password, user.password);

      if (!passwordsMatch) throw new Error("Invalid Passwrod!");

      return user;
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
