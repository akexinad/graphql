import { GraphQLResolveInfo } from "graphql";
import { Context } from "graphql-yoga/dist/types";
import { IBlogUser, IComment, IPost } from "../interfaces";

export const Query = {
    users(parent: any, args: any, { prisma }: Context, info: GraphQLResolveInfo): Promise<IBlogUser[]> {

        const operationArguments = {
        };

        if (args.query) {
            // @ts-ignore
            operationArguments.where = {
                OR: [{
                    name_contains: args.query
                }, {
                    email_contains: args.query
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

    posts(parent: any, args: any, { prisma }: Context, info: any): Promise<IPost[]> {

        const operationArguments = {};

        if (args.query) {
            // @ts-ignore
            operationArguments.where = {
                OR: [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
            };
        }

        return prisma.query.posts(operationArguments, info);

    },

    comments(parent: any, args: any, { prisma }: Context, info: any): Promise<IComment[]> {

        const operationArguments = {};

        if (args.query) {
            // @ts-ignore
            operationArguments.where = {
                text_contains: args.query
            };
        }

        return prisma.query.comments(operationArguments, info);

    },
};
