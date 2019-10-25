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
