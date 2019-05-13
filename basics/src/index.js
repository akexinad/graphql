import { GraphQLServer } from 'graphql-yoga';

// Type definitions (Application schema)
// This is done in the graphql language
// Similar to db models
// ! means that it will always return the particular type stated and never a null.
// Scalar Types: ID, String, Float, Int, Boolean
const typeDefs = `
    type Query {
        add(
            a: Float!,
            b: Float!
        ): Float!
        greeting(
            name: String,
            position: String
        ): String!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
// This resolves the graphql queries in the language in question, here it is JS.
// Resolvers have 4 arguments; parent, args, ctx, info
const resolvers = {
    Query: {
        add(parent, {a, b}) {
            return a + b;
        },
        greeting(parent, args, ctx, info) {
            if (args.name && args.position) {
                return `Hello ${ args.name }. Do you enjoy being a ${ args.position }?`
            }

            return 'Hello!'
        },
        me() {
            return {
                id: '123asd',
                name: 'Fellini',
                email: 'qa@ws.com'
            };
        },
        post() {
            return {
                id: '123qwe',
                title: 'ricotta',
                body: 'ligi likes ricotta',
                published: true
            };
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
