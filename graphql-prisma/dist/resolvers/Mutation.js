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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../utils/generateToken");
const getUserId_1 = require("../utils/getUserId");
const hashPassword_1 = require("../utils/hashPassword");
exports.Mutation = {
    createUser(parent, args, { prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const creationData = args.data;
            const hashedPassword = yield hashPassword_1.hashPassword(creationData.password);
            const user = yield prisma.mutation.createUser({
                data: Object.assign(Object.assign({}, creationData), { password: hashedPassword })
            });
            const token = generateToken_1.generateToken(user.id);
            return {
                user,
                token
            };
        });
    },
    updateUser(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = getUserId_1.getUserId(request);
            if (typeof args.data.password === "string") {
                args.data.password = yield hashPassword_1.hashPassword(args.data.password);
            }
            if (args) {
                return prisma.mutation.updateUser({
                    where: {
                        id: userId
                    },
                    data: args.data
                }, info);
            }
        });
    },
    deleteUser(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = getUserId_1.getUserId(request);
            return prisma.mutation.deleteUser({
                where: {
                    id: userId
                }
            }, info);
        });
    },
    login(parent, args, { prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginData = args.data;
            const existingUser = yield prisma.query.user({
                where: {
                    email: loginData.email
                }
            });
            if (!existingUser) {
                throw new Error("403: Unable to login");
            }
            const isMatch = yield bcryptjs_1.default.compare(loginData.password, existingUser.password);
            if (!isMatch) {
                throw new Error("403: Unable to login");
            }
            const jwtToken = generateToken_1.generateToken(existingUser.id);
            return {
                user: existingUser,
                token: jwtToken
            };
        });
    },
    createPost(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = getUserId_1.getUserId(request);
            const creationData = args.data;
            return prisma.mutation.createPost({
                data: {
                    title: creationData.title,
                    body: creationData.body,
                    published: creationData.published,
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            }, info);
        });
    },
    updatePost(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = args.data;
            const userId = getUserId_1.getUserId(request);
            const postExists = yield prisma.exists.Post({
                id: args.id,
                author: {
                    id: userId
                }
            });
            if (!postExists) {
                throw new Error("404: Unable to find post!");
            }
            const isPublished = yield prisma.exists.Post({
                id: args.id,
                published: true
            });
            if (isPublished && updateData.published === false) {
                yield prisma.mutation.deleteManyComments({
                    where: {
                        post: {
                            id: args.id
                        }
                    }
                });
            }
            return prisma.mutation.updatePost({
                where: {
                    id: args.id
                },
                data: updateData
            }, info);
        });
    },
    deletePost(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = getUserId_1.getUserId(request);
            const postExists = yield prisma.exists.Post({
                id: args.id,
                author: {
                    id: userId
                }
            });
            if (!postExists) {
                throw new Error("400: Unable to delete post.");
            }
            return prisma.mutation.deletePost({
                where: {
                    id: args.id
                }
            }, info);
        });
    },
    createComment(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const creationData = args.data;
            const userId = getUserId_1.getUserId(request);
            const publishedPost = yield prisma.exists.Post({
                id: creationData.post,
                published: true
            });
            if (!publishedPost) {
                throw new Error("404: Post not found!");
            }
            return prisma.mutation.createComment({
                data: {
                    text: creationData.text,
                    author: {
                        connect: {
                            id: userId
                        }
                    },
                    post: {
                        connect: {
                            id: creationData.post
                        }
                    }
                }
            }, info);
        });
    },
    updateComment(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = args.data;
            const userId = getUserId_1.getUserId(request);
            const commentExists = yield prisma.exists.Comment({
                id: args.id,
                author: {
                    id: userId
                }
            });
            if (!commentExists) {
                throw new Error("400: Unable to update comment.");
            }
            return prisma.mutation.updateComment({
                where: {
                    id: args.id
                },
                data: {
                    text: updateData.text
                }
            }, info);
        });
    },
    deleteComment(parent, args, { request, prisma }, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = getUserId_1.getUserId(request);
            const commentExists = yield prisma.exists.Comment({
                id: args.id,
                author: {
                    id: userId
                }
            });
            if (!commentExists) {
                throw new Error("400: Unable to delete comment.");
            }
            return prisma.mutation.deleteComment({
                where: {
                    id: args.id
                }
            }, info);
        });
    }
};
//# sourceMappingURL=Mutation.js.map