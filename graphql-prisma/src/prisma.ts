import { Prisma } from "prisma-binding";
import { IComment, IPost, IPostForMutation, IUser } from "./interfaces";

const prisma = new Prisma({
    /*
    This file is initially configured via the .graphqlconfig file that you
    need to write, telling prisma where to store the typeDefs.
    */
    typeDefs: "src/generated/prisma.graphql",
    // if your on windows you have to provide the IP address for the endpoint.
    endpoint: "http://192.168.99.100:4466/"
});

// const createPostForUser = async (authorId: IUser["id"], data: IPostForMutation) => {

//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     // @ts-ignore
//     }, "{ id }");

//     const user = await prisma.query.user({
//         where: {
//             id: authorId
//         }
//     // @ts-ignore
//     }, "{ id name email posts { id title published } }");

//     return user;
// };

// createPostForUser("ck2x0udbx004c0796cgot33gr", {
//     title: "ASYNC AWAIT graphql post from prisma",
//     body: "Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine. You don't get sick, I do. That's also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We're on the same curve, just on opposite ends.",
//     published: true,
// }).then((data: IUser) => {
//     console.log(JSON.stringify(data, undefined, 2));
// }).catch((err) => console.error(err));;

const updatePostForUser = async (postId: IPost["id"], data: IPostForMutation) => {

    const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        },
        data
    // @ts-ignore
    }, "{ author { id } }");

    const user = await prisma.query.user({
        where: {
            id: post.author.id
        }
    // @ts-ignore
    }, "{ id name email posts { id title published } }");

    console.log(user);

    return user;
};

updatePostForUser("ck2z6mn3n001e0796dde7r4i1", {
    title: "HELLO WORLDUPDATED ASYNC AWAIT graphql post from prisma",
    published: true,
}).then((data: IUser) => {
    console.log(JSON.stringify(data, undefined, 2));
}).catch((err) => console.error(err));
