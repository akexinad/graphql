import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import { comments, posts, users } from "./db";
import { IComment, ICommentArgs, ICtx, IPost, IPostArgs, IUser, IUserArgs } from "./interfaces";

// To build the API, we need 2 things:
    // 1. TYPE DEFINITIONS.
        // This is the APPLICATION SCHEMA, the entities/model that we will be using.
    // 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.

// Demo user data

const resolvers = {
    Query: {
        users(parent: any, args: any, ctx: ICtx, info: any) {
            if (!args.query) {
                return ctx.users;
            }

            return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
        },
        posts(parent: any, args: any, ctx: ICtx, info: any) {
            if (!args.query) {
                return ctx.posts;
            }

            const query = args.query.toLowerCase();

            return posts.filter((post) => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query));
        },
        comments(parent: any, args: any, ctx: ICtx, info: any) {

            if (!args.query) {
                return ctx.comments;
            }

            const query = args.query.toLowerCase();

            return comments.filter((comment) => comment.text.toLowerCase().includes(query));
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
    },
    Mutation: {
        createUser(parent: any, args: IUserArgs, ctx: ICtx, info: any) {

            const data: IUser = args.data;

            const emailTaken: boolean = ctx.users.some((user) => user.email === data.email);

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

            ctx.users.push(user);

            return user;
        },
        deleteUser(parent: any, args: IUser, ctx: ICtx, info: any) {
            const userIndex: number = ctx.users.findIndex((user) => user.id === args.id);

            if (userIndex === -1) {
                throw new Error("404: User not found");
            }

            const deletedUsers: IUser[] = ctx.users.splice(userIndex, 1);

            // Since user is a non-nullable field in comments and posts,
            // we need to also deleted the posts and comments related to the deleted user.

            ctx.posts = ctx.posts.filter((post) => {
                const match: boolean = post.author === args.id;

                // if the posts was made by the deleted user,
                // delete the comments made by the deleted user.
                if (match) {
                    ctx.comments = ctx.comments.filter((comment) => comment.post !== post.id);
                }

                // return the posts that did not match to the user that is being deleted.
                return !match;
            });

            // filter out the comments that belong to the deleted user.
            ctx.comments = ctx.comments.filter((comment) => comment.author !== args.id);

            return deletedUsers[0];
        },
        createPost(parent: any, args: IPostArgs, ctx: ICtx, info: any) {

            const data: IPost = args.data;

            const userExists: boolean = ctx.users.some((user) => user.id === data.author);

            if (!userExists) {
                throw new Error("404: User not found");
            }

            const post: IPost = {
                id: uuidv4(),
                ...data
            };

            ctx.posts.push(post);

            return post;
        },
        deletePost(parent: any, args: IPost, ctx: ICtx, info: any) {
            const postIndex: number = ctx.posts.findIndex((post) => post.id === args.id);

            if (postIndex === -1) {
                throw new Error("404: Post Not Found");
            }

            const deletedPosts: IPost[] = ctx.posts.splice(postIndex, 1);

            // Delete the comments associated to that post.
            ctx.comments = ctx.comments.filter((comment) => comment.post !== args.id);

            return deletedPosts[0];
        },
        createComment(parent: any, args: ICommentArgs, ctx: ICtx, info: any) {

            const data: IComment = args.data;

            const userExists: boolean = ctx.users.some((user) => user.id === data.author);
            const postExists: boolean = ctx.posts.some((post) => post.id === data.post && post.published);

            if (!userExists || !postExists) {
                throw new Error("404: User or post not found");
            }

            const comment: IComment = {
                id: uuidv4(),
                ...data
            };

            ctx.comments.push(comment);

            return comment;
        },
        deleteComment(parent: any, args: IComment, ctx: ICtx, info: any) {
            const commentIndex: number = ctx.comments.findIndex((comment) => comment.id === args.id);

            if (commentIndex === -1) {
                throw new Error("404: Comment Not Found!");
            }

            const deletedComments = ctx.comments.splice(commentIndex, 1);

            return deletedComments[0];
        }
    },
    Post: {
        author(parent: IPost, args: any, ctx: ICtx, info: any) {
            return ctx.users.find((user) => user.id === parent.author);
        },
        comments(parent: IComment, args: any, ctx: ICtx, info: any) {
            return ctx.comments.filter((comment) => comment.post === parent.id);
        }
    },
    User: {
        posts(parent: IUser, args: any, ctx: ICtx, info: any) {
            return ctx.posts.filter((post) => post.author === parent.id);
        },
        comments(parent: IComment, args: any, ctx: ICtx, info: any) {
            return ctx.comments.filter((comment) => comment.author === parent.id);
        }
    },
    Comment: {
        author(parent: IComment, args: any, ctx: ICtx, info: any) {
            return ctx.users.find((user) => user.id === parent.author);
        },
        post(parent: IComment, args: any, ctx: ICtx, info: any) {
            return ctx.posts.find((post) => post.id === parent.post);
        }
    }
};

const server: GraphQLServer = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: {
        users,
        posts,
        comments
    }
});

server.start(() => {
    console.log("Server is running on http://localhost:4000");
});
