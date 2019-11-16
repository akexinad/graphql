import { IComment, IGQLCtx, IPost, IUser } from "../interfaces";

export const Query = {
    users(_: any, args: any, { db, prisma }: IGQLCtx, info: IUser): IUser[] {

        // the info argument contains all of the information regarding the user query operation.

        // return prisma.query.users(null, info);

        if (!args.query) {
            return db.users;
        }

        return db.users.filter((user: IUser) => user.name.toLowerCase().includes(args.query.toLowerCase()));

    },

    posts(_: any, args: any, { db }: IGQLCtx, __: any): IPost[] {
        if (!args.query) {
            return db.posts;
        }

        const query = args.query.toLowerCase();

        return db.posts.filter((post: IPost) => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query));
    },

    comments(_: any, args: any, { db }: IGQLCtx, __: any): IComment[] {

        if (!args.query) {
            return db.comments;
        }

        const query = args.query.toLowerCase();

        return db.comments.filter((comment: IComment) => comment.text.toLowerCase().includes(query));
    },

    /*

    me(): IUser {
        return {
            id: "123098",
            name: "fellini",
            email: "fellini@rome.it"
        };
    },

    */

    // tslint:disable-next-line: typedef
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
