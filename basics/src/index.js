import { GraphQLServer } from 'graphql-yoga';

// Demo User data
const users = [{
    id: "1",
    name: "fellini",
    email: "yes@no.com",
    age: 22,
}, {
    id: "2",
    name: "benigni",
    email: "wefvcrw@iwh.com",
    age: 33,
}, {
    id: "3",
    name: "pasolini",
    email: "vrw@erwf.com",
}]

const posts = [{
    id: "4",
    title: "hello world",
    body: "my first post",
    published: true,
    author: "1"
}, {
    id: "5",
    title: "GoT sucks",
    body: "what a shame",
    published: true,
    author: "2"
}, {
    id: "6",
    title: "Hamiltion greatest F1 driver",
    body: "ONE of the greatest",
    published: false,
    author: "3"
}]

// Type definitions (Application schema)
// This is done in the graphql language
// ! means that it will always return the particular type stated and not a null.
// Scalar Types: ID, String, Float, Int, Boolean
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`

// Resolvers
// This resolves the graphql queries in the language in question, here it is JS.
// Resolvers have 4 arguments; parent, args, ctx, info
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }

            return users.filter( (user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            })
        },
        me() {
            return {
                id: '123asd',
                name: 'Fellini',
                email: 'qa@ws.com'
            };
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }

            return posts.filter( ({ title, body }) => {
                return title.toLowerCase().includes(args.query.toLowerCase()) || body.toLowerCase().includes(args.query.toLowerCase())
            })
        }
    },
    // Relationships
    Post: {
        author(parent, args, ctx, info) {
            return users.find( user => user.id === parent.author);
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter( post => post.author === parent.id);
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start( () => {
    console.log('Server is up!');
});
