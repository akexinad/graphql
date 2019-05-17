// Demo User data
const users = [{
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

const posts = [{
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

const comments = [{
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

const db = {
    users,
    posts,
    comments
}

export { db as default };
