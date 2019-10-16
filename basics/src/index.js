import { GraphQLServer } from 'graphql-yoga';

// To build the API, we need 2 things:
    // 1. TYPE DEFINITIONS.
        // This is the APPLICATION SCHEMA, the entities/model that we will be using.
    // 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.

    
const typeDefs = `
    type Query {
        add(a: Int!, b: Int!): Int!
        greeting(name: String, position: String): String!
        me: User!
        myPost: Post!
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
        author: User!
    }
`

const resolvers = {
    Query: {
        add(parent, { a, b }, ctx, info) {
            return a + b;
        },
        // There are 4 arguments that get passed to all resolver functions
        greeting(parent, args, ctx, info) {
            console.log(args);
            
            return args.name ? `Hello ${ args.name }, you are my favourite ${ args.position }` : 'Hello!'
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
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('Server is running on http://localhost:4000');
});
