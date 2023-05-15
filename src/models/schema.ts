import { Schema, model, connect, HydratedDocument } from 'mongoose';

// Define type for image metadata
interface IImage {
    url: string;
    label?: string
    enableDetection?: boolean;
    objects: string[];
}

// Database schema
const imageSchema = new Schema<IImage>({
    url: { type: String, required: true },
    label: String,
    enableDetection: Boolean,
    objects:[{type: String}]
}, {
    versionKey: false
});

// Database model
const ImageModel = model<IImage>('Image', imageSchema);

export default ImageModel;
