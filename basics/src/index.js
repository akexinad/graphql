import { GraphQLServer } from 'graphql-yoga';

// Type definitions (Application schema)
// This is done in the graphql language
// Similar to db models
// ! means that it will always return the particular type stated and never a null.
// Type: String, Float, Int, Boolean
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

// Resolvers
// This resolves the graphql queries in the language in question, here it is JS.
const resolvers = {

    Query: {
        title() {
            return 'Meditations';
        },
        price() {
            return '34.89';
        },
        releaseYear() {
            return 1990;
        },
        rating() {
            return null;
        },
        inStock() {
            return true;
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
