import { Request, Response } from "express";
import EmployeeService from "../../../../service/Employee/Employee";
import ImageProcessorService from "../../../../service/ImageProcessing/ImageProcessing";

const imageVerifier = async (req: Request, res: Response) => {
    const empId = req.body?.empId;
    const imageProcessor = new ImageProcessorService();
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
    } catch (error) {}
};
