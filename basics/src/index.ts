import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import { IComment, IPost, IUser } from "./models";

// To build the API, we need 2 things:
    // 1. TYPE DEFINITIONS.
        // This is the APPLICATION SCHEMA, the entities/model that we will be using.
    // 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.

// Demo user data

let posts: IPost[] = [
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

const users: IUser[] = [
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

let comments: IComment[] = [
    {
      id: "c001",
      text: "Et occaecat duis aliquip nisi magna culpa est officia dolor non sint id ex exercitation. Proident culpa cillum dolore adipisicing eu ea anim velit cupidatat tempor eiusmod commodo. Consectetur Lorem sint eu mollit anim.",
      author: "1",
      post: "p001"
    },
    {
      id: "c002",
      text: "Quis consectetur aute ex nulla quis adipisicing proident esse enim ullamco nulla qui non officia. Dolore aliquip est laborum pariatur anim cillum ex mollit ullamco fugiat. Ex magna aliqua sint adipisicing Lorem velit nulla consectetur nulla amet ea nostrud velit.",
      author: "2",
      post: "p002"
    },
    {
      id: "c003",
      text: "Lorem laborum incididunt veniam cillum eu eiusmod aute officia occaecat et adipisicing aute incididunt nisi. Ut fugiat eiusmod Lorem consectetur enim. Dolor eiusmod pariatur aliqua pariatur culpa exercitation duis magna ullamco.",
      author: "3",
      post: "p003"
    },
    {
      id: "c004",
      text: "Lorem eiusmod laborum labore Lorem qui culpa anim minim labore ad. Labore magna eiusmod nostrud voluptate ea consequat eu aute anim et et eu cupidatat in. Fugiat nostrud duis proident nulla sint.",
      author: "1",
      post: "p004"
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
        deleteComment(id: ID!): Comment!
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
        comments(parent: any, args: any, ctx: any, info: any) {
            if (!args.query) {
                return comments;
            }

            const query = args.query.toLowerCase();

            return comments.filter((comment) => comment.text.toLowerCase().includes(query));
        },
        posts(parent: any, args: any, ctx: any, info: any) {
            if (!args.query) {
                return posts;
            }

            const query = args.query.toLowerCase();

            return posts.filter((post) => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query));
        },
        users(parent: any, args: any, ctx: any, info: any) {
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
        createUser(parent: any, args: any, ctx: any, info: any) {

            const data: IUser = args.data;

            const emailTaken: boolean = users.some((user) => user.email === data.email);

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

            users.push(user);

            return user;
        },
        deleteUser(parent: any, args: IUser, ctx: any, info: any) {
            const userIndex: number = users.findIndex((user) => user.id === args.id);

            if (userIndex === -1) {
                throw new Error("404: User not found");
            }

            const deletedUsers: IUser[] = users.splice(userIndex, 1);

            // Since user is a non-nullable field in comments and posts,
            // we need to also deleted the posts and comments related to the deleted user.

            posts = posts.filter((post) => {
                const match: boolean = post.author === args.id;

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
        createPost(parent: any, args: any, ctx: any, info: any) {

            const data: IPost = args.data;

            const userExists: boolean = users.some((user) => user.id === data.author);

            if (!userExists) {
                throw new Error("404: User not found");
            }

            const post: IPost = {
                id: uuidv4(),
                ...data
            };

            posts.push(post);

            return post;
        },
        deletePost(parent: any, args: IPost, ctx: any, info: any) {
            const postIndex: number = posts.findIndex((post) => post.id === args.id);

            if (postIndex === -1) {
                throw new Error("404: Post Not Found");
            }

            const deletedPosts: IPost[] = posts.splice(postIndex, 1);

            // Delete the comments associated to that post.
            comments = comments.filter((comment) => comment.post !== args.id);

            return deletedPosts[0];
        },
        createComment(parent: any, args: any, ctx: any, info: any) {

            const data: IComment = args.data;

            const userExists: boolean = users.some((user) => user.id === data.author);
            const postExists: boolean = posts.some((post) => post.id === data.post && post.published);

            if (!userExists || !postExists) {
                throw new Error("404: User or post not found");
            }

            const comment: IComment = {
                id: uuidv4(),
                ...data
            };

            comments.push(comment);

            return comment;
        },
        deleteComment(parent: any, args: IComment, ctx: any, info: any) {
            const commentIndex: number = comments.findIndex((comment) => comment.id === args.id);

            if (commentIndex === -1) {
                throw new Error("404: Comment Not Found!");
            }

            const deletedComments = comments.splice(commentIndex, 1);

            return deletedComments[0];
        }
    },
    Post: {
        author(parent: IPost, args: any, ctx: any, info: any) {
            return users.find((user) => user.id === parent.author);
        },
        comments(parent: IComment, args: any, ctx: any, info: any) {
            return comments.filter((comment) => comment.post === parent.id);
        }
    },
    User: {
        posts(parent: IUser, args: any, ctx: any, info: any) {
            return posts.filter((post) => post.author === parent.id);
        },
        comments(parent: IComment, args: any, ctx: any, info: any) {
            return comments.filter((comment) => comment.author === parent.id);
        }
    },
    Comment: {
        author(parent: IComment, args: any, ctx: any, info: any) {
            return users.find((user) => user.id === parent.author);
        },
        post(parent: IComment, args: any, ctx: any, info: any) {
            return posts.find((post) => post.id === parent.post);
        }
    }
};

const server: GraphQLServer = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log("Server is running on http://localhost:4000");
});
