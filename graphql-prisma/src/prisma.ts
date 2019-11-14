import { Prisma } from "prisma-binding";
import { IComment, IPost, IUser } from "./interfaces";

const prisma = new Prisma({
    /*
    This file is initially configured via the .graphqlconfig file that you
    need to write, telling prisma where to store the typeDefs.
    */
    typeDefs: "src/generated/prisma.graphql",
    // if your on windows you have to provide the IP address for the endpoint.
    endpoint: "http://192.168.99.100:4466/"
});

// @ts-ignore
// prisma.query.users(null, "{ id name email posts { id title body } }").then((data: IUser) => {
//     console.log(JSON.stringify(data, undefined, 2));
// });

// @ts-ignore
// prisma.query.comments(null, "{ id text author { id name } }").then((data: IComment) => {
//     console.log(JSON.stringify(data, undefined, 2));
// });

prisma.mutation.createPost({
    data: {
        title: "ANOTHER graphql post from prisma",
        body: "Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine. You don't get sick, I do. That's also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We're on the same curve, just on opposite ends.",
        published: true,
        author: {
            connect: {
                id: "ck2wzinzs001i0796l2ahagca"
            }
        }
    }
    // @ts-ignore
}, "{ id title body published author { id name email } }").then((data: IPost) => {
    console.log(JSON.stringify(data, undefined, 2));

    // @ts-ignore
    return prisma.query.users(null, "{ id name email posts { id title } }");
}).then((data: IUser) => {
    console.log(JSON.stringify(data, undefined, 2));

    return prisma.mutation.updatePost({
        where: {
            id: "ck2z5fk0g000r0796wnrqaumm"
        },
        data: {
            title: "UPDATED graphql post from prisma",
            published: false
        }
    })
    .then((data: IPost) => {
        console.log(JSON.stringify(data, undefined, 2));
    });
});
