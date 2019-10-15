import { GraphQLServer } from 'graphql-yoga';

// To build the API, we need 2 things:
    // 1. TYPE DEFINITIONS.
        // This is the APPLICATION SCHEMA, the entities/model that we will be using.
    // 2. RESOLVERS ARE IN THE NATIVE LANGUAGE.

    
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

const resolvers = {
    Query: {
        title() {
            return 'If this is a man';
        },
        price() {
            return 44.99;
        },
        releaseYear() {
            return null;
        },
        rating() {
            return 4.9;
        },
        inStock() {
            return true;
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
