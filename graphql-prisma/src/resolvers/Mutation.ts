import bcrypt from "bcryptjs";
import { GraphQLResolveInfo } from "graphql";
import { Context } from "graphql-yoga/dist/types";
import jwt from "jsonwebtoken";
import { IAuthPayload, IBlogUser, IBlogUserArgs, IComment, ICommentArgs, IPost, IPostArgs, IUpdateBlogUser, IUpdateComment, IUpdatePost } from "../interfaces";
import { getUserId } from "../utils/getUserId";
import { JWT_SECRET } from "../utils/jwtSecret";

export const Mutation = {
    async createUser(parent: any, args: IBlogUserArgs, { prisma }: Context, info: GraphQLResolveInfo): Promise<IAuthPayload> {

        const creationData = args.data;

        if (creationData.password.length < 8) {
            throw new Error("Password must be 8 characters or longer.");
        }

        const hashedPassword = await bcrypt.hash(creationData.password, 10);

        const user: IBlogUser = await prisma.mutation.createUser({
            data: {
                ...creationData,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        return {
            user,
            token
        };

    },
    async updateUser(parent: any, args: IUpdateBlogUser, { prisma }: Context, info: GraphQLResolveInfo): Promise<IBlogUser> {

        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info);

    },
    async deleteUser(parent: any, args: IBlogUser, { prisma }: Context, info: GraphQLResolveInfo): Promise<IBlogUser> {

        const deletedUser = await prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info);

        return deletedUser;

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

        const jwtToken = jwt.sign({ userId: existingUser.id }, JWT_SECRET);

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
    async updatePost(parent: any, args: IUpdatePost, { prisma }: Context, info: GraphQLResolveInfo): Promise<IPost> {

        const updateData = args.data;

        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: updateData
        }, info);

    },
    async deletePost(parent: any, args: IPost, { prisma }: Context, info: GraphQLResolveInfo): Promise<IPost> {

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info);

    },
    async createComment(parent: any, args: ICommentArgs, { prisma }: Context, info: GraphQLResolveInfo): Promise<IComment> {

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
    async updateComment(parent: any, args: IUpdateComment, { prisma }: Context, info: GraphQLResolveInfo): Promise<IComment> {

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
    async deleteComment(parent: any, args: IComment, { prisma }: Context, info: GraphQLResolveInfo): Promise<IComment> {

        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info);

    }
};
