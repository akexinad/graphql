import "cross-fetch/polyfill";
/**
 * cross fetch is installed because node.js still does not have support for the
 * fetch API. See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

import ApolloBoost, { gql } from "apollo-boost";
import prisma from "../src/prisma";
import bcrypt from "bcryptjs";
import { IBlogUser } from "../src/interfaces";

const client = new ApolloBoost({
    uri: "http://localhost:4000"
});

beforeEach(async () => {
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    const userWithPosts: IBlogUser = await prisma.mutation.createUser({
        data: {
            name: "pasolini",
            email: "pasolini@ex.it",
            password: bcrypt.hashSync("chicken1234")
        }
    });

    await prisma.mutation.createPost({
        data: {
            title: "test title",
            body: "test body",
            published: true,
            author: {
                connect: {
                    id: userWithPosts.id
                }
            }
        }
    });

    await prisma.mutation.createPost({
        data: {
            title: "test draft title",
            body: "test draft body",
            published: false,
            author: {
                connect: {
                    id: userWithPosts.id
                }
            }
        }
    });
});

describe("the user mutation", () => {
    it("Should create a new user", async () => {
        const createUser = gql`
            mutation {
                createUser(
                    data: {
                        name: "fellini",
                        email: "fellini@ex.it",
                        password: "chicken1234"
                    }
                ) {
                    token,
                    user {
                        id
                        name
                        email
                    }
                }
            }
        `;

        const response = await client.mutate({
            mutation: createUser
        });

        const userExists = await prisma.exists.User({
            id: response.data.createUser.user.id
        });

        expect(userExists).toBe(true);
    });
});
