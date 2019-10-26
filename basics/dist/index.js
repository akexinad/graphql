"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_yoga_1 = require("graphql-yoga");
const db_1 = require("./db");
const Comment_1 = require("./resolvers/Comment");
const Mutation_1 = require("./resolvers/Mutation");
const Post_1 = require("./resolvers/Post");
const Query_1 = require("./resolvers/Query");
const User_1 = require("./resolvers/User");
// To build the API, we need 2 things:
// 1. TYPE DEFINITIONS.
// This is the APPLICATION SCHEMA, the entities/model that we will be using.
// 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.
const server = new graphql_yoga_1.GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: {
        Comment: Comment_1.Comment,
        Mutation: Mutation_1.Mutation,
        Post: Post_1.Post,
        Query: Query_1.Query,
        User: User_1.User
    },
    context: {
        users: db_1.users,
        posts: db_1.posts,
        comments: db_1.comments
    }
});
server.start(() => {
    console.log("Server is running on http://localhost:4000");
});
//# sourceMappingURL=index.js.map