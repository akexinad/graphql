"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_binding_1 = require("prisma-binding");
const index_1 = require("../src/resolvers/index");
const prisma = new prisma_binding_1.Prisma({
    /*
    This file is initially configured via the .graphqlconfig file that you
    need to write, telling prisma where to store the typeDefs.
    */
    typeDefs: "src/generated/prisma.graphql",
    // if your on windows you have to provide the IP address for the endpoint.
    endpoint: process.env.PRISMA_ENDPOINT,
    // endpoint: "http://localhost:4466/blog/dev",
    secret: "578b6e1g76ebg4ertbgy7edg4berby7bgwe",
    fragmentReplacements: index_1.fragmentReplacements
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map