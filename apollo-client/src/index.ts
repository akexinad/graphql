import ApolloBoost, { gql } from "apollo-boost";

const client = new ApolloBoost({
    uri: "http://localhost:4000"
});

console.log("hello world");

const getUsers = gql`
    query {
        users {
            id
            name
        }
    }
`;

const getPosts = gql`
    query {
        posts {
            title
            body
            author {
                name
            }
        }
    }
`;

// client
//     .query({
//         query: getUsers
//     })
//     .then((response) => {
//         let html = "";

//         response.data.users.forEach((user: any) => {
//             html += `
//                 <div>
//                     <h3>${ user.name}</h3>
//                 </div>
//             `;
//         });

//         // @ts-ignore
//         document.getElementById("users").innerHTML = html;
//     });

client
    .query({
        query: getPosts,
    })
    .then((response) => {
        console.log(response);

        let html = "";

        response.data.posts.forEach((post: any) => {
            html += `
                <div>
                    <h3>${ post.title }</h3>
                    <p>${ post.body }</p>
                    <p>BY: ${ post.author.name }</p>
                </div>
            `;
        });

        // @ts-ignore
        document.getElementById("posts").innerHTML = html;
    });
