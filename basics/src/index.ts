import { GraphQLServer, PubSub } from "graphql-yoga";
import { db } from "./db";
import { Comment } from "./resolvers/Comment";
import { Mutation } from "./resolvers/Mutation";
import { Post } from "./resolvers/Post";
import { Query } from "./resolvers/Query";
import { Subscription } from "./resolvers/Subscription";
import { User } from "./resolvers/User";

// To build the API, we need 2 things:
    // 1. TYPE DEFINITIONS.
        // This is the APPLICATION SCHEMA, the entities/model that we will be using.
    // 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.

const pubsub = new PubSub();

const server: GraphQLServer = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: {
        Comment,
        Mutation,
        Post,
        Query,
        User,
        Subscription
    },
    context: {
        db,
        pubsub
    }
});

server.start(() => {
    console.log("Server is running on http://localhost:4000");
});
