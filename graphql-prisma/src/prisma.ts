import { Prisma } from "prisma-binding";
import { fragmentReplacements } from "../src/resolvers/index";

const prisma = new Prisma({
    /*
    This file is initially configured via the .graphqlconfig file that you
    need to write, telling prisma where to store the typeDefs.
    */
    typeDefs: "src/generated/prisma.graphql",
    // if your on windows you have to provide the IP address for the endpoint.
    endpoint: process.env.PRISMA_ENDPOINT,
    // endpoint: "http://localhost:4466/blog/dev",
    secret: "578b6e1g76ebg4ertbgy7edg4berby7bgwe",
    fragmentReplacements
});

export default prisma;
