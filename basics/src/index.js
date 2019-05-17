import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Demo User data
let users = [{
    id: "1",
    name: "fellini",
    email: "yes@no.com",
    age: 22,
}, {
    id: "2",
    name: "benigni",
    email: "wefvcrw@iwh.com",
    age: 33,
}, {
    id: "3",
    name: "pasolini",
    email: "vrw@erwf.com",
}]

let posts = [{
    id: "4",
    title: "hello world",
    body: "my first post",
    published: true,
    author: "1",
}, {
    id: "5",
    title: "GoT sucks",
    body: "what a shame",
    published: true,
    author: "2",
}, {
    id: "6",
    title: "Hamiltion greatest F1 driver",
    body: "ONE of the greatest",
    published: false,
    author: "3",
}]

let comments = [{
    id: "7",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod fugit officiis similique veritatis. Eveniet provident necessitatibus a, illo libero, porro earum inventore eum tenetur officiis, iste facilis, et nobis excepturi.",
    author: "1",
    post: "4"
}, {
    id: "8",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi perferendis dolorem voluptatibus, quaerat id ducimus eaque maxime quia eius laudantium quibusdam tempore obcaecati doloribus ea dignissimos eos earum, voluptates dolor!",
    author: "2",
    post: "4"
}, {
    id: "9",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui omnis, debitis tenetur consequuntur doloribus, eligendi, atque dignissimos unde vero excepturi reiciendis, numquam in maxime temporibus ratione nam corporis. Consequatur, aliquid.",
    author: "3",
    post: "5"
}, {
    id: "10",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit quos inventore laudantium veritatis velit porro aut vel, doloribus animi itaque necessitatibus ipsa nisi, odit earum incidunt, a vitae neque quidem!",
    author: "3",
    post: "6"
}]

// Type definitions (Application schema)
// This is done in the graphql language
// ! means that it will always return the particular type stated and not a null.
// Scalar Types: ID, String, Float, Int, Boolean
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
    }

    type Mutation {
        createUser(
            userData: CreateUserInput
        ): User!

        deleteUser(
            id: ID!
        ): User!

        createPost(
            postData: CreatePostInput
        ): Post!

        deletePost(
            id: ID!
        ): Post!

        createComment(
            commentData: CreateCommentInput
        ): Comment!

        deleteComment(
            id: ID!
        ): Comment!
    }

    input CreateUserInput {
        name: String!,
        email: String!,
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
// This resolves the graphql queries in the language in question, here it is JS.
// Resolvers have 4 arguments; parent, args, ctx, info
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }

            return users.filter( (user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            })
        },

        me() {
            return {
                id: '123asd',
                name: 'Fellini',
                email: 'qa@ws.com'
            };
        },

        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }

            return posts.filter( ({ title, body }) => {
                return title.toLowerCase().includes(args.query.toLowerCase()) || body.toLowerCase().includes(args.query.toLowerCase())
            })
        },

        comments(parent, args, ctx, info) {
            if (!args.query) {
                return comments;
            }

            return comments.filter( comment => comment.text.toLowerCase().includes(args.query.toLowerCase()) );
        }
    },

    Mutation: {
        createUser(parent, args, ctx, info) {
            // emailTaken ensures that we do not create user with the same email
            const emailTaken = users.some( user => user.email === args.userData.email );

            if (emailTaken) {
                throw new Error('Email Taken!\n\n');
            };

            // This is where the type is actually created by storing the argument values inside of a new object
            const user = {
                id: uuidv4(),
                // We can now use the spread operator which was imported into our .babelrc file instead of individually calling args to copy our data...
                /*
                name: args.name,
                email: args.email,
                age: args.age
                */
                ...args.userData
            };

            // The object is then 'saved' by pushing it in the users array created above.
            // Real worl scenario would look more like 'user.save' if you're using mongodb.
            users.push(user);

            return user;
        },

        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex( user => user.id === args.id );

            if (userIndex === -1) {
                throw new Error(`404 - User not found!`)
            }

            const deletedUsers = users.splice(userIndex, 1);

            // If we delete the user, we need to also delete the users posts and comments
            posts = posts.filter( post => {

                // this expression will return the posts that belong to the deleted user and storing them in match.
                const match = post.author === args.id;

                // now we can delete the comments that belong to said post.
                // Return the comments that DO NOT BELONG to the post getting deleted.
                if (match) {
                    comments = comments.filter( comment => comment.post !== post.id );
                }

                // Now we can return all posts that DO NOT BELONG to the user being deleted.
                return !match;
            });

            // FINALLY, we can now delete all of the deleted user's comments.
            // We return comments that DO NOT BELING to the deleted User.
            comments = comments.filter( comment => comment.author !== args.id );

            return deletedUsers[0];
        },

        createPost(parent, args, ctx, info) {
            const userExists = users.some( user => user.id === args.postData.author );

            if (!userExists) {
                throw new Error('404 - User not found!');
            }

            const post = {
                id: uuidv4(),
                /*
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
                */
                ...args.postData
            };

            posts.push(post);

            return post;
        },

        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex( post => post.id === args.id );

            if (postIndex === -1) {
                throw new Error('404 - Post not found!');
            }

            const deletedPosts = posts.splice(postIndex, 1);

            comments = comments.filter( comment => comment.post !== args.id );

            return deletedPosts[0];
        },

        createComment(parent, args, ctx, info) {
            const userExists = users.some( user => user.id === args.commentData.author );
            const postExists = posts.some( post => post.id === args.commentData.post && post.published );

            if (!userExists) {
                throw new Error('404 - User not found!');
            } else if (!postExists) {
                throw new Error('404 - Post not found or has not yet been published!');
            }

            const comment = {
                id: uuidv4(),
                /*
                text: args.text,
                post: args.post,
                author: args.author
                */
                ...args.commentData
            };

            comments.push(comment);

            return comment;
        },

        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex( comment => comment.id === args.id );

            if (commentIndex === -1) {
                throw new Error('404 - Comment not found!')
            }

            const deletedComments = comments.splice(commentIndex, 1);

            return deletedComments[0];
        }
    },
    // Relationships
    // parent argument contains the Post, User or Comment data in an object.
    // users in the first instance refers to the custom type of author.
    Post: {
        author(parent, args, ctx, info) {
            // console.log('PARENT:', parent);
            // console.log('USERS:', users);
            return users.find( user => user.id === parent.author );
        },

        comments(parent, args, ctx, info) {
            return comments.filter( comment => comment.post === parent.id )
        }
    },

    User: {
        posts(parent, args, ctx, info) {
            return posts.filter( post => post.author === parent.id );
        },

        comments(parent, args, ctx, info) {
            return comments.filter( comment => comment.author === parent.id );
        }
    },

    Comment: {

        author(parent, args, ctx, info) {
            return users.find( user => user.id === parent.author );
        },

        post(parent, args, ctx, info) {
            return posts.find( post => post.id === parent.post );
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start( () => {
    console.log('Server is up!');
});
