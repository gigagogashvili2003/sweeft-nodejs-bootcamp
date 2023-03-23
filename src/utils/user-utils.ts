import { IUser } from "@/models/user/types";
import bcrypt from "bcrypt";
export const hashPassword = async (password: string, saltValue = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltValue);

    return await bcrypt.hash(password, salt);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const comparePasswords = async (
  password: string,
  encryptedPassword: string
) => {
  try {
    return await bcrypt.compare(password, encryptedPassword);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const userWithoutSensitiveData = (user: IUser) => {
  const userObjectData = user.toObject();
  delete userObjectData.password;
  delete userObjectData.resetPasswordToken;

  return userObjectData;
};

export const sendLinkWithToken = (token: string) => {
  return `<a href="http://localhost:3000/api/auth/reset-password/${token}">Click link to reset password!</a>`;
};
