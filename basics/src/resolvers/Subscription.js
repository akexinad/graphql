// See https://github.com/prisma/graphql-yoga for info and documentation

const Subscription = {
    // count is our subsrcipton type, and we pass the subscribe function to it.
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;

            setInterval( () => {
                // data changes
                count ++;

                // the change in data is then published. Not how the channel name 'count' is the same for both asyncIterator() and publish().
                pubsub.publish('count', {
                    // key and value are both the same name.
                    count
                })
            }, 1000);

            // the asyncIterator() is like the chat room/channel through which the data is fed and presented to the client.
            return pubsub.asyncIterator('count');
        }
    }
};

export { Subscription as default };
