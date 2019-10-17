import { GraphQLServer } from 'graphql-yoga';

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
      published: true
    },
    {
      id: "5da7b6ebf2039adc7e35e982",
      title: "Strozen",
      body: "Dolor sit et enim amet labore adipisicing.",
      published: false
    },
    {
      id: "5da7b6ebe68b9c3e53fe59b7",
      title: "Genmex",
      body: "Id et ex non do eiusmod.",
      published: false
    },
    {
      id: "5da7b6eb701d9ebcae5bf714",
      title: "Panzent",
      body: "Duis incididunt excepteur fugiat et.",
      published: true
    },
    {
      id: "5da7b6ebe3a3c6bd28c8ea0c",
      title: "Klugger",
      body: "Ipsum mollit magna proident culpa incididunt anim sit do.",
      published: false
    },
    {
      id: "5da7b6ebdc47f83cc3fafc35",
      title: "Evidends",
      body: "Duis eu consectetur minim duis mollit elit incididunt non laborum dolor cupidatat in culpa irure.",
      published: true
    },
    {
      id: "5da7b6ebd51aee136fa3af20",
      title: "Springbee",
      body: "Do excepteur commodo ipsum nulla.",
      published: true
    }
  ]

const users = [{
    id: '1',
    name: 'fellini',
    email: 'fellini@ex.it',
    age: 29
}, {
    id: '2',
    name: 'benigni',
    email: 'benigni@ex.it',
    age: 44
}, {
    id: '3',
    name: 'pasolini',
    email: 'pasolini@ex.it',
    age: null
}]
    
    
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
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
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('Server is running on http://localhost:4000');
});
