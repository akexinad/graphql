import { GraphQLServer, PubSub } from "graphql-yoga";
import { Context, ContextParameters } from "graphql-yoga/dist/types";
import prisma from "./prisma";
import { fragmentReplacements, resolvers } from "./resolvers/index";

// To build the API, we need 2 things:
    // 1. TYPE DEFINITIONS.
        // This is the APPLICATION SCHEMA, the entities/model that we will be using.
    // 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.

const pubsub = new PubSub();

const server: GraphQLServer = new GraphQLServer({
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

// heroku will inject an environment variable which exists on heroku, and there is only accessible from heroku.
server.start({ port: process.env.PORT || 4000 }, () => {
    console.log(`Server is running on ${ process.env.PORT ? process.env.PORT : "http://localhost:4000" }`);
});
