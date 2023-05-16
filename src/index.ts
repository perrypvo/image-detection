import express, {Express} from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import { config } from './config/config';
import imageRoutes from './routes/images'
import Logging from './utilities/logging';

const router : Express = express();

// Connect to mongo db database
mongoose
    .connect (config.mongodb.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Mongodb connected!');
        StartServer();  // only start REST server when mongodb is connected
    })
    .catch((error) => {Logging.error(error.message)});

// Start REST server
const StartServer = () => {
    Logging.info('Starting REST server...');
    router.use(compression());
    router.use(bodyParser.json())

    router.use((req, res, next) => {
        /** Log the req */
        Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}]`);

        res.on('finish', () => {
            /** Log the res */
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}]`);
        });
        next();
    });

    /** Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ hello: 'world' }));

    /** Handling Routes */
    router.use('/', imageRoutes);

    // Run server:
    const server = http.createServer(router);
    server.listen(config.server.port, () => {
        Logging.info (`Server running on https://localhost:${config.server.port}`);
    })
}

export default router;