import { Prisma } from "prisma-binding";
import { IComment, IUser } from "./interfaces";

const prisma = new Prisma({
    /*
    This file is initially configured via the .graphqlconfig file you need to write
    that tells prisma where to store the typeDefs.
    */
    typeDefs: "src/generated/prisma.graphql",
    // if your on windows you have to provide the IP address for the endpoint.
    endpoint: "http://192.168.99.100:4466/"
});

// @ts-ignore
prisma.query.users(null, "{ id name email posts { id title body } }").then((data: IUser) => {
    console.log(JSON.stringify(data, undefined, 2));
});

// @ts-ignore
prisma.query.comments(null, "{ id text author { id name } }").then((data: IComment) => {
    console.log(JSON.stringify(data, undefined, 2));
});
