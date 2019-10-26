import { IComment, IPost, IUser } from "./interfaces";

const posts: IPost[] =
[
    {
      id: "p001",
      title: "Plutorque",
      body: "Et aliqua ex eu voluptate laborum eu sunt exercitation aliqua irure.",
      published: true,
      author: "3"
    },
    {
      id: "p002",
      title: "Strozen",
      body: "Dolor sit et enim amet labore adipisicing.",
      published: false,
      author: "1"
    },
    {
      id: "p003",
      title: "Genmex",
      body: "Id et ex non do eiusmod.",
      published: false,
      author: "2"
    },
    {
      id: "p004",
      title: "Panzent",
      body: "Duis incididunt excepteur fugiat et.",
      published: true,
      author: "3"
    },
    {
      id: "p005",
      title: "Klugger",
      body: "Ipsum mollit magna proident culpa incididunt anim sit do.",
      published: false,
      author: "1"
    },
    {
      id: "p006",
      title: "Evidends",
      body: "Duis eu consectetur minim duis mollit elit incididunt non laborum dolor cupidatat in culpa irure.",
      published: true,
      author: "2"
    },
    {
      id: "p007",
      title: "Springbee",
      body: "Do excepteur commodo ipsum nulla.",
      published: true,
      author: "3"
    }
];

const users: IUser[] =
[
    {
        id: "1",
        name: "fellini",
        email: "fellini@ex.it",
        age: 29
    },
    {
        id: "2",
        name: "benigni",
        email: "benigni@ex.it",
        age: 44
    },
    {
        id: "3",
        name: "pasolini",
        email: "pasolini@ex.it",
        age: null
    }
];

const comments: IComment[] =
[
    {
      id: "c001",
      text: "Et occaecat duis aliquip nisi magna culpa est officia dolor non sint id ex exercitation. Proident culpa cillum dolore adipisicing eu ea anim velit cupidatat tempor eiusmod commodo. Consectetur Lorem sint eu mollit anim.",
      author: "1",
      post: "p001"
    },
    {
      id: "c002",
      text: "Quis consectetur aute ex nulla quis adipisicing proident esse enim ullamco nulla qui non officia. Dolore aliquip est laborum pariatur anim cillum ex mollit ullamco fugiat. Ex magna aliqua sint adipisicing Lorem velit nulla consectetur nulla amet ea nostrud velit.",
      author: "2",
      post: "p002"
    },
    {
      id: "c003",
      text: "Lorem laborum incididunt veniam cillum eu eiusmod aute officia occaecat et adipisicing aute incididunt nisi. Ut fugiat eiusmod Lorem consectetur enim. Dolor eiusmod pariatur aliqua pariatur culpa exercitation duis magna ullamco.",
      author: "3",
      post: "p003"
    },
    {
      id: "c004",
      text: "Lorem eiusmod laborum labore Lorem qui culpa anim minim labore ad. Labore magna eiusmod nostrud voluptate ea consequat eu aute anim et et eu cupidatat in. Fugiat nostrud duis proident nulla sint.",
      author: "1",
      post: "p004"
    }
];

export {users, posts, comments};
