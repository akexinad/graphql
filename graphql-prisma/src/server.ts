import { GraphQLServer, PubSub } from "graphql-yoga";
import { Context, ContextParameters } from "graphql-yoga/dist/types";
import prisma from "./prisma";
import { fragmentReplacements, resolvers } from "./resolvers/index";

// To build the API, we need 2 things:
    // 1. TYPE DEFINITIONS.
        // This is the APPLICATION SCHEMA, the entities/model that we will be using.
    // 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.

const pubsub = new PubSub();

export const server: GraphQLServer = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context(request: ContextParameters): Context {
        return {
            request,
            prisma,
            pubsub
        };
    },
    // @ts-ignore
    fragmentReplacements
});
