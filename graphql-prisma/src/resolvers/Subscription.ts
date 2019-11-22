import { GraphQLResolveInfo } from "graphql";
import { COMMENT_CHANNEL, POST_CHANNEL } from "../helpers/channels";
import { IComment, IGraphQLContext, IPost } from "../interfaces";

export const Subscription = {
    comment: {
        subscribe(parent: any, args: any, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): AsyncIterator<IComment> {

            // PRISMA has built-in support for subscriptions

            /*

            The operation arguments tell that we want to only
            subscribe to posts of the id passed into the arguments

            */

            console.log(args);

            const operationArguments = {
                where: {
                    node: {
                        post: {
                            id: args.postId
                        }
                    }
                }
            };

            // @ts-ignore
            return prisma.subscription.comment(operationArguments, info);

            /*

            const post = db.posts.find((post) => post.id === args.postId && post.published);

            if (!post) {
                throw new Error("404: Post Not Found");
            }

            return pubsub.asyncIterator(COMMENT_CHANNEL(post.id));

            */
        }
    },
    post: {
        subscribe(parent: any, args: IPost, { prisma }: IGraphQLContext, info: GraphQLResolveInfo): AsyncIterator<IPost> {

            // subscribe to posts that are published ONLY.
            const operationArguments = {
                where: {
                    node: {
                        published: true
                    }
                }
            };

            // @ts-ignore
            return prisma.subscription.post(operationArguments, info);

            /*
            const posts = db.posts;

            pubsub.publish(POST_CHANNEL, { posts });

            return pubsub.asyncIterator(POST_CHANNEL);

            */
        }
    }
};
