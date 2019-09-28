import express, { Application } from 'express';

class App {

    public express: Application;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello There!'
            });
        });
        this.express.use('/', router);
    }
}

export default new App().express;
