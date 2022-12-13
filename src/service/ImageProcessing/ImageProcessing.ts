import * as tf from "@tensorflow/tfjs-node";
import * as faceapi from "@vladmandic/face-api";
import { readFile } from "fs/promises";
import { logError } from "../../logger/logger";

import { imageFromBuffer, getImageData } from "@canvas/image";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "../../config/config";
import dotenv from "dotenv-flow";

dotenv.load(process.env.LOC_ENV || "", {});

const matchThreshold = 0.55;

export class ModelLoadError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "ModelLoadError";
    }
}

export class InvalidImageFormat extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "InvalidImageFormat";
    }
}
class ImageProcessorService {
    static async loadModels() {
        try {
            await faceapi.nets.faceLandmark68Net.loadFromDisk("ml");
            await faceapi.nets.ssdMobilenetv1.loadFromDisk(process.env.MODEL_BASE_DIR || "ml");
            await faceapi.nets.faceExpressionNet.loadFromDisk(process.env.MODEL_BASE_DIR || "ml");
            await faceapi.nets.faceRecognitionNet.loadFromDisk(process.env.MODEL_BASE_DIR || "ml");
        } catch (error) {
            logError("An error occured while loading models for images", error);
            throw new ModelLoadError("Error while loading model from memory");
        }
    }
    async generateFeatureVector(image: string | Buffer) {
        let imageBuffer = typeof image === "string" ? await readFile(image) : image;

        const canvas = await imageFromBuffer(imageBuffer);

        let decodedImage = getImageData(canvas);
        if (decodedImage === undefined) {
            throw new InvalidImageFormat("An invalid image format detected when decoding an image");
        }

        const tensor = tf.tidy(() => {
            const data = tf.tensor(Array.from(decodedImage?.data || []), [canvas.height, canvas.width, 4], "int32");
            const channels = tf.split(data, 4, 2); // split rgba to channels
            const rgb = tf.stack([channels[0], channels[1], channels[2]], 2); // stack channels back to rgb
            const reshape = tf.reshape(rgb, [1, canvas.height, canvas.width, 3]); // move extra dim from the end of tensor and use it as batch number instead
            reshape.resizeBilinear([IMAGE_HEIGHT, IMAGE_WIDTH]);
            return reshape;
        });
        const ssdOptions = new faceapi.SsdMobilenetv1Options({ maxResults: 10, minConfidence: 0.5 });
        const result = await faceapi.detectAllFaces(tensor, ssdOptions).withFaceLandmarks().withFaceDescriptors();

        return result[0]?.descriptor;
    }
}

export async function compareFeatureMap(uid: string, actualFeatures: Float32Array, featuresToCheck: Float32Array) {}

export default ImageProcessorService;
