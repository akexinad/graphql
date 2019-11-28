import bcrypt from "bcryptjs";
import { IBlogUser } from "./../interfaces";

export const hashPassword = (password: IBlogUser["password"]) => {

  if (password.length < 8) {
    throw new Error("Password must be 8 characters or longer.");
  }

  const hashedPassword = bcrypt.hash(password, 10);

  return hashedPassword;
};
