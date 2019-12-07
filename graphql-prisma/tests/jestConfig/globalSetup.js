// note that these files are not processed by babel like the rest of the test suites which means
// that we need to add polyfill.
require("babel-register");
require("@babel/polyfill/noConflict");

const server = require("../../dist/server");

module.exports = async () => {
    global.httpServer = await server.start({ port: 4000 });
};
