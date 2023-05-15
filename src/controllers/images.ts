
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import ImageModel from '../models/schema';
import detectObjects from './objectsdetection';

// UTILITY:
const removeObjects = (images: any[]) => {
    images.forEach(image => {
        delete image.objects;
    });
}

// ROUTE: Adding a new image to DB
const addImage = async (req: Request, res: Response, next: NextFunction) => {
    let { url, label, enableDetection } = req.body;

    if (url === undefined) {
        return res.status(500).json({message: 'Invalid image url'});
    }
    // label is optional;  generate one if not provided
    label = (label == undefined) ? "test".concat((Math.round(Math.random()*100)).toString()) : label;
    // enableDetection is optional; default to false
    enableDetection = (enableDetection == undefined)? false : enableDetection;

    // get list of objects from API
    const objects = (enableDetection == true)? await detectObjects(url) : [];

    const image = new ImageModel({
        _id: new mongoose.Types.ObjectId(),
        url,
        label,
        enableDetection,
        objects : objects
    });
    return image
        .save()
        .then((image) => res.status(201).json({ image }))
        .catch((error) => res.status(500).json({ error }));
};

// ROUTE: Return all images in db
const getImages = async (req: Request, res: Response, next: NextFunction) => {

    const objects = req.query.objects
    if (objects) {
        // return just images with detected objects
        const images = await ImageModel.find().lean();
        const returnImages = images.filter(image => image.objects.includes(objects.toString()));
        removeObjects(returnImages);
        return res.status(200).send(returnImages);
    } else {
        // return all images in db
        return ImageModel.find()
            .then((images) => res.status(200).json({ images }))
            .catch((error) => res.status(500).json({ error }));
    }
};

// ROUTE: Return image by ID
const getImageById = (req: Request, res: Response, next: NextFunction) => {
    const imageId = req.params.imageId;
    if(mongoose.Types.ObjectId.isValid(imageId)) {
        return ImageModel.findById(imageId)
            .then((image) => (image? res.status(200).json({ image }) : res.status(404).json({message: 'Not found'})))
            .catch((error) => res.status(500).json({ error }));
    } else {
        res.status(404).json({message: 'Not found'})
    }
};

export default { addImage, getImages, getImageById };