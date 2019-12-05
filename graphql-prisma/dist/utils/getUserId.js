"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret_1 = require("./jwtSecret");
exports.getUserId = (request, requireAuth = true) => {
    // The first return result of the ternary operator is for your standard HTTP requests
    // The second return result is for subscriptions that require websocket requests
    const authHeader = request.request ? request.request.headers.authorization : request.connection.context.authorization;
    if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        // @ts-ignore
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret_1.JWT_SECRET);
        return decoded.userId;
    }
    // We can set requireAuth to false for queries where authentication is not necessary.
    if (requireAuth) {
        throw new Error("Authentication Required");
    }
    return null;
};
//# sourceMappingURL=getUserId.js.map