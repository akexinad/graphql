import { IBlogUser, IComment, IGQLCtx, IPost } from "../interfaces";

export const Post = {

    /*

    Fetching relational data comes for free with prisma.
    No need to manually wire it up.

    author(parent: IPost, args: any, { db }: IGQLCtx, info: any): IBlogUser {
        return db.users.find((user) => user.id === parent.author);
    },
    comments(parent: IComment, args: any, { db }: IGQLCtx, info: any): IComment[] {
        return db.comments.filter((comment) => comment.post === parent.id);
    }

    */
};
