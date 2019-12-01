import { GraphQLResolveInfo } from "graphql";
import { Args, QueryMap } from "graphql-binding/dist/types";
import { Context } from "graphql-yoga/dist/types";
import { IBlogUser, IComment, IPost } from "../interfaces";
import { getUserId } from "../utils/getUserId";

export const Query = {
    users(parent: any, args: Args, { prisma }: Context, info: GraphQLResolveInfo): Promise<IBlogUser[]> {

        const { first, skip, after, orderBy } = args;

        const operationArguments = {
            first,
            skip,
            after,
            orderBy
        };

        if (args.query) {
            // @ts-ignore
            operationArguments.where = {
                OR: [{
                    name_contains: args.query
                }]
            };
        }

        /*
        Below you can pass three distinct values for the second argument:
        1. Nothing
        2. A string, which is what we were doing in the prisma file
        3. An object
        */

        return prisma.query.users(operationArguments, info);

    },

    posts(parent: any, args: Args, { prisma }: Context, info: GraphQLResolveInfo): Promise<IPost[]> {

        const { first, skip, after, orderBy } = args;

        const operationArguments = {
            first,
            skip,
            after,
            orderBy,
            where: {
                published: true,
            }
        };

        if (args.query) {
            // @ts-ignore
            operationArguments.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }];
        }

        return prisma.query.posts(operationArguments, info);
    },

    comments(parent: any, args: Args, { prisma }: Context, info: GraphQLResolveInfo): Promise<IComment[]> {

        const { first, skip, after, orderBy } = args;

        const operationArguments = {
            first,
            skip,
            after,
            orderBy
        };

        if (args.query) {
            // @ts-ignore
            operationArguments.where = {
                text_contains: args.query
            };
        }

        return prisma.query.comments(operationArguments, info);

    },

    async me(parent: any, args: Args, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IBlogUser> {

        const userId = getUserId(request);

        return prisma.query.user({
            where: {
                id: userId
            }
        });

    },

    async post(parent: any, args: Args, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IPost[]> {

        const userId = getUserId(request, false);

        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info);

        if (posts.length === 0) {
            throw new Error("404: Post not found!");
        }

        return posts[0];
    },

    async myPosts(parent: any, args: Args, { request, prisma }: Context, info: GraphQLResolveInfo): Promise<IPost[]> {

        const userId = getUserId(request);

        const { first, skip, after, orderBy } = args;

        const operationArguments = {
            first,
            skip,
            after,
            orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        };

        if (args.qeury) {
            // @ts-ignore
            operationArguments.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }];
        }

        return prisma.query.posts(operationArguments, info);
    }
};
