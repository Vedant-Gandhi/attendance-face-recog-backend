import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IEmployee {
    id: string;
    empId: string;
    name: string;
    phone: string;
    profileUrl: string;
    position: string;
    salary: number;
    joiningDate: Date;
    createdAt: Date;
    updatedAt: Date;
    features: Array<number>;
}

interface ICreateEmployee extends Omit<IEmployee, "id" | "createdAt" | "updatedAt"> {}

const employeeSchema = new mongoose.Schema<IEmployee>({
    empId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    profileUrl: { type: String, default: "" },
    position: { type: String, required: true, default: "" },
    salary: { type: Number, default: 0 },
    joiningDate: { type: Date, required: true },
    features: { type: [Number], default: [] },
});

employeeSchema.plugin(paginate);

//@ts-ignore
interface EmployeeDocument extends mongoose.Document, IEmployee {}

const employeeModel = mongoose.model<EmployeeDocument, mongoose.PaginateModel<EmployeeDocument>>("employee", employeeSchema, "employee");

export { employeeModel, IEmployee, ICreateEmployee };
