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

    async deleteByEmpId(empId: string) {
        let deleted = await employeeModel.deleteOne({ empId: empId });
        return deleted.deletedCount > 0;
    }
    async updateByEmpId(empId: string, updateFields: Partial<ICreateEmployee>) {
        let updated = await employeeModel.updateOne({ empId: empId }, updateFields);
        return updated.modifiedCount > 0;
    }

    async getEmployeesPaginated(options = { limit: 10, page: 1, ignoreFields: [''] }) {
        const employees = await employeeModel.paginate(
            {},
            {
                limit: options?.limit,
                allowDiskUse: true,
                page: options?.page,
               

                
            }
        );
console.log( options?.ignoreFields.reduce((lastField,currentField)=>{return `${lastField} -${currentField}`}))
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
}

export default EmployeeService;
