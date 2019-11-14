import { IPost } from "../interfaces";

const POST_CHANNEL: string = "post";
const COMMENT_CHANNEL = (id: IPost["id"]): string => `comment ${ id }`;

export { POST_CHANNEL, COMMENT_CHANNEL };
