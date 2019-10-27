import { IComment, ICommentArgs, IGqlCtx, IPost, IPostArgs, IUpdateComment, IUpdatePost, IUpdateUser, IUser, IUserArgs } from "../interfaces";

import uuidv4 from "uuid/v4";

export const Mutation = {
    createUser(parent: any, args: IUserArgs, { db }: IGqlCtx, info: any): IUser {

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
    deleteUser(parent: any, args: IUser, { db }: IGqlCtx, info: any): IUser {
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
    updateUser(parent: any, args: IUpdateUser, { db }: IGqlCtx, info: any): IUser {

        const data = args.data;

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
    createPost(parent: any, args: IPostArgs, { db, pubsub }: IGqlCtx, info: any): IPost {

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

        if (post.published) {
            pubsub.publish("posts", { post });
        }

        return post;
    },
    deletePost(parent: any, args: IPost, { db }: IGqlCtx, info: any): IPost {
        const postIndex: number = db.posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) {
            throw new Error("404: Post Not Found");
        }

        const deletedPosts: IPost[] = db.posts.splice(postIndex, 1);

        // Delete the comments associated to that post.
        db.comments = db.comments.filter((comment) => comment.post !== args.id);

        return deletedPosts[0];
    },
    updatePost(parent: any, args: IUpdatePost, { db }: IGqlCtx, info: any): IPost {
        const data = args.data;
        const post = db.posts.find((post) => post.id === args.id);

        if (!post) {
            throw new Error("404: Post Not Found!");
        }

        if (typeof data.title === "string") {
            post.title = data.title;
        }

        if (typeof data.body === "string") {
            post.body = data.body;
        }

        if (typeof data.published === "boolean") {
            post.published = data.published;
        }

        return post;
    },
    createComment(parent: any, args: ICommentArgs, { db, pubsub }: IGqlCtx, info: any): IComment {

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

        pubsub.publish(`comment ${ data.post }`, { comment });

        return comment;
    },
    updateComment(parent: any, args: IUpdateComment, { db }: IGqlCtx, info: any): IComment {
        const data = args.data;
        const comment = db.comments.find((comment) => comment.id === args.id);

        if (!comment) {
            throw new Error("404: Comment Not Found!");
        }

        if (typeof data.text === "string") {
            comment.text = data.text;
        }

        return comment;
    },
    deleteComment(parent: any, args: IComment, { db }: IGqlCtx, info: any): IComment {
        const commentIndex: number = db.comments.findIndex((comment) => comment.id === args.id);

        if (commentIndex === -1) {
            throw new Error("404: Comment Not Found!");
        }

        const deletedComments = db.comments.splice(commentIndex, 1);

        return deletedComments[0];
    }
};
