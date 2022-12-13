import { ICreateUser, userModel } from "../../models/User/UserModel";

class AuthService {
    async getByEmpId(empId: string) {
        const user = await userModel.findOne({ empId: empId || "" });
        return user === null ? null : user.toJSON();
    }

    async createUser(userData: ICreateUser) {
        const user = await userModel.create(userData);
        return user.toJSON();
    }
}

export default AuthService;
