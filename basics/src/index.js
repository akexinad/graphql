import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db.js';

// RESOLVERS
    // This resolves the graphql queries in the language in question, here it is JS.
    // Resolvers have 4 arguments; parent, args, ctx, info
    // When can destructure ctx to just grab the db key which was passed into the context key below in the GraphQLServer.
// RELATIONSHIPS
    // the 'parent' argument contains the Post, User or Comment data in an object.
    // users in the first instance refers to the custom type of author.
import Query from './resolvers/Query.js';
import Mutation from './resolvers/Mutation.js';
import Subscription from './resolvers/Subscription.js';
import User from './resolvers/User.js';
import Post from './resolvers/Post.js';
import Comment from './resolvers/Comment.js';

const pubsub = new PubSub();

const server = new GraphQLServer({
    // typeDefs are always referenced from the root directory.
    typeDefs: './src/schema.graphql',
    // Resolvers from above need to be passed into the GraphQLServer.
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
    },
    // context refers to the ctx resolver argument and we pass to it the db file which houses our demo or real production data.
    // Now ctx stores the db object.
    context: {
        db,
        pubsub
    }
});

server.start( () => {
    console.log('Server is up on http://localhost:4000');
});
