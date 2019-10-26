"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_yoga_1 = require("graphql-yoga");
const v4_1 = __importDefault(require("uuid/v4"));
const db_1 = require("./db");
// To build the API, we need 2 things:
// 1. TYPE DEFINITIONS.
// This is the APPLICATION SCHEMA, the entities/model that we will be using.
// 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.
// Demo user data
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return ctx.users;
            }
            return db_1.users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return ctx.posts;
            }
            const query = args.query.toLowerCase();
            return db_1.posts.filter((post) => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query));
        },
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return ctx.comments;
            }
            const query = args.query.toLowerCase();
            return db_1.comments.filter((comment) => comment.text.toLowerCase().includes(query));
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
        createUser(parent, args, ctx, info) {
            const data = args.data;
            const emailTaken = ctx.users.some((user) => user.email === data.email);
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
            const user = Object.assign({ id: v4_1.default() }, data);
            ctx.users.push(user);
            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = ctx.users.findIndex((user) => user.id === args.id);
            if (userIndex === -1) {
                throw new Error("404: User not found");
            }
            const deletedUsers = ctx.users.splice(userIndex, 1);
            // Since user is a non-nullable field in comments and posts,
            // we need to also deleted the posts and comments related to the deleted user.
            ctx.posts = ctx.posts.filter((post) => {
                const match = post.author === args.id;
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
        createPost(parent, args, ctx, info) {
            const data = args.data;
            const userExists = ctx.users.some((user) => user.id === data.author);
            if (!userExists) {
                throw new Error("404: User not found");
            }
            const post = Object.assign({ id: v4_1.default() }, data);
            ctx.posts.push(post);
            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = ctx.posts.findIndex((post) => post.id === args.id);
            if (postIndex === -1) {
                throw new Error("404: Post Not Found");
            }
            const deletedPosts = ctx.posts.splice(postIndex, 1);
            // Delete the comments associated to that post.
            ctx.comments = ctx.comments.filter((comment) => comment.post !== args.id);
            return deletedPosts[0];
        },
        createComment(parent, args, ctx, info) {
            const data = args.data;
            const userExists = ctx.users.some((user) => user.id === data.author);
            const postExists = ctx.posts.some((post) => post.id === data.post && post.published);
            if (!userExists || !postExists) {
                throw new Error("404: User or post not found");
            }
            const comment = Object.assign({ id: v4_1.default() }, data);
            ctx.comments.push(comment);
            return comment;
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = ctx.comments.findIndex((comment) => comment.id === args.id);
            if (commentIndex === -1) {
                throw new Error("404: Comment Not Found!");
            }
            const deletedComments = ctx.comments.splice(commentIndex, 1);
            return deletedComments[0];
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return ctx.users.find((user) => user.id === parent.author);
        },
        comments(parent, args, ctx, info) {
            return ctx.comments.filter((comment) => comment.post === parent.id);
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return ctx.posts.filter((post) => post.author === parent.id);
        },
        comments(parent, args, ctx, info) {
            return ctx.comments.filter((comment) => comment.author === parent.id);
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return ctx.users.find((user) => user.id === parent.author);
        },
        post(parent, args, ctx, info) {
            return ctx.posts.find((post) => post.id === parent.post);
        }
    }
};
const server = new graphql_yoga_1.GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: {
        users: db_1.users,
        posts: db_1.posts,
        comments: db_1.comments
    }
});
server.start(() => {
    console.log("Server is running on http://localhost:4000");
});
//# sourceMappingURL=index.js.map