import { ICreateUser, userModel } from "../../models/User/UserModel";

class AuthService {
    async getByEmpId(empId: string) {
        const user = await userModel.findOne({ empId: empId || "" });
        return user === null ? null : user.toJSON();
    }
    async getFullEmployeeByEmpId(empId: string) {
        const user = await userModel.findOne(
            { empId: empId || "" },
            {},
            { populate: { localField: "empId", foreignField: "empId", path: "employee",  } }
        );
    }

    async createUser(userData: ICreateUser) {
        const user = await userModel.create(userData);
        return user.toJSON();
    }
}

export default AuthService;
