import { employeeModel, ICreateEmployee } from "../../models/Employee/Employee";

class EmployeeService {
    async create(emp: ICreateEmployee) {
        const createdEmployee = await employeeModel.create(emp);
        return createdEmployee.toJSON();
    }

    async getByEmpId(empId: string, options?: { ignoreFields?: string | Array<string> }) {
        const createdEmployee = await employeeModel.findOne({ empId: empId || "" }, options?.ignoreFields);
        return createdEmployee === null ? null : createdEmployee.toJSON();
    }
}

export default EmployeeService;
