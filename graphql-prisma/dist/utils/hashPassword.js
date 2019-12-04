"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.hashPassword = (password) => {
    if (password.length < 8) {
        throw new Error("Password must be 8 characters or longer.");
    }
    const hashedPassword = bcryptjs_1.default.hash(password, 10);
    return hashedPassword;
};
//# sourceMappingURL=hashPassword.js.map