import express from "express";
import { getImageFromStorage } from "../controller/Image/Image";

const router = express.Router();

router.get("/:imageId", getImageFromStorage);

export { router as imageStoreRouter };
