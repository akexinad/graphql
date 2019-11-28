import { GraphQLResolveInfo } from "graphql";
import { Context } from "graphql-yoga/dist/types";
import { IComment, IPost } from "../interfaces";
import { getUserId } from "../utils/getUserId";

export const Subscription = {
    comment: {
        subscribe(parent: any, args: any, { prisma }: Context, info: GraphQLResolveInfo): AsyncIterator<IComment> {

            // PRISMA has built-in support for subscriptions

            /*

            The operation arguments tell that we want to only
            subscribe to posts of the id passed into the arguments

            */

            const operationArguments = {
                where: {
                    node: {
                        post: {
                            id: args.postId
                        }
                    }
                }
            };

            return prisma.subscription.comment(operationArguments, info);

        }
    },
    post: {
        subscribe(parent: any, args: IPost, { prisma }: Context, info: GraphQLResolveInfo): AsyncIterator<IPost> {

            // subscribe to posts that are published ONLY.
            const operationArguments = {
                where: {
                    node: {
                        published: true
                    }
                }
            };

            return prisma.subscription.post(operationArguments, info);

        }
    },
    myPost: {
        subscribe(parent: any, args: IPost, { request, prisma }: Context, info: GraphQLResolveInfo): AsyncIterator<IPost> {

            const userId = getUserId(request);

            const operationArguments = {
                where: {
                    node: {
                        author: {
                            id: userId
                        }
                    }
                }
            };

            return prisma.subscription.post(operationArguments, info);
        }
    }
};
