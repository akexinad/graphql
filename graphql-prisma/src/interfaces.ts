import { PubSub } from "graphql-yoga";
import { Prisma } from "prisma-binding";

export interface IBlogUser {
    id: string;
    name: string;
    email: string;
    password: string;
    age: number;
    comments: IComment[];
    posts: IPost[];
}

export interface IBookReviewsUser {
    id: string;
    username: string;
    reviews: string[];
}

export interface IReview {
    id: string;
    text: string;
    rating: number;
    book: IBook;
    author?: IBlogUser;
}

export interface IBook {
    id: string;
    title: string;
    author: string;
    isbn: string;
    reviews?: IReview[];
}

export interface IPost {
    id: string;
    title: string;
    body: string;
    published: boolean;
    author: IBlogUser["id"];
    comments?: IComment[];
}

export interface IPostForMutation {
    title?: string;
    body?: string;
    published?: boolean;
}

export interface IComment {
    id: string;
    text: string;
    author: IBlogUser["id"];
    post: IPost["id"];
}

export interface IGraphQLContext {
    db: {
        users: IBlogUser[];
        posts: IPost[];
        comments: IComment[];
    };
    pubsub: PubSub;
    prisma: Prisma;
}

export interface IUserArgs {
    data: IBlogUser;
}

export interface IUpdateUser {
    id: IBlogUser["id"];
    data: IBlogUser;
}

export interface IPostArgs {
    data: IPost;
}

export interface IUpdatePost {
    id: IPost["id"];
    data: IPost;
}

export interface ICommentArgs {
    data: IComment;
}

export interface IUpdateComment {
    id: IComment["id"];
    data: IComment;
}

export interface IAuthPayload {
    user: IBlogUser;
    token: string;
}
