import { Request, Response } from "express";
import EmployeeService from "../../../service/Employee/Employee";

const createEmployee = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const employeeService = new EmployeeService();
        const emp = employeeService.create(data);
        res.send(emp);
    } catch (error) {
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
};
