import { IComment, ICtx } from "../interfaces";

export const Comment = {
    author(parent: IComment, args: any, ctx: ICtx, info: any) {
        return ctx.users.find((user) => user.id === parent.author);
    },
    post(parent: IComment, args: any, ctx: ICtx, info: any) {
        return ctx.posts.find((post) => post.id === parent.post);
    }
};
