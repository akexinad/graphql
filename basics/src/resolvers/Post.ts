import { IComment, IGQLCtx, IPost, IUser } from "../interfaces";

export const Post = {
    author(parent: IPost, args: any, { db }: IGQLCtx, info: any): IUser {
        return db.users.find((user) => user.id === parent.author);
    },
    comments(parent: IComment, args: any, { db }: IGQLCtx, info: any): IComment[] {
        return db.comments.filter((comment) => comment.post === parent.id);
    }
};
