// See https://github.com/prisma/graphql-yoga for info and documentation

const Subscription = {
    // NOTE: COUNT IS ONLY A DEMO SUBSRIPTION!!!
    // count is our subscription type, and we pass the subscribe function to it.
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;

            setInterval( () => {
                // data changes
                count ++;

                // the change in data is then published. Not how the channel name 'count' is the same for both asyncIterator() and publish().
                pubsub.publish('count', {
                    // KEY: subscription name | VALUE: what expect back from the define subscription.
                    // In this instance key and value are both the same name.
                    // count: count
                    count
                })
            }, 1000);

            // the asyncIterator() is like the chat room/channel through which the data is fed and presented to the client.
            return pubsub.asyncIterator('count');
        }
    },

    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info) {

            // We need to find the post to which the comment belongs.
            const post = db.posts.find( post => post.id === postId && post.published );

            if (!post) {
                throw new Error('404 - Post not found!');
            }

            return pubsub.asyncIterator(`comment of postId: ${ postId }`);

            // comments are created in the Mutation file, so this is where pubsub.publish() would best be called.
        }
    },

    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator('post');
            // Again, its best to invoke .publish() where the post actually gets created.
        }
    }
};

export { Subscription as default };
