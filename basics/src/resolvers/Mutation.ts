import { IComment, ICommentArgs, IDbCtx, IPost, IPostArgs, IUpdateUser, IUser, IUserArgs } from "../interfaces";

import uuidv4 from "uuid/v4";

export const Mutation = {
    createUser(parent: any, args: IUserArgs, { db }: IDbCtx, info: any) {

        const data: IUser = args.data;

        const emailTaken: boolean = db.users.some((user) => user.email === data.email);

        if (emailTaken) {
            throw new Error("Email has already been taken.");
        }

        /*
        now we can use the es6 object-rest-spread operator.

        const user = {
            id: uuidv4(),
            name: args.name,
            email: args.email,
            age: args.age
        }
        */

        const user: IUser = {
            id: uuidv4(),
            ...data
        };

        db.users.push(user);

        return user;
    },
    deleteUser(parent: any, args: IUser, { db }: IDbCtx, info: any) {
        const userIndex: number = db.users.findIndex((user) => user.id === args.id);

        if (userIndex === -1) {
            throw new Error("404: User not found");
        }

        const deletedUsers: IUser[] = db.users.splice(userIndex, 1);

        // Since user is a non-nullable field in comments and posts,
        // we need to also deleted the posts and comments related to the deleted user.

        db.posts = db.posts.filter((post) => {
            const match: boolean = post.author === args.id;

            // if the posts was made by the deleted user,
            // delete the comments made by the deleted user.
            if (match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id);
            }

            // return the posts that did not match to the user that is being deleted.
            return !match;
        });

        // filter out the comments that belong to the deleted user.
        db.comments = db.comments.filter((comment) => comment.author !== args.id);

        return deletedUsers[0];
    },
    updateUser(parent: any, args: IUpdateUser, { db }: IDbCtx, info: any) {

        const data = args.data;
        console.log(db);

        const user = db.users.find((user) => user.id === args.id);

        if (!user) {
            throw new Error("404: User Not Found!");
        }

        // Check if the updated email is unique within the database.
        if (typeof data.email === "string") {
            const emailTaken = db.users.some((user) => user.email === data.email);

            if (emailTaken) {
                throw new Error("403: Email Already Taken!");
            }

            user.email = data.email;
        }

        if (typeof data.name === "string") {
            user.name = data.name;
        }

        if (typeof data.age !== "undefined") {
            user.age = data.age;
        }

        return user;
    },
    createPost(parent: any, args: IPostArgs, { db }: IDbCtx, info: any) {

        const data: IPost = args.data;

        const userExists: boolean = db.users.some((user) => user.id === data.author);

        if (!userExists) {
            throw new Error("404: User not found");
        }

        const post: IPost = {
            id: uuidv4(),
            ...data
        };

        db.posts.push(post);

        return post;
    },
    deletePost(parent: any, args: IPost, { db }: IDbCtx, info: any) {
        const postIndex: number = db.posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) {
            throw new Error("404: Post Not Found");
        }

        const deletedPosts: IPost[] = db.posts.splice(postIndex, 1);

        // Delete the comments associated to that post.
        db.comments = db.comments.filter((comment) => comment.post !== args.id);

        return deletedPosts[0];
    },
    createComment(parent: any, args: ICommentArgs, { db }: IDbCtx, info: any) {

        const data: IComment = args.data;

        const userExists: boolean = db.users.some((user) => user.id === data.author);
        const postExists: boolean = db.posts.some((post) => post.id === data.post && post.published);

        if (!userExists || !postExists) {
            throw new Error("404: User or post not found");
        }

        const comment: IComment = {
            id: uuidv4(),
            ...data
        };

        db.comments.push(comment);

        return comment;
    },
    deleteComment(parent: any, args: IComment, { db }: IDbCtx, info: any) {
        const commentIndex: number = db.comments.findIndex((comment) => comment.id === args.id);

        if (commentIndex === -1) {
            throw new Error("404: Comment Not Found!");
        }

        const deletedComments = db.comments.splice(commentIndex, 1);

        return deletedComments[0];
    }
};
