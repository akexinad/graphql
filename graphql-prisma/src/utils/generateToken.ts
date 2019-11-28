import jwt from "jsonwebtoken";
import { IBlogUser } from "./../interfaces";
import { JWT_SECRET } from "./jwtSecret";

export function generateToken(userId: IBlogUser["id"]): string {

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1 day" });

  return token;
}
