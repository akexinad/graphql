import { IBlogUser, IComment, IGQLCtx, IPost } from "../interfaces";

export const Comment = {
    author(parent: IComment, args: any, { db }: IGQLCtx, info: any): IBlogUser {
        return db.users.find((user) => user.id === parent.author);
    },
    post(parent: IComment, args: any, { db }: IGQLCtx, info: any): IPost {
        return db.posts.find((post) => post.id === parent.post);
    }
};
