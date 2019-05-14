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
    author: "1",
}, {
    id: "5",
    title: "GoT sucks",
    body: "what a shame",
    published: true,
    author: "2",
}, {
    id: "6",
    title: "Hamiltion greatest F1 driver",
    body: "ONE of the greatest",
    published: false,
    author: "3",
}]

const comments = [{
    id: "7",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod fugit officiis similique veritatis. Eveniet provident necessitatibus a, illo libero, porro earum inventore eum tenetur officiis, iste facilis, et nobis excepturi.",
    author: "1",
    post: "4"
}, {
    id: "8",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi perferendis dolorem voluptatibus, quaerat id ducimus eaque maxime quia eius laudantium quibusdam tempore obcaecati doloribus ea dignissimos eos earum, voluptates dolor!",
    author: "2",
    post: "4"
}, {
    id: "9",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui omnis, debitis tenetur consequuntur doloribus, eligendi, atque dignissimos unde vero excepturi reiciendis, numquam in maxime temporibus ratione nam corporis. Consequatur, aliquid.",
    author: "3",
    post: "5"
}, {
    id: "10",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit quos inventore laudantium veritatis velit porro aut vel, doloribus animi itaque necessitatibus ipsa nisi, odit earum incidunt, a vitae neque quidem!",
    author: "3",
    post: "6"
}]

// Type definitions (Application schema)
// This is done in the graphql language
// ! means that it will always return the particular type stated and not a null.
// Scalar Types: ID, String, Float, Int, Boolean
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        },
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return comments;
            }

            return comments.filter( comment => comment.text.toLowerCase().includes(args.query.toLowerCase()) );
        }
    },
    // Relationships
    Post: {
        author(parent, args, ctx, info) {
            return users.find( user => user.id === parent.author );
        },
        comments(parent, args, ctx, info) {
            return comments.filter( comment => comment.post === parent.id )
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter( post => post.author === parent.id );
        },
        comments(parent, args, ctx, info) {
            return comments.filter( comment => comment.author === parent.id );
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find( user => user.id === parent.author );
        },
        post(parent, args, ctx, info) {
            return posts.find( post => post.id === parent.post );
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
