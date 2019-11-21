import { COMMENT_CHANNEL, POST_CHANNEL } from "../helpers/channels";
import { IBlogUser, IComment, ICommentArgs, IGQLCtx, IPost, IPostArgs, IUpdateComment, IUpdatePost, IUpdateUser, IUserArgs } from "../interfaces";

import { GraphQLResolveInfo } from "graphql";
import uuidv4 from "uuid/v4";

const CREATED = "CREATED";
const UPDATED = "UPDATED";
const DELETED = "DELETED";

export const Mutation = {
    async createUser(parent: any, args: IUserArgs, { prisma }: IGQLCtx, info: GraphQLResolveInfo): Promise<IBlogUser> {

        const emailTaken = await prisma.exists.User({
            email: args.data.email
        });

        if (emailTaken) {
            throw new Error("Email has already been taken.");
        }

        const user = await prisma.mutation.createUser({
            data: args.data
        }, info);

        return user;

        /*

        const data: IBlogUser = args.data;

        const emailTaken: boolean = db.users.some((user) => user.email === data.email);

        if (emailTaken) {
            throw new Error("Email has already been taken.");
        }

        now we can use the es6 object-rest-spread operator.

        const user = {
            id: uuidv4(),
            name: args.name,
            email: args.email,
            age: args.age
        }

        const user: IBlogUser = {
            id: uuidv4(),
            ...data
        };

        db.users.push(user);

        return user;

        */
    },
    async deleteUser(parent: any, args: IBlogUser, { prisma }: IGQLCtx, info: GraphQLResolveInfo): Promise<IBlogUser> {

        const userExists = await prisma.exists.User({
            id: args.id
        });

        if (!userExists) {
            throw new Error("404: User not found");
        }

        const deletedUser = await prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info);

        return deletedUser;

        /*

        const userIndex: number = db.users.findIndex((user) => user.id === args.id);

        if (userIndex === -1) {
            throw new Error("404: User not found");
        }

        const deletedUsers: IBlogUser[] = db.users.splice(userIndex, 1);

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

        */
    },
    async updateUser(parent: any, args: IUpdateUser, { prisma }: IGQLCtx, info: GraphQLResolveInfo): Promise<IBlogUser> {

        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info);

        /*

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

        */
    },
    async createPost(parent: any, args: IPostArgs, { prisma, pubsub }: IGQLCtx, info: GraphQLResolveInfo): Promise<IPost> {

        const data = args.data;

        return prisma.mutation.createPost({
            data: {
                title: data.title,
                body: data.body,
                published: data.published,
                author: {
                    connect: {
                        id: data.author
                    }
                }
            }
        }, info);

        /*

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
            pubsub.publish(POST_CHANNEL, {
                post: {
                    mutation: CREATED,
                    data: post
                }
            });
        }

        return post;

        */

    },
    deletePost(parent: any, args: IPost, { pubsub, db }: IGQLCtx, info: any): IPost {
        const postIndex: number = db.posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) {
            throw new Error("404: Post Not Found");
        }

        const [deletedPost]: IPost[] = db.posts.splice(postIndex, 1);

        // Delete the comments associated to that post.
        db.comments = db.comments.filter((comment) => comment.post !== args.id);

        // ensure that we don't publish unpublished posts.
        if (deletedPost.published) {
            pubsub.publish(POST_CHANNEL, {
                post: {
                    mutation: DELETED,
                    data: deletedPost
                }
            });
        }

        return deletedPost;
    },
    updatePost(parent: any, args: IUpdatePost, { pubsub, db }: IGQLCtx, info: any): IPost {
        const data = args.data;
        const post = db.posts.find((post) => post.id === args.id);
        const originalPost = { ...post };

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

            // Check if the post went from published to unpublished so we can send out a DELETED mutation.
            if (originalPost.published && !post.published) {
                // post was published and is now unpublished => DELETED
                pubsub.publish(POST_CHANNEL, {
                    post: {
                        mutation: DELETED,
                        // publishing the original just in case the author decided to make changes before unpublishing the post.
                        data: originalPost
                    }
                });

            } else if (!originalPost.published && post.published) {
                // post was unpublished and is now published => CREATED
                pubsub.publish(POST_CHANNEL, {
                    post: {
                        mutation: CREATED,
                        data: post
                    }
                });

            }
        } else if (post.published) {
            // if there are any other changes apart from being published/unpublished => UPDATED
            pubsub.publish(POST_CHANNEL, {
                post: {
                    mutation: UPDATED,
                    data: post
                }
            });
        }

        return post;
    },
    createComment(parent: any, args: ICommentArgs, { db, pubsub }: IGQLCtx, info: any): IComment {

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

        pubsub.publish(COMMENT_CHANNEL(data.post), {
            comment: {
                mutation: CREATED,
                data: comment
            }
        });

        return comment;
    },
    updateComment(parent: any, args: IUpdateComment, { pubsub, db }: IGQLCtx, info: any): IComment {
        const data = args.data;
        const comment = db.comments.find((comment) => comment.id === args.id);

        if (!comment) {
            throw new Error("404: Comment Not Found!");
        }

        if (typeof data.text === "string") {
            comment.text = data.text;
        }

        pubsub.publish(COMMENT_CHANNEL(comment.post), {
            comment: {
                mutation: UPDATED,
                data: comment
            }
        });

        return comment;
    },
    deleteComment(parent: any, args: IComment, { pubsub, db }: IGQLCtx, info: any): IComment {
        const commentIndex: number = db.comments.findIndex((comment) => comment.id === args.id);

        if (commentIndex === -1) {
            throw new Error("404: Comment Not Found!");
        }

        const [deletedComment] = db.comments.splice(commentIndex, 1);

        pubsub.publish(COMMENT_CHANNEL(deletedComment.post), {
            comment: {
                mutation: DELETED,
                data: deletedComment
            }
        });

        return deletedComment;
    }
};
