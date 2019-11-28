import bcrypt from "bcryptjs";
import { GraphQLResolveInfo } from "graphql";
import { Context } from "graphql-yoga/dist/types";
import { IAuthPayload, IBlogUser, IBlogUserArgs, IComment, ICommentArgs, IPost, IPostArgs, IUpdateBlogUser, IUpdateComment, IUpdatePost } from "../interfaces";
import { generateToken } from "../utils/generateToken";
import { getUserId } from "../utils/getUserId";
import { hashPassword } from "../utils/hashPassword";

export const Mutation = {
    async createUser(parent: any, args: IBlogUserArgs, { prisma }: Context, info: GraphQLResolveInfo): Promise<IAuthPayload> {

        const creationData = args.data;

        const hashedPassword = await hashPassword(creationData.password);

        const user: IBlogUser = await prisma.mutation.createUser({
            data: {
                ...creationData,
                password: hashedPassword
            }
        });

        const token = generateToken(user.id);

        return {
            user,
            token
        };

    },
    async updateUser(parent: any, args: IUpdateBlogUser, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IBlogUser> {

        const userId = getUserId(request);

        if (typeof args.data.password === "string") {
            args.data.password = await hashPassword(args.data.password);
        }

        if (args) {
            return prisma.mutation.updateUser({
                where: {
                    id: userId
                },
                data: args.data
            }, info);
        }

    },
    async deleteUser(parent: any, args: IBlogUser, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IBlogUser> {

        const userId = getUserId(request);

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info);

    },
    async login(parent: any, args: IBlogUserArgs, { prisma }: Context, info: GraphQLResolveInfo): Promise<IAuthPayload> {

        const loginData = args.data;

        const existingUser: IBlogUser = await prisma.query.user({
            where: {
                email: loginData.email
            }
        });

        if (!existingUser) {
            throw new Error("403: Unable to login");
        }

        const isMatch = await bcrypt.compare(loginData.password, existingUser.password);

        if (!isMatch) {
            throw new Error("403: Unable to login");
        }

        const jwtToken = generateToken(existingUser.id);

        return {
            user: existingUser,
            token: jwtToken
        };

    },
    async createPost(parent: any, args: IPostArgs, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IPost> {

        const userId = getUserId(request);

        const creationData = args.data;

        return prisma.mutation.createPost({
            data: {
                title: creationData.title,
                body: creationData.body,
                published: creationData.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info);

    },
    async updatePost(parent: any, args: IUpdatePost, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IPost> {

        const updateData = args.data;

        const userId = getUserId(request);

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!postExists) {
            throw new Error("404: Unable to find post!");
        }

        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        });

        if (isPublished && updateData.published === false) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            });
        }

        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: updateData
        }, info);

    },
    async deletePost(parent: any, args: IPost, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IPost> {

        const userId = getUserId(request);

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!postExists) {
            throw new Error("400: Unable to delete post.");
        }

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info);

    },
    async createComment(parent: any, args: ICommentArgs, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IComment> {

        const creationData = args.data;

        const userId = getUserId(request);

        const publishedPost = await prisma.exists.Post({
            id: creationData.post,
            published: true
        });

        if (!publishedPost) {
            throw new Error("404: Post not found!");
        }

        return prisma.mutation.createComment({
            data: {
                text: creationData.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: creationData.post
                    }
                }
            }
        }, info);

    },
    async updateComment(parent: any, args: IUpdateComment, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IComment> {

        const updateData = args.data;

        const userId = getUserId(request);

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!commentExists) {
            throw new Error("400: Unable to update comment.");
        }

        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: {
                text: updateData.text
            }
        }, info);

    },
    async deleteComment(parent: any, args: IComment, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IComment> {

        const userId = getUserId(request);

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!commentExists) {
            throw new Error("400: Unable to delete comment.");
        }

        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info);

    }
};
