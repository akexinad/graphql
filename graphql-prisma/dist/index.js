"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
// heroku will inject an environment variable which exists on heroku, and there is only accessible from heroku.
server_1.server.start({ port: process.env.PORT || 4000 }, () => {
    console.log(`Server is running on ${process.env.PORT ? process.env.PORT : "http://localhost:4000"}`);
});
//# sourceMappingURL=index.js.map