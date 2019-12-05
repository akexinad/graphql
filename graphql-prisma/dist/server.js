"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_yoga_1 = require("graphql-yoga");
const prisma_1 = __importDefault(require("./prisma"));
const index_1 = require("./resolvers/index");
// To build the API, we need 2 things:
// 1. TYPE DEFINITIONS.
// This is the APPLICATION SCHEMA, the entities/model that we will be using.
// 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.
const pubsub = new graphql_yoga_1.PubSub();
exports.server = new graphql_yoga_1.GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: index_1.resolvers,
    context(request) {
        return {
            request,
            prisma: prisma_1.default,
            pubsub
        };
    },
    // @ts-ignore
    fragmentReplacements: index_1.fragmentReplacements
});
//# sourceMappingURL=server.js.map