import { employeeModel, ICreateEmployee } from "../../models/Employee/Employee";
import hoursModel from "../../models/Hours/Hours";

class EmployeeService {
    async create(emp: ICreateEmployee) {
        const createdEmployee = await employeeModel.create(emp);
        return createdEmployee.toJSON();
    }

    async getByEmpId(empId: string, options?: { ignoreFields?: Array<String> }) {
        if (!options) options = {};
        let mappedIgnoreFields = options?.ignoreFields
            ? options.ignoreFields.map((field) => `-${field}`).reduce((accumulator, field) => `${accumulator} ${field} `)
            : undefined;
        const createdEmployee = await employeeModel.findOne({ empId: empId || "" }, mappedIgnoreFields);
        return createdEmployee === null ? null : createdEmployee.toJSON();
    }

    async deleteByEmpId(empId: string) {
        let deleted = await employeeModel.deleteOne({ empId: empId });
        return deleted.deletedCount > 0;
    }
    async updateByEmpId(empId: string, updateFields: Partial<ICreateEmployee>) {
        let updated = await employeeModel.updateOne({ empId: empId }, updateFields);
        return updated.modifiedCount > 0;
    }

    async getEmployeesByName(namePattern: string) {
        let employees = await employeeModel.find({ $text: { $search: namePattern || "" } });
        return employees.map((employee) => employee.toJSON());
    }

    async getEmployeesPaginated(options = { limit: 10, page: 1, ignoreFields: [""] }) {
        let ignoredFieldsMapped = options.ignoreFields.map((field) => `-${field}`).reduce((accumulator, currentVal) => `${accumulator} -${currentVal} `);

        const employees = await employeeModel.paginate(
            {},
            {
                limit: options?.limit,
                allowDiskUse: true,
                page: options?.page,
                select: ignoredFieldsMapped,
            }
        );

        return {
            currentPage: employees.page,
            pageData: employees.docs,
            totalCount: employees.totalDocs,
            hasNextPage: employees.hasNextPage,
            hasPrevPage: employees.hasPrevPage,
            prevPage: employees.prevPage,
            nextPage: employees.nextPage,
        };
    }

    async getEmployeeMonthlyData(empId: string, date: Date) {
        let startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(1);

        let endDate = new Date(date);
        endDate.setHours(0, 0, 0, 0);
        endDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1);

        let monthlyData = await hoursModel.find(
            {
                empId: empId,
                createdAt: {
                    $gte: startDate,
                    $lt: endDate,
                },
            },
            {},
            { select: "empId createdAt totalHours" }
        );

        return monthlyData;
    }
}

export default EmployeeService;
