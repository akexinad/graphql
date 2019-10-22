import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// To build the API, we need 2 things:
    // 1. TYPE DEFINITIONS.
        // This is the APPLICATION SCHEMA, the entities/model that we will be using.
    // 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.

// Demo user data

const posts = [
    {
      id: "5da7b6eba53428f1b20c722f",
      title: "Plutorque",
      body: "Et aliqua ex eu voluptate laborum eu sunt exercitation aliqua irure.",
      published: true,
      author: '3'
    },
    {
      id: "5da7b6ebf2039adc7e35e982",
      title: "Strozen",
      body: "Dolor sit et enim amet labore adipisicing.",
      published: false,
      author: '1'
    },
    {
      id: "5da7b6ebe68b9c3e53fe59b7",
      title: "Genmex",
      body: "Id et ex non do eiusmod.",
      published: false,
      author: '2'
    },
    {
      id: "5da7b6eb701d9ebcae5bf714",
      title: "Panzent",
      body: "Duis incididunt excepteur fugiat et.",
      published: true,
      author: '3'
    },
    {
      id: "5da7b6ebe3a3c6bd28c8ea0c",
      title: "Klugger",
      body: "Ipsum mollit magna proident culpa incididunt anim sit do.",
      published: false,
      author: '1'
    },
    {
      id: "5da7b6ebdc47f83cc3fafc35",
      title: "Evidends",
      body: "Duis eu consectetur minim duis mollit elit incididunt non laborum dolor cupidatat in culpa irure.",
      published: true,
      author: '2'
    },
    {
      id: "5da7b6ebd51aee136fa3af20",
      title: "Springbee",
      body: "Do excepteur commodo ipsum nulla.",
      published: true,
      author: '3'
    }
  ]

const users = [
    {
        id: '1',
        name: 'fellini',
        email: 'fellini@ex.it',
        age: 29
    },
    {
        id: '2',
        name: 'benigni',
        email: 'benigni@ex.it',
        age: 44
    },
    {
        id: '3',
        name: 'pasolini',
        email: 'pasolini@ex.it',
        age: null
    }
]

const comments = [
    {
      id: "5da7e1153a6ae60359a271e1",
      text: "Et occaecat duis aliquip nisi magna culpa est officia dolor non sint id ex exercitation. Proident culpa cillum dolore adipisicing eu ea anim velit cupidatat tempor eiusmod commodo. Consectetur Lorem sint eu mollit anim.",
      author: '1',
      post: '5da7b6eba53428f1b20c722f'
    },
    {
      id: "5da7e1155093c31e3c4c91fd",
      text: "Quis consectetur aute ex nulla quis adipisicing proident esse enim ullamco nulla qui non officia. Dolore aliquip est laborum pariatur anim cillum ex mollit ullamco fugiat. Ex magna aliqua sint adipisicing Lorem velit nulla consectetur nulla amet ea nostrud velit.",
      author: '2',
      post: '5da7b6ebf2039adc7e35e982'
    },
    {
      id: "5da7e11541d408b8284fbe30",
      text: "Lorem laborum incididunt veniam cillum eu eiusmod aute officia occaecat et adipisicing aute incididunt nisi. Ut fugiat eiusmod Lorem consectetur enim. Dolor eiusmod pariatur aliqua pariatur culpa exercitation duis magna ullamco.",
      author: '3',
      post: '5da7b6ebe68b9c3e53fe59b7'
    },
    {
      id: "5da7e115f841901d0464ac24",
      text: "Lorem eiusmod laborum labore Lorem qui culpa anim minim labore ad. Labore magna eiusmod nostrud voluptate ea consequat eu aute anim et et eu cupidatat in. Fugiat nostrud duis proident nulla sint.",
      author: '1',
      post: '5da7b6eb701d9ebcae5bf714'
    }
  ]
    
    
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        comments(query: String): [Comment!]!
        me: User!
        myPost: Post!
    }

    type Mutation {
        createUser(
            name: String!,
            email: String!,
            age: Int
        ): User!

        createPost(
            title: String!
            body: String!
            published: Boolean!
            author: ID!
        ): Post!

        createComment(
            text: String!
            author: ID!
            post: ID!
        ): Comment!
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
`

const resolvers = {
    Query: {
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return comments;
            }

            const query = args.query.toLowerCase();

            return comments.filter(comment => comment.text.toLowerCase().includes(query));
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            const query = args.query.toLowerCase();

            return posts.filter(post => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query));
        },
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }

            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
        },
        me() {
            return {
                id: '123098',
                name: 'fellini',
                email: 'fellini@rome.it'
            }
        },
        myPost() {
            return {
                id: '123456',
                title: 'this is my post title',
                body: 'a very very very very long time ago...',
                published: true,
                author: {
                    id: '123098',
                    name: 'fellini',
                    email: 'fellini@rome.it'
                }
            }
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.email);

            if (emailTaken) {
                throw new Error('Email has already been taken.');
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

            const user = {
                id: uuidv4(),
                ...args
            }

            users.push(user);

            return user;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.author);

            if (!userExists) {
                throw new Error('404: User not found');
            }

            const post = {
                id: uuidv4(),
                ...args
            }

            posts.push(post);

            return post;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.author);
            const postExists = posts.some(post => post.id === args.post && post.published);

            if (!userExists || !postExists) {
                throw new Error('404: User or post not found');
            }

            const comment = {
                id: uuidv4(),
                ...args
            }

            comments.push(comment);

            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author);
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.post === parent.id);
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author === parent.id);
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id);
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author);
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.post);
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('Server is running on http://localhost:4000');
});
