import { server } from "./server";

// heroku will inject an environment variable which exists on heroku, and there is only accessible from heroku.
server.start({ port: process.env.PORT || 4000 }, () => {
    console.log(`Server is running on ${ process.env.PORT ? process.env.PORT : "http://localhost:4000" }`);
});
