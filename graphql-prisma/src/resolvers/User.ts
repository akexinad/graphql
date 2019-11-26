import { GraphQLResolveInfo } from "graphql";
import { Context } from "graphql-yoga/dist/types";
import { IBlogUser, IComment, IGraphQLContext, IPost } from "../interfaces";
import { getUserId } from "../utils/getUserId";

export const User = {

    email(parent: IBlogUser, args: any, { request }: Context, info: GraphQLResolveInfo): IBlogUser["email"] {

        const userId = getUserId(request, false);

        // Now we can hide the emails of users that do not belong to the unauthenticated user when
        // the authenticated user qeuries for users.
        if (userId && userId === parent.id) {
            return parent.email;
        } else {
            return null;
        }
    }
};
