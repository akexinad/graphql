import { IGqlCtx } from "../interfaces";

export const Subscription = {
    count: {
        subscribe(parent: any, args: any, { pubsub }: IGqlCtx, info: any) {
            let count = 0;

            setInterval(() => {
                count++;
                pubsub.publish("count", {
                    count
                });
            }, 1000);

            // async iterator takes a single argument called a channel name.
            return pubsub.asyncIterator("count");
        }
    }
};
