// note that these files are not processed by babel like the rest of the test suites which means
// that we need to add polyfill.
// tslint:disable-next-line: no-var-requires
// require("babel-register");
// tslint:disable-next-line: no-var-requires
// require("@babel/polyfill/noConflict");

// const server = require("../../dist/server");
import { server } from "../../src/server";

module.exports = async () => {
    // @ts-ignore
    global.httpServer = await server.start({ port: 4000 });
};
