import mongoose from "mongoose";

enum UserRoles {
    ADMIN = "admin",
    EMPLOYEE = "employee",
}
interface IUser {
    id: string;
    passwordHash: string;
    empId: string;
    role: UserRoles;
    createdAt: string;
    updatedAt: string;
    
}

interface ICreateUser extends Omit<IUser, "id" | "createdAt" | "updatedAt"> {}

const userSchema = new mongoose.Schema<IUser>({
    empId: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: UserRoles.EMPLOYEE, enum: Object.values(UserRoles) },
    
});

const userModel = mongoose.model("auth", userSchema, "authDb");

export { userModel, IUser, ICreateUser, UserRoles };
