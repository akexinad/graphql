import { IComment, ICommentSub, IGQLCtx, IPost } from "../interfaces";

export const Subscription = {
    comment: {
        subscribe(parent: any, args: ICommentSub, { db, pubsub }: IGQLCtx, info: any): AsyncIterator<IComment> {
            const post = db.posts.find((post) => post.id === args.postId && post.published);

            if (!post) {
                throw new Error("404: Post Not Found");
            }

            return pubsub.asyncIterator(`comment ${ args.postId }`);
        }
    },
    post: {
        subscribe(parent: any, args: any, { db, pubsub }: IGQLCtx, info: any): AsyncIterator<IPost> {
            const posts = db.posts;
            const POST_CHANNEL = "post";

            pubsub.publish(POST_CHANNEL, { posts });

            return pubsub.asyncIterator(POST_CHANNEL);
        }
    }
};
