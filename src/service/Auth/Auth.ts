import { ICreateUser, userModel } from "../../models/User/UserModel";

class AuthService {
    async getByEmpId(empId: string) {
        const user = await userModel.findOne({ empId: empId || "" });
        return user === null ? null : user.toJSON();
    }
    async getFullEmployeeByEmpId(empId: string) {
        const user = await userModel.findOne({ empId: empId || "" }, {}, { populate: { localField: "empId", foreignField: "empId", path: "employee" } });
    }

    async createUser(userData: ICreateUser) {
        const user = await userModel.create(userData);
        return user.toJSON();
    }
    async deleteByEmpId(empId: string) {
        let deleted = await userModel.deleteOne({ empId: empId });
        return deleted.deletedCount > 0;
    }
    async updatePasswordByEmpId(empId: string, password: string) {
        let updated = await userModel.updateOne({ empId: empId || "" }, { passwordHash: password });
       
        return updated.matchedCount > 0;
    }
}

export default AuthService;
