import { IComment, IDbCtx } from "../interfaces";

export const Comment = {
    author(parent: IComment, args: any, { db }: IDbCtx, info: any) {
        return db.users.find((user) => user.id === parent.author);
    },
    post(parent: IComment, args: any, { db }: IDbCtx, info: any) {
        return db.posts.find((post) => post.id === parent.post);
    }
};
