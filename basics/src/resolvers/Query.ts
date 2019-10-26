import { IComment, ICtx, IPost, IUser } from "../interfaces";

export const Query = {
    users(parent: any, args: any, ctx: ICtx, info: any) {
        if (!args.query) {
            return ctx.users;
        }

        return ctx.users.filter((user: IUser) => user.name.toLowerCase().includes(args.query.toLowerCase()));
    },

    posts(parent: any, args: any, ctx: ICtx, info: any) {
        if (!args.query) {
            return ctx.posts;
        }

        const query = args.query.toLowerCase();

        return ctx.posts.filter((post: IPost) => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query));
    },

    comments(parent: any, args: any, ctx: ICtx, info: any) {

        if (!args.query) {
            return ctx.comments;
        }

        const query = args.query.toLowerCase();

        return ctx.comments.filter((comment: IComment) => comment.text.toLowerCase().includes(query));
    },

    me() {
        return {
            id: "123098",
            name: "fellini",
            email: "fellini@rome.it"
        };
    },

    myPost() {
        return {
            id: "123456",
            title: "this is my post title",
            body: "a very very very very long time ago...",
            published: true,
            author: {
                id: "123098",
                name: "fellini",
                email: "fellini@rome.it"
            }
        };
    }
};
