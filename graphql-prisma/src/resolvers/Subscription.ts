import { COMMENT_CHANNEL, POST_CHANNEL } from "../helpers/channels";
import { IComment, ICommentSub, IGraphQLContext, IPost } from "../interfaces";

export const Subscription = {
    comment: {
        subscribe(parent: any, args: ICommentSub, { db, pubsub }: IGraphQLContext, info: any): AsyncIterator<IComment> {
            const post = db.posts.find((post) => post.id === args.postId && post.published);

            if (!post) {
                throw new Error("404: Post Not Found");
            }

            return pubsub.asyncIterator(COMMENT_CHANNEL(post.id));
        }
    },
    post: {
        subscribe(parent: any, args: any, { db, pubsub }: IGraphQLContext, info: any): AsyncIterator<IPost> {
            const posts = db.posts;

            pubsub.publish(POST_CHANNEL, { posts });

            return pubsub.asyncIterator(POST_CHANNEL);
        }
    }
};
