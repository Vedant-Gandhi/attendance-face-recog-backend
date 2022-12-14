import { Request, Response } from "express";
import { logError } from "../../../logger/logger";
import AuthService from "../../../service/Auth/Auth";
import EmployeeService from "../../../service/Employee/Employee";

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const employeeService = new EmployeeService();
        const emp = employeeService.create(data);
        res.status(201).send(emp);
    } catch (error) {
        logError("An error occured while creating employee", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    const empId = req.params.empId || "";
    if (empId === "") {
        res.status(400).send({ code: "employee/invalid-employee-id", message: "Employee ID is invalid" });
        return;
    }
    try {
        const employeeService = new EmployeeService();
        const authService = new AuthService();
        await authService.deleteByEmpId(empId);

        await employeeService.deleteByEmpId(empId);
        res.status(202).send();
    } catch (error) {
        logError("An error occured while deleting employee", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    const empId = req.params.empId || "";
    const updateFields = req.body || {};
    if (empId === "") {
        res.status(400).send({ code: "employee/invalid-employee-id", message: "Employee ID is invalid" });
        return;
    }
    try {
        const employeeService = new EmployeeService();

        // Remove unmodifiable fields
        updateFields.empId = undefined;
        updateFields.joiningDate = undefined;

        await employeeService.updateByEmpId(empId, updateFields);
        res.status(202).send();
    } catch (error) {
        logError("An error occured while deleting employee", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
};
