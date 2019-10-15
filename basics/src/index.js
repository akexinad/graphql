import { GraphQLServer } from 'graphql-yoga';

// To build the API, we need 2 things:
    // 1. TYPE DEFINITIONS.
        // This is the APPLICATION SCHEMA, the entities/model that we will be using.
    // 2. RESOLVERS IN THE NATIVE LANGUAGE.

    
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        isEngineer: Boolean!
        gpa: Float
    }
`

const resolvers = {
    Query: {
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('Server is running on http://localhost:4000');
});
