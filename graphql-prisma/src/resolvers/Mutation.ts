import bcrypt from "bcryptjs";

import { IBlogUser, IComment, ICommentArgs, IGraphQLContext, IPost, IPostArgs, IUpdateComment, IUpdatePost, IUpdateUser, IUserArgs } from "../interfaces";

import { GraphQLResolveInfo } from "graphql";

export const Mutation = {
    async createUser(parent: any, args: IUserArgs, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IBlogUser> {

        const creationData = args.data;

        if (creationData.password.length < 8) {
            throw new Error("Password must be 8 characters or longer.");
        }

        const hashedPassword = await bcrypt.hash(creationData.password, 10);

        return prisma.mutation.createUser({
            data: {
                ...creationData,
                password: hashedPassword
            }
        }, info);

    },
    async updateUser(parent: any, args: IUpdateUser, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IBlogUser> {

        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info);

    },
    async deleteUser(parent: any, args: IBlogUser, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IBlogUser> {

        const userExists = await prisma.exists.User({
            id: args.id
        });

        if (!userExists) {
            throw new Error("404: User not found");
        }

        const deletedUser = await prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info);

        return deletedUser;

    },
    async createPost(parent: any, args: IPostArgs, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IPost> {

        const creationData = args.data;

        return prisma.mutation.createPost({
            data: {
                title: creationData.title,
                body: creationData.body,
                published: creationData.published,
                author: {
                    connect: {
                        id: creationData.author
                    }
                }
            }
        }, info);

    },
    async updatePost(parent: any, args: IUpdatePost, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IPost> {

        const updateData = args.data;

        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: updateData
        }, info);

    },
    async deletePost(parent: any, args: IPost, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IPost> {

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info);

    },
    async createComment(parent: any, args: ICommentArgs, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IComment> {

        const creationData = args.data;

        return prisma.mutation.createComment({
            data: {
                text: creationData.text,
                author: {
                    connect: {
                        id: creationData.author
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
    async updateComment(parent: any, args: IUpdateComment, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IComment> {

        const updateData = args.data;

        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: {
                text: updateData.text
            }
        }, info);

    },
    async deleteComment(parent: any, args: IComment, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IComment> {

        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info);

    }
};
