import { Request, Response } from "express";
import { logError } from "../../../../logger/logger";
import CaptureStorageService from "../../../../service/CaptureStorage/CaptureStorageService";
import EmployeeService from "../../../../service/Employee/Employee";
import ImageProcessorService from "../../../../service/ImageProcessing/ImageProcessing";

export const imageVerifier = async (req: Request, res: Response) => {
    const empId = req.body?.empId || "";
    const imageProcessor = new ImageProcessorService();
    const captureStorageService = new CaptureStorageService();
    const employeeService = new EmployeeService();
    try {
        if (!req.file || typeof empId !== "string" || empId === "") {
            res.status(400).send({ code: "req/incomplete-data", message: "Invalid data received" });
            return;
        }

        const fetchedEmployee = await employeeService.getByEmpId(empId);

        if (fetchedEmployee === null) {
            res.status(404).send({ code: "employee/not-found", message: "Employee not found" });
            return;
        }

        const newImageFeatureVectors = await imageProcessor.generateFeatureVector(req.file.path);

        const isMatch = await imageProcessor.compareFeatureMap(Float32Array.from(fetchedEmployee.features), newImageFeatureVectors);
        await captureStorageService.addCaptureTimeStamp(empId, new Date(), { isMatch: isMatch, timeStamp: new Date() });
        res.send({ isMatch: isMatch });
    } catch (error) {
        logError("An error occured in login API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
};
