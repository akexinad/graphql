import { ContextParameters } from "graphql-yoga/dist/types";
import jwt from "jsonwebtoken";
import { IBlogUser, IJWTPayload } from "../interfaces";
import { JWT_SECRET } from "./jwtSecret";

export const getUserId = (request: ContextParameters, requireAuth = true): IBlogUser["id"] => {

    const authHeader = request.request.headers.authorization;

    if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        // @ts-ignore
        const decoded: IJWTPayload = jwt.verify(token, JWT_SECRET);

        return decoded.userId;
    }

    // We can set requireAuth to false for queries where authentication is not necessary.

    if (requireAuth) {
        throw new Error("Authentication Required");
    }

    return null;
};
