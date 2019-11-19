import { Prisma } from "prisma-binding";
import { IBlogUser, IComment, IPost, IPostForMutation } from "./interfaces";

const prisma = new Prisma({
    /*
    This file is initially configured via the .graphqlconfig file that you
    need to write, telling prisma where to store the typeDefs.
    */
    typeDefs: "src/generated/prisma.graphql",
    // if your on windows you have to provide the IP address for the endpoint.
    endpoint: "http://192.168.99.100:4466/blog/dev"
});

export default prisma;

/*

const createPostForUser = async (authorId: IUser["id"], data: IPostForMutation) => {

    const userExists = await prisma.exists.User({
        id: authorId
    });

    if (!userExists) {
        throw new Error("404: User not found!");
    }

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    // @ts-ignore
    }, "{ id author { id name email posts { id title published } } }");

    return post.author;
};

createPostForUser("ck2pvikub000c079606cgnjbn", {
    title: "USER EXISTS AGAIN graphql post from prisma",
    body: "Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine. You don't get sick, I do. That's also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We're on the same curve, just on opposite ends.",
    published: true,
}).then((data: IUser) => {
    console.log(JSON.stringify(data, undefined, 2));
}).catch((err) => console.error(err));

prisma.exists.Comment({
    id: "ck2x0yeoe004t0796le8lhpkr"
}).then((exists) => {
    console.log(exists);
});

const updatePostForUser = async (postId: IPost["id"], data: IPostForMutation) => {

    const postExists = await prisma.exists.Post({
        id: postId
    });

    if (!postExists) {
        throw new Error("404: Post not found!");
    }

    const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        },
        data
    // @ts-ignore
    }, "{ author { id name email posts { id title published } } }");

    return post.author;
};

updatePostForUser("ck2z58obg00080796twv2rkjy", {
    title: "UPDATED POST EXISTS ASYNC AWAIT graphql post from prisma",
    published: false,
}).then((data: IUser) => {
    console.log(JSON.stringify(data, undefined, 2));
}).catch((err) => console.error(err));

*/
