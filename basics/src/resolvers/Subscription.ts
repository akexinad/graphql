import { ICommentSub, IGqlCtx, IPost } from "../interfaces";

export const Subscription = {
    count: {
        subscribe(parent: any, args: any, { pubsub }: IGqlCtx, info: any) {
            let count = 0;

            setInterval(() => {
                count++;
                pubsub.publish("count", { count });
            }, 1000);

            // async iterator takes a single argument called a channel name.
            return pubsub.asyncIterator("count");
        }
    },
    comment: {
        subscribe(parent: any, args: ICommentSub, { db, pubsub }: IGqlCtx, info: any) {
            const post = db.posts.find((post) => post.id === args.postId && post.published);

            if (!post) {
                throw new Error("404: Post Not Found");
            }

            return pubsub.asyncIterator(`comment ${ args.postId }`);
        }
    },
    post: {
        subscribe(parent: any, args: any, { db, pubsub }: IGqlCtx, info: any) {
            const posts = db.posts;

            pubsub.publish("posts", { posts });

            return pubsub.asyncIterator("posts");
        }
    }
};
