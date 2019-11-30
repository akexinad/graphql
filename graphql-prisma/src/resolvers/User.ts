import { GraphQLResolveInfo } from "graphql";
import { Args } from "graphql-binding/dist/types";
import { Context } from "graphql-yoga/dist/types";
import { IBlogUser, IPost } from "../interfaces";
import { getUserId } from "../utils/getUserId";

export const User = {

    email: {
        fragment: "fragment userId on User { id }",
        resolve(parent: IBlogUser, args: Args, { request }: Context, info: GraphQLResolveInfo): IBlogUser["email"] {

            const userId = getUserId(request, false);

            // Now we can hide the emails of users that do not belong to the unauthenticated user when
            // the authenticated user qeuries for users.
            if (userId && userId === parent.id) {
                return parent.email;
            } else {
                return null;
            }
        }
    },

    posts: {
        fragment: "fragment userId on User { id }",
        resolve(parent: IBlogUser, args: Args, { prisma }: Context, info: GraphQLResolveInfo): IPost["published"] {

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

    password(parent: IBlogUser, args: Args, { request }: Context, info: GraphQLResolveInfo): IBlogUser["password"] {
        return "";
    }
};
