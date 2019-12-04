"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_binding_1 = require("prisma-binding");
const Comment_1 = require("./Comment");
const Mutation_1 = require("./Mutation");
const Post_1 = require("./Post");
const Query_1 = require("./Query");
const Subscription_1 = require("./Subscription");
const User_1 = require("./User");
exports.resolvers = {
    Comment: Comment_1.Comment,
    Mutation: Mutation_1.Mutation,
    Post: Post_1.Post,
    Query: Query_1.Query,
    Subscription: Subscription_1.Subscription,
    User: User_1.User
};
exports.fragmentReplacements = prisma_binding_1.extractFragmentReplacements(exports.resolvers);
//# sourceMappingURL=index.js.map