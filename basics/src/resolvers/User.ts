import { IComment, ICtx, IUser } from "../interfaces";

export const User = {
    posts(parent: IUser, args: any, ctx: ICtx, info: any) {
        return ctx.posts.filter((post) => post.author === parent.id);
    },
    comments(parent: IComment, args: any, ctx: ICtx, info: any) {
        return ctx.comments.filter((comment) => comment.author === parent.id);
    }
};
