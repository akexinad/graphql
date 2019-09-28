"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class App {
    constructor() {
        this.express = express_1.default();
        this.mountRoutes();
    }
    mountRoutes() {
        const router = express_1.default.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello There!'
            });
        });
        this.express.use('/', router);
    }
}
exports.default = new App().express;
let x;
//# sourceMappingURL=app.js.map