import { ContextParameters } from "graphql-yoga/dist/types";
import jwt from "jsonwebtoken";
import { IBlogUser, IJWTPayload } from "../interfaces";
import { JWT_SECRET } from "./jwtSecret";

export const getUserId = (request: ContextParameters): IBlogUser["id"] => {

    const authHeader = request.request.headers.authorization;

    if (!authHeader) {
        throw new Error("403: Authentication Required!");
    }

    const token = authHeader.replace("Bearer ", "");

    // @ts-ignore
    const decoded: IJWTPayload = jwt.verify(token, JWT_SECRET);

    return decoded.userId;
};
