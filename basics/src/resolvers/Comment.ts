import { IComment, IGqlCtx, IPost, IUser } from "../interfaces";

export const Comment = {
    author(parent: IComment, args: any, { db }: IGqlCtx, info: any): IUser {
        return db.users.find((user) => user.id === parent.author);
    },
    post(parent: IComment, args: any, { db }: IGqlCtx, info: any): IPost {
        return db.posts.find((post) => post.id === parent.post);
    }
};
