"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUserId_1 = require("../utils/getUserId");
exports.User = {
    email: {
        fragment: "fragment userId on User { id }",
        resolve(parent, args, { request }, info) {
            const userId = getUserId_1.getUserId(request, false);
            // Now we can hide the emails of users that do not belong to the unauthenticated user when
            // the authenticated user qeuries for users.
            if (userId && userId === parent.id) {
                return parent.email;
            }
            else {
                return null;
            }
        }
    },
    posts: {
        fragment: "fragment userId on User { id }",
        resolve(parent, args, { prisma }, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            });
        }
    },
    password(parent, args, { request }, info) {
        return "";
    }
};
//# sourceMappingURL=User.js.map