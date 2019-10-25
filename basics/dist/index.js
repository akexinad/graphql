"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_yoga_1 = require("graphql-yoga");
const v4_1 = __importDefault(require("uuid/v4"));
// To build the API, we need 2 things:
// 1. TYPE DEFINITIONS.
// This is the APPLICATION SCHEMA, the entities/model that we will be using.
// 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.
// Demo user data
let posts = [
    {
        id: "p001",
        title: "Plutorque",
        body: "Et aliqua ex eu voluptate laborum eu sunt exercitation aliqua irure.",
        published: true,
        author: "3"
    },
    {
        id: "p002",
        title: "Strozen",
        body: "Dolor sit et enim amet labore adipisicing.",
        published: false,
        author: "1"
    },
    {
        id: "p003",
        title: "Genmex",
        body: "Id et ex non do eiusmod.",
        published: false,
        author: "2"
    },
    {
        id: "p004",
        title: "Panzent",
        body: "Duis incididunt excepteur fugiat et.",
        published: true,
        author: "3"
    },
    {
        id: "p005",
        title: "Klugger",
        body: "Ipsum mollit magna proident culpa incididunt anim sit do.",
        published: false,
        author: "1"
    },
    {
        id: "p006",
        title: "Evidends",
        body: "Duis eu consectetur minim duis mollit elit incididunt non laborum dolor cupidatat in culpa irure.",
        published: true,
        author: "2"
    },
    {
        id: "p007",
        title: "Springbee",
        body: "Do excepteur commodo ipsum nulla.",
        published: true,
        author: "3"
    }
];
const users = [
    {
        id: "1",
        name: "fellini",
        email: "fellini@ex.it",
        age: 29
    },
    {
        id: "2",
        name: "benigni",
        email: "benigni@ex.it",
        age: 44
    },
    {
        id: "3",
        name: "pasolini",
        email: "pasolini@ex.it",
        age: null
    }
];
let comments = [
    {
        id: "5da7e1153a6ae60359a271e1",
        text: "Et occaecat duis aliquip nisi magna culpa est officia dolor non sint id ex exercitation. Proident culpa cillum dolore adipisicing eu ea anim velit cupidatat tempor eiusmod commodo. Consectetur Lorem sint eu mollit anim.",
        author: "1",
        post: "5da7b6eba53428f1b20c722f"
    },
    {
        id: "5da7e1155093c31e3c4c91fd",
        text: "Quis consectetur aute ex nulla quis adipisicing proident esse enim ullamco nulla qui non officia. Dolore aliquip est laborum pariatur anim cillum ex mollit ullamco fugiat. Ex magna aliqua sint adipisicing Lorem velit nulla consectetur nulla amet ea nostrud velit.",
        author: "2",
        post: "5da7b6ebf2039adc7e35e982"
    },
    {
        id: "5da7e11541d408b8284fbe30",
        text: "Lorem laborum incididunt veniam cillum eu eiusmod aute officia occaecat et adipisicing aute incididunt nisi. Ut fugiat eiusmod Lorem consectetur enim. Dolor eiusmod pariatur aliqua pariatur culpa exercitation duis magna ullamco.",
        author: "3",
        post: "5da7b6ebe68b9c3e53fe59b7"
    },
    {
        id: "5da7e115f841901d0464ac24",
        text: "Lorem eiusmod laborum labore Lorem qui culpa anim minim labore ad. Labore magna eiusmod nostrud voluptate ea consequat eu aute anim et et eu cupidatat in. Fugiat nostrud duis proident nulla sint.",
        author: "1",
        post: "5da7b6eb701d9ebcae5bf714"
    }
];
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        comments(query: String): [Comment!]!
        me: User!
        myPost: Post!
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post]!
        comments: [Comment]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;
const resolvers = {
    Query: {
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return comments;
            }
            const query = args.query.toLowerCase();
            return comments.filter((comment) => comment.text.toLowerCase().includes(query));
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            const query = args.query.toLowerCase();
            return posts.filter((post) => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query));
        },
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }
            return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
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
            const emailTaken = users.some((user) => user.email === data.email);
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
            users.push(user);
            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id);
            if (userIndex === -1) {
                throw new Error("404: User not found");
            }
            const deletedUsers = users.splice(userIndex, 1);
            // Since user is a non-nullable field in comments and posts,
            // we need to also deleted the posts and comments related to the deleted user.
            posts = posts.filter((post) => {
                const match = post.author === args.id;
                // if the posts was made by the deleted user,
                // delete the comments made by the deleted user.
                if (match) {
                    comments = comments.filter((comment) => comment.post !== post.id);
                }
                // return the posts that did not match to the user that is being deleted.
                return !match;
            });
            // filter out the comments that belong to the deleted user.
            comments = comments.filter((comment) => comment.author !== args.id);
            return deletedUsers[0];
        },
        createPost(parent, args, ctx, info) {
            const data = args.data;
            const userExists = users.some((user) => user.id === data.author);
            if (!userExists) {
                throw new Error("404: User not found");
            }
            const post = Object.assign({ id: v4_1.default() }, data);
            posts.push(post);
            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id);
            if (postIndex === -1) {
                throw new Error("404: Post Not Found");
            }
        },
        createComment(parent, args, ctx, info) {
            const data = args.data;
            const userExists = users.some((user) => user.id === data.author);
            const postExists = posts.some((post) => post.id === data.post && post.published);
            if (!userExists || !postExists) {
                throw new Error("404: User or post not found");
            }
            const comment = Object.assign({ id: v4_1.default() }, data);
            comments.push(comment);
            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id === parent.author);
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.post === parent.id);
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => post.author === parent.id);
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.author === parent.id);
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id === parent.author);
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => post.id === parent.post);
        }
    }
};
const server = new graphql_yoga_1.GraphQLServer({
    typeDefs,
    resolvers
});
server.start(() => {
    console.log("Server is running on http://localhost:4000");
});
//# sourceMappingURL=index.js.map