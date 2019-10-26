import { PubSub } from "graphql-yoga";

export interface IUser {
    id: string;
    name: string;
    email: string;
    age?: number;
    posts?: IPost[];
}

export interface IPost {
    id: string;
    title: string;
    body: string;
    published: boolean;
    author: IUser["id"];
    comments?: IComment[];
}

export interface IComment {
    id: string;
    text: string;
    author: IUser["id"];
    post: IPost["id"];
}

export interface IGqlCtx {
    db: {
        users: IUser[];
        posts: IPost[];
        comments: IComment[];
    };
    pubsub: PubSub;
}

export interface IUserArgs {
    data: IUser;
}

export interface IUpdateUser {
    id: IUser["id"];
    data: IUser;
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
