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

export interface ICtx {
    users: IUser[];
    posts: IPost[];
    comments: IComment[];
}

export interface IUserArgs {
    data: IUser;
}

export interface IPostArgs {
    data: IPost;
}

export interface ICommentArgs {
    data: IComment;
}
