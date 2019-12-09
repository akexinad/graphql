import "cross-fetch/polyfill";
/**
 * cross fetch is installed because node.js still does not have support for the
 * fetch API. See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

import ApolloBoost, { gql, ExecutionResult } from "apollo-boost";
import prisma from "../src/prisma";

const client = new ApolloBoost({
    uri: "http://localhost:4000"
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
            // id: "ck3y6li1y00110707xbhqhs5m"
        });

        expect(userExists).toBe(true);
    });
});
