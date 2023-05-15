import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import { config } from './config/config';
import imageRoutes from './routes/images'

const MONGO_URL = 'mongodb+srv://perrypvo:AdMiNuSeR@cluster0.vpxyhhl.mongodb.net/?retryWrites=true&w=majority'

const router = express();

// Connect to mongo db database
mongoose
    .connect (config.mongodb.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('Mongodb connected!');
        StartServer();
    })
    .catch((error) => {console.log(error.message)});

// Start REST server
const StartServer = () => {
    console.log('Starting REST server...');
    router.use(compression());
    router.use(bodyParser.json())    
    router.use((req, res, next) => {
        /** Log the req */
        console.log(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the res */
            console.log(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
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
        console.log ('Server running on https://localhost:3000');
    })    
}