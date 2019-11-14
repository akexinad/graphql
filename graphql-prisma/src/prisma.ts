import { Prisma } from "prisma-binding";

const prisma = new Prisma({
    typeDefs: "./generated/prisma.graphql",
    // if your on windows you have to provide the IP address for the endpoint.
    endpoint: "http://192.168.99.100:4466/"
});
