"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUserId_1 = require("../utils/getUserId");
exports.Subscription = {
    comment: {
        subscribe(parent, args, { prisma }, info) {
            // PRISMA has built-in support for subscriptions
            /*

            The operation arguments tell that we want to only
            subscribe to posts of the id passed into the arguments

            */
            const operationArguments = {
                where: {
                    node: {
                        post: {
                            id: args.postId
                        }
                    }
                }
            };
            return prisma.subscription.comment(operationArguments, info);
        }
    },
    post: {
        subscribe(parent, args, { prisma }, info) {
            // subscribe to posts that are published ONLY.
            const operationArguments = {
                where: {
                    node: {
                        published: true
                    }
                }
            };
            return prisma.subscription.post(operationArguments, info);
        }
    },
    myPost: {
        subscribe(parent, args, { request, prisma }, info) {
            const userId = getUserId_1.getUserId(request);
            const operationArguments = {
                where: {
                    node: {
                        author: {
                            id: userId
                        }
                    }
                }
            };
            return prisma.subscription.post(operationArguments, info);
        }
    }
};
//# sourceMappingURL=Subscription.js.map