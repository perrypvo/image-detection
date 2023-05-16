import express from 'express';
import controller from '../controllers/images'

const router = express.Router();

// ROUTERS:
router.post('/images', controller.addImage);
router.get('/images', controller.getImages);
router.get('/images/:imageId', controller.getImageById);

export default router;