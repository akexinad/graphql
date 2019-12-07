module.exports = async () => {
    // @ts-ignore
    await global.httpServer.close();
};
