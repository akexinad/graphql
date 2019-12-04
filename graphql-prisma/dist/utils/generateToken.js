"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret_1 = require("./jwtSecret");
exports.generateToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, jwtSecret_1.JWT_SECRET, { expiresIn: "1 day" });
    return token;
};
//# sourceMappingURL=generateToken.js.map