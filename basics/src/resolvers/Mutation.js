import uuidv4 from 'uuid/v4';

const Mutation = {
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

    updateUser(parent, args, { db }, info) {
        // destructuring args
        const { id, userData } = args;

        const user = db.users.find( user => user.id === id );

        // checking if there is actually a user.
        if (!user) {
            throw new Error('404 - User not found!');
        }

        // Ensuring that the correct types are passed into the database.
        if (typeof userData.email === 'string') {
            const emailTaken = db.users.some( user => user.email === userData.email );

            if (emailTaken) {
                throw new Error('400 - Email Taken!');
            }

            user.email = userData.email;
        }

        if (typeof userData.name === 'string') {
            user.name = userData.name;
        }

        if (typeof userData.age !== 'undefined') {
            user.age = userData.age;
        }

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

    createPost(parent, args, { db, pubsub }, info) {
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

        // Check to see if the post.published is set to true.
        if (args.postData.published) {
            pubsub.publish('post', {
                post: {
                    // This object passed into post corresponds to the PostSubscriptionPayload type.
                    // Instead of just passing the post data, we pass the post and the kind of mutation that occured.
                    mutation: 'CREATED',
                    data: post
                }
            });
        }

        return post;
    },

    updatePost(parent, args, { db, pubsub }, info) {
        const { id, postData } = args;
        const post = db.posts.find( post => post.id === id );
        // We need to compare the original post and the updated posts
        // In order to know when to fire off subscription events.
        const originalPost = { ...post };

        if (!post) {
            throw new Error('404 - Post not found!');
        }

        if (typeof postData.title === 'string') {
            post.title = postData.title;
        }

        if (typeof postData.body === 'string') {
            post.body = postData.body;
        }

        if (typeof postData.published === 'boolean') {
            post.published = postData.published;

            if (originalPost.published && !post.published) {
                // if the post has been updated to published: false
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                // if the post has been updated to published: true
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })

            }
        } else if (post.published) {
            // if the post has been edited and published is true, send off an event and notify the client.
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post;
    },

    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex( post => post.id === args.id );

        if (postIndex === -1) {
            throw new Error('404 - Post not found!');
        }

        // Array destructuring
        // const deletedPosts = db.posts.splice(postIndex, 1);
        // Becomes...
        const [ deletedPost ] = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter( comment => comment.post !== args.id );

        if (deletedPost.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost
                }
            })
        }

        return deletedPost
    },

    createComment(parent, args, { db, pubsub }, info) {
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

        pubsub.publish(`comment of postId: ${ args.commentData.post }`, {
            comment
        });

        return comment;
    },

    updateComment(parent, args, { db }, info) {
        const { id, commentData } = args;
        const comment = db.comments.find( comment => comment.id === id );

        if (!comment) {
            throw new Error('404 - Comment not found!');
        }

        if (typeof commentData.text === 'string') {
            comment.text = commentData.text;
        }

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
};

export { Mutation as default };
