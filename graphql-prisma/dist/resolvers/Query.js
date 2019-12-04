"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUserId_1 = require("../utils/getUserId");
exports.Query = {
    users(parent, args, { prisma }, info) {
        const { first, skip, after, orderBy } = args;
        const operationArguments = {
            first,
            skip,
            after,
            orderBy
        };
        if (args.query) {
            // @ts-ignore
            operationArguments.where = {
                OR: [{
                        name_contains: args.query
                    }]
            };
        }
        /*
        Below you can pass three distinct values for the second argument:
        1. Nothing
        2. A string, which is what we were doing in the prisma file
        3. An object
        */
        return prisma.query.users(operationArguments, info);
    },
    posts(parent, args, { prisma }, info) {
        const { first, skip, after, orderBy } = args;
        const operationArguments = {
            first,
            skip,
            after,
            orderBy,
            where: {
                published: true,
            }
        };
        if (args.query) {
            // @ts-ignore
            operationArguments.where.OR = [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }];
        }
        return prisma.query.posts(operationArguments, info);
    },
    comments(parent, args, { prisma }, info) {
        const { first, skip, after, orderBy } = args;
        const operationArguments = {
            first,
            skip,
            after,
            orderBy
        };
        if (args.query) {
            // @ts-ignore
            operationArguments.where = {
                text_contains: args.query
            };
        }
        return prisma.query.comments(operationArguments, info);
    },
    me(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = getUserId_1.getUserId(request);
            return prisma.query.user({
                where: {
                    id: userId
                }
            });
        });
    },
    post(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = getUserId_1.getUserId(request, false);
            const posts = yield prisma.query.posts({
                where: {
                    id: args.id,
                    OR: [{
                            published: true
                        }, {
                            author: {
                                id: userId
                            }
                        }]
                }
            }, info);
            if (posts.length === 0) {
                throw new Error("404: Post not found!");
            }
            return posts[0];
        });
    },
    myPosts(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = getUserId_1.getUserId(request);
            const { first, skip, after, orderBy } = args;
            const operationArguments = {
                first,
                skip,
                after,
                orderBy,
                where: {
                    author: {
                        id: userId
                    }
                }
            };
            if (args.qeury) {
                // @ts-ignore
                operationArguments.where.OR = [{
                        title_contains: args.query
                    }, {
                        body_contains: args.query
                    }];
            }
            return prisma.query.posts(operationArguments, info);
        });
    }
};
//# sourceMappingURL=Query.js.map