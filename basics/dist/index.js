"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const port = Number(process.env.PORT) || 3000;
App_1.default.listen(port, '', 0, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`server is listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map