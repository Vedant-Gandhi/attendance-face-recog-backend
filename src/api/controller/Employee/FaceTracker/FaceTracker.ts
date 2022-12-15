import { Request, Response } from "express";
import { logError, logInfo } from "../../../../logger/logger";
import EmployeeService from "../../../../service/Employee/Employee";
import ImageProcessorService from "../../../../service/ImageProcessing/ImageProcessing";
import fs from "fs/promises";
import TrackerService from "../../../../service/Tracker/Tracker";
import { getTimeDiffInHours } from "../../../../utils";

export const imageVerifier = async (req: Request, res: Response) => {
    const empId = req.body?.empId || "";
    const base64Image: string = req.body?.image || "";
    const currentDate = new Date();

    let hoursToIncrement = 0;

    const imageProcessor = new ImageProcessorService();
    const trackerService = new TrackerService();
    const employeeService = new EmployeeService();
    try {
        if (base64Image === "" || typeof empId !== "string" || empId === "") {
            res.status(400).send({ code: "req/incomplete-data", message: "Invalid data received" });
            return;
        }

        const fetchedEmployee = await employeeService.getByEmpId(empId);

        if (fetchedEmployee === null) {
            res.status(404).send({ code: "employee/not-found", message: "Employee not found" });
            return;
        }

        const trackerDetails = await trackerService.getDetailsByEmpIdforSingleDay(empId, currentDate);

        if (trackerDetails !== null) {
            let lastTimeStamp = trackerDetails.verificationCaptures?.pop();
            if (lastTimeStamp) {
                let diff = await getTimeDiffInHours(currentDate, lastTimeStamp.timeStamp);
                hoursToIncrement = diff;
            }
        }

        const imageSavePath = `tempUploads/${Date.now()}-${Math.random().toFixed(0)}.jpg`;

        const decodedImageBuffer = Buffer.from(base64Image.replace("data:image/jpeg;base64,", ""), "base64");

        // This section must be a new function as it is a storage engine.
        await fs.writeFile(imageSavePath, decodedImageBuffer);

        const newImageFeatureVectors = await imageProcessor.generateFeatureVector(imageSavePath);

        // Check if a match is found or not. If no features are found is new image there is no match.
        const isMatch = newImageFeatureVectors
            ? await imageProcessor.compareFeatureMap(Float32Array.from(fetchedEmployee.features), newImageFeatureVectors)
            : false;

        // Add timestamp to the database
        await trackerService.addOrUpdateTimestamp(empId, new Date(), { isMatch: isMatch, timeStamp: currentDate }, hoursToIncrement);

        res.send({ isMatch: isMatch });
    } catch (error) {
        logError("An error occured in Image Verify API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
};
