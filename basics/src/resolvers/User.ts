import { IComment, IGQLCtx, IPost, IUser } from "../interfaces";

export const User = {
    posts(parent: IUser, args: any, { db }: IGQLCtx, info: any): IPost[] {
        return db.posts.filter((post) => post.author === parent.id);
    },
    comments(parent: IComment, args: any, { db }: IGQLCtx, info: any): IComment[] {
        return db.comments.filter((comment) => comment.author === parent.id);
    }
};
