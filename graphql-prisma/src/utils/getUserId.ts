import { ContextParameters } from "graphql-yoga/dist/types";
import jwt from "jsonwebtoken";
import { IBlogUser, IJWTPayload } from "../interfaces";
import { JWT_SECRET } from "./jwtSecret";

export const getUserId = (request: ContextParameters, requireAuth = true): IBlogUser["id"] => {

    // The first return result of the ternary operator is for your standard HTTP requests
    // The second return result is for subscriptions that require websocket requests

    const authHeader = request.request ? request.request.headers.authorization : request.connection.context.authorization;

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
