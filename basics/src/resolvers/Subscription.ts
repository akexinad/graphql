import { IComment, ICommentSub, IGqlCtx, IPost } from "../interfaces";

export const Subscription = {
    comment: {
        subscribe(parent: any, args: ICommentSub, { db, pubsub }: IGqlCtx, info: any): AsyncIterator<IComment> {
            const post = db.posts.find((post) => post.id === args.postId && post.published);

            if (!post) {
                throw new Error("404: Post Not Found");
            }

            return pubsub.asyncIterator(`comment ${ args.postId }`);
        }
    },
    post: {
        subscribe(parent: any, args: any, { db, pubsub }: IGqlCtx, info: any): AsyncIterator<IPost> {
            const posts = db.posts;

            pubsub.publish("posts", { posts });

            return pubsub.asyncIterator("posts");
        }
    }
};
