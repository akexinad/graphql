import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

import db from './db.js';

// RESOLVERS
// This resolves the graphql queries in the language in question, here it is JS.
// Resolvers have 4 arguments; parent, args, ctx, info
    // When can destructure ctx to just grab the db key which was passed into the context key below in the GraphQLServer.
const resolvers = {
    Query: {
        users(parent, args, { db }, info) {
            if (!args.query) {
                return db.users;
            }

            return db.users.filter( (user) => {
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

        posts(parent, args, { db }, info) {
            if (!args.query) {
                return db.posts;
            }

            return db.posts.filter( ({ title, body }) => {
                return title.toLowerCase().includes(args.query.toLowerCase()) || body.toLowerCase().includes(args.query.toLowerCase())
            })
        },

        comments(parent, args, { db }, info) {
            if (!args.query) {
                return db.comments;
            }

            return db.comments.filter( comment => comment.text.toLowerCase().includes(args.query.toLowerCase()) );
        }
    },

    Mutation: {
        createUser(parent, args, { db }, info) {
            // emailTaken ensures that we do not create user with the same email
            const emailTaken = db.users.some( user => user.email === args.userData.email );

            if (emailTaken) {
                throw new Error('Email Taken!\n\n');
            };

            // This is where the type is actually created by storing the argument values inside of a new object
            const user = {
                id: uuidv4(),
                // We can now use the spread operator which was imported into our .babelrc file instead of individually calling args to copy our data...
                /*
                name: args.name,
                email: args.email,
                age: args.age
                */
                ...args.userData
            };

            // The object is then 'saved' by pushing it in the users array created above.
            // Real worl scenario would look more like 'user.save' if you're using mongodb.
            db.users.push(user);

            return user;
        },

        deleteUser(parent, args, { db }, info) {
            const userIndex = db.users.findIndex( user => user.id === args.id );

            if (userIndex === -1) {
                throw new Error(`404 - User not found!`)
            }

            const deletedUsers = db.users.splice(userIndex, 1);

            // If we delete the user, we need to also delete the users posts and comments
            db.posts = db.posts.filter( post => {

                // this expression will return the posts that belong to the deleted user and storing them in match.
                const match = post.author === args.id;

                // now we can delete the comments that belong to said post.
                // Return the comments that DO NOT BELONG to the post getting deleted.
                if (match) {
                    db.comments = db.comments.filter( comment => comment.post !== post.id );
                }

                // Now we can return all posts that DO NOT BELONG to the user being deleted.
                return !match;
            });

            // FINALLY, we can now delete all of the deleted user's comments.
            // We return comments that DO NOT BELING to the deleted User.
            db.comments = db.comments.filter( comment => comment.author !== args.id );

            return deletedUsers[0];
        },

        createPost(parent, args, { db }, info) {
            const userExists = db.users.some( user => user.id === args.postData.author );

            if (!userExists) {
                throw new Error('404 - User not found!');
            }

            const post = {
                id: uuidv4(),
                /*
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
                */
                ...args.postData
            };

            db.posts.push(post);

            return post;
        },

        deletePost(parent, args, { db }, info) {
            const postIndex = db.posts.findIndex( post => post.id === args.id );

            if (postIndex === -1) {
                throw new Error('404 - Post not found!');
            }

            const deletedPosts = db.posts.splice(postIndex, 1);

            db.comments = db.comments.filter( comment => comment.post !== args.id );

            return deletedPosts[0];
        },

        createComment(parent, args, { db }, info) {
            const userExists = db.users.some( user => user.id === args.commentData.author );
            const postExists = db.posts.some( post => post.id === args.commentData.post && post.published );

            if (!userExists) {
                throw new Error('404 - User not found!');
            } else if (!postExists) {
                throw new Error('404 - Post not found or has not yet been published!');
            }

            const comment = {
                id: uuidv4(),
                /*
                text: args.text,
                post: args.post,
                author: args.author
                */
                ...args.commentData
            };

            db.comments.push(comment);

            return comment;
        },

        deleteComment(parent, args, { db }, info) {
            const commentIndex = db.comments.findIndex( comment => comment.id === args.id );

            if (commentIndex === -1) {
                throw new Error('404 - Comment not found!')
            }

            const deletedComments = db.comments.splice(commentIndex, 1);

            return deletedComments[0];
        }
    },
    // Relationships
    // parent argument contains the Post, User or Comment data in an object.
    // users in the first instance refers to the custom type of author.
    Post: {
        author(parent, args, { db }, info) {
            // console.log('PARENT:', parent);
            // console.log('USERS:', users);
            return db.users.find( user => user.id === parent.author );
        },

        comments(parent, args, { db }, info) {
            return db.comments.filter( comment => comment.post === parent.id )
        }
    },

    User: {
        posts(parent, args, { db }, info) {
            return db.posts.filter( post => post.author === parent.id );
        },

        comments(parent, args, { db }, info) {
            return db.comments.filter( comment => comment.author === parent.id );
        }
    },

    Comment: {

        author(parent, args, { db }, info) {
            return db.users.find( user => user.id === parent.author );
        },

        post(parent, args, { db }, info) {
            return db.posts.find( post => post.id === parent.post );
        }
    }
};

const server = new GraphQLServer({
    // typeDefs are always referenced from the root directory.
    typeDefs: './src/schema.graphql',
    resolvers,
    // context refers to the ctx resolver argument and we pass to it the db file which houses our demo or real production data.
    // Now ctx stores the db object.
    context: {
        db
    }
});

server.start( () => {
    console.log('Server is up!');
});
