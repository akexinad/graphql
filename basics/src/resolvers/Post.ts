import { IComment, ICtx, IPost } from "../interfaces";

export const Post = {
    author(parent: IPost, args: any, ctx: ICtx, info: any) {
        return ctx.users.find((user) => user.id === parent.author);
    },
    comments(parent: IComment, args: any, ctx: ICtx, info: any) {
        return ctx.comments.filter((comment) => comment.post === parent.id);
    }
};
