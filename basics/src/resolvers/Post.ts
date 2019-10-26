import { IComment, IGqlCtx, IPost } from "../interfaces";

export const Post = {
    author(parent: IPost, args: any, { db }: IGqlCtx, info: any) {
        return db.users.find((user) => user.id === parent.author);
    },
    comments(parent: IComment, args: any, { db }: IGqlCtx, info: any) {
        return db.comments.filter((comment) => comment.post === parent.id);
    }
};
