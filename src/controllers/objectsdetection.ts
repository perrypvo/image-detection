import { config } from '../config/config';
// import fetch from 'node-fetch'
import {encode} from 'base-64';
import axios from 'axios';
import Logging from '../utilities/logging';

interface IObjectDetection {
    confidence: number;
    tag: {
        en: string;
    }
}

// Function to call imagga API and return a list of detected objects in the image
const detectObjects = async (url:string) => {
    const imageUrl = `${config.imagga.url}?image_url=${url}`;

    try {
        let response = await axios.get(imageUrl, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + encode(`${config.imagga.apiKey}:${config.imagga.apiSecret}`)
            }
        });
        if (response.status === 200) {
            const data = response.data;
            const objectsList = data['result']['tags'] as IObjectDetection[];
            // const detectedObjects = objectsList.filter(item => item.confidence > config.imagga.confidenceThreshold);
            let objects: string[] = [];
            objectsList.forEach(item => objects.push(item.tag.en));
            return objects;
        } else {
            Logging.error(response.statusText)
        }
    } catch(error) {
        Logging.error(error);
    }
}

export default detectObjects;