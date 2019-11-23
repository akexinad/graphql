import bcrypt from "bcryptjs";
import { GraphQLResolveInfo } from "graphql";
import jwt from "jsonwebtoken";
import { IAuthPayload, IBlogUser, IBlogUserArgs, IComment, ICommentArgs, IGraphQLContext, IPost, IPostArgs, IUpdateBlogUser, IUpdateComment, IUpdatePost } from "../interfaces";

const JWT_SECRET = "thisisajsonwebtokensecrets9b$7h1sr6gj7h4_9nwj7r9tnu49l7e9r7byh1e97kj111n19sd";

export const Mutation = {
    async createUser(parent: any, args: IBlogUserArgs, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IAuthPayload> {

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
    async updateUser(parent: any, args: IUpdateBlogUser, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IBlogUser> {

        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info);

    },
    async deleteUser(parent: any, args: IBlogUser, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IBlogUser> {

        const deletedUser = await prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info);

        return deletedUser;

    },
    async login(parent: any, args: IBlogUserArgs, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): Promise<IAuthPayload> {

        const loginData = args.data;

        const existingUser: IBlogUser = await prisma.query.user({
            where: {
                email: loginData.email
            }
        });

        if (!existingUser) {
            throw new Error("404: User not found!");
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
