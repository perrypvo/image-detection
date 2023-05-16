import dotenv from 'dotenv';

dotenv.config();

const MONGODB_USERNAME = process.env.MONGODB_USERNAME || '';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';
const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.vpxyhhl.mongodb.net/?retryWrites=true&w=majority`

const IMAGGA_URL = `https://api.imagga.com/v2/tags`;
const IMAGGA_API_KEY = process.env.IMAGGA_API_KEY || '';
const IMAGGA_API_SECRET = process.env.IMAGGA_API_SECRET || '';
const IMAGGA_CONFIDENCE_THRESHOLD = process.env.IMAGGA_CONFIDENCE_THRESHOLD || 0;

const SERVER_PORT = process.env.SERVER_PORT || 3000

export const config = {
    mongodb: {
        url:  MONGODB_URI
    },
    server: {
        port: SERVER_PORT
    },
    imagga: {
        url: IMAGGA_URL,
        apiKey: IMAGGA_API_KEY,
        apiSecret: IMAGGA_API_SECRET,
        confidenceThreshold: IMAGGA_CONFIDENCE_THRESHOLD
    }
};