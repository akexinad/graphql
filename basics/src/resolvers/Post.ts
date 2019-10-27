import { IComment, IGqlCtx, IPost, IUser } from "../interfaces";

export const Post = {
    author(parent: IPost, args: any, { db }: IGqlCtx, info: any): IUser {
        return db.users.find((user) => user.id === parent.author);
    },
    comments(parent: IComment, args: any, { db }: IGqlCtx, info: any): IComment[] {
        return db.comments.filter((comment) => comment.post === parent.id);
    }
};
