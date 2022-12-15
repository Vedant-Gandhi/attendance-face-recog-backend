import { Request, Response } from "express";
import process from "process";

import { logError } from "../../../logger/logger";

export const getImageFromStorage = (req: Request, res: Response) => {
    try {
        const imageId = req.params.imageId || "";

        if (imageId === "") {
            res.status(404).send();
            return;
        }
        res.sendFile(`${process.env.ROOT_IMAGE_DIR}/${imageId}`);
    } catch (error) {
        logError("An error occured while fetching image", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured." });
    }
};
