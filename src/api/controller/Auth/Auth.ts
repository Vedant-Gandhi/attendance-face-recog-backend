import { Request, Response } from "express";
import { ICreateEmployee } from "../../../models/Employee/Employee";
import { ICreateUser, UserRoles } from "../../../models/User/UserModel";
import AuthService from "../../../service/Auth/Auth";
import EmployeeService from "../../../service/Employee/Employee";
import { calculateTimeDiffFromNowToDayEnd, checkPasswordValidity, generatePasswordHash } from "../../../utils";

import multer from "multer";
import dotenv from "dotenv-flow";

import ImageProcessorService from "../../../service/ImageProcessing/ImageProcessing";
import { logError } from "../../../logger/logger";
import path from "path";
import TrackerService from "../../../service/Tracker/Tracker";
import { generateToken } from "../../../auth/AuthUtils";

dotenv.load(process.env.LOC_ENV || "", {});

const profileDiskStorage = multer.diskStorage({
    destination: `${process.env.ROOT_IMAGE_DIR}/`,
    filename(req, file, callback) {
        const empId = req.body.empId;
        callback(null, `profile-${empId || "--"}${path.extname(file.originalname)}`);
        req.body.fileNameOnDisk = `profile-${empId || "--"}${path.extname(file.originalname)}`;
    },
});

export const profileUploadMulter = multer({
    storage: profileDiskStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export const login = async (req: Request, res: Response) => {
    try {
        const empId = req.body.empId;
        const password = req.body.password;

        const currentDate = new Date();

        // Validations
        if (typeof empId !== "string" || typeof password !== "string" || empId === "" || password === "") {
            res.status(400).send({ code: "auth/invalid-credentials", message: "Invalid credentials" });
            return;
        }

        const authService = new AuthService();
        const employeeService = new EmployeeService();
        const trackerService = new TrackerService();

        // Check here if track exists for todays day
        const doesTrackAlreadyExist = await trackerService.checkTimestampexists(empId, currentDate);

        // Get the employee
        const user = await authService.getByEmpId(empId);

        if (user === null) {
            res.status(404).send({ code: "user/not-found", message: "User not found" });
            return;
        }

        // If the user is not employee and also today's track does not exist then only create a new track

        const isPasswordMatch = await checkPasswordValidity(password, user.passwordHash);

        if (!isPasswordMatch) {
            res.status(401).send({ code: "user/invalid-credentials", message: "Invalid Credentials" });
            return;
        }

        const emp = user.role === UserRoles.EMPLOYEE ? await employeeService.getByEmpId(user.empId, { ignoreFields: ["features"] }) : null;

        // Generate JWT token
        const tokenPayload = {
            role: user.role,
        };
        const tokenExpiryTime = calculateTimeDiffFromNowToDayEnd(currentDate);
        let token = await generateToken(tokenPayload, tokenExpiryTime);

        res.send({ ...user, passwordHash: undefined, details: emp, token: token });
    } catch (error: any) {
        logError("An error occured in login API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
};

export const registerEmployee = async (req: Request, res: Response) => {
    const authService = new AuthService();
    const employeeService = new EmployeeService();
    try {
        const data = req.body || {};

        if (typeof data.empId !== "string" || typeof data.password !== "string" || data.empId === "" || data.password === "") {
            res.status(400).send({ code: "auth/invalid-credentials", message: "Invalid credentials" });
            return;
        }

        if (!req.file) {
            res.status(400).send({ code: "employee/profile-image-not-found", message: "Profile Image is required" });
            return;
        }

        const passwordHash = await generatePasswordHash(data.password);
        const profileUrl = `http://localhost:${process.env.PORT || 3000}/image/${req.body.fileNameOnDisk}`;

        const authData: ICreateUser = {
            empId: data.empId,
            role: UserRoles.EMPLOYEE,
            passwordHash: passwordHash,
        };

        const createdUser = await authService.createUser(authData);

        // Generate the embedding over here
        const imageProcessor = new ImageProcessorService();

        const featureVector = await imageProcessor.generateFeatureVector(req.file.path);
        if (!featureVector) {
            res.status(400).send({ code: "employee/face-not-found", message: "Face not detected in the given image" });
            return;
        }

        const employeeData: ICreateEmployee = {
            empId: createdUser.empId,
            phone: data.phone,
            joiningDate: data.joiningDate,
            name: data.name,
            position: data.position,
            profileUrl: profileUrl,
            salary: data.salary,
            features: Array.from(featureVector),
        };

        const employee = await employeeService.create(employeeData);
        res.send(employee);
    } catch (error) {
        logError("An error occured in Employee Register API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error occured" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const empId = req.body.empId || "";
        const newPass = req.body.password || "";

        if (empId === "" || newPass === "") {
            res.status(400).send({ code: "auth/invalid-credentials", message: "Invalid credentials" });
            return;
        }

        const authService = new AuthService();

        const newHashedPassword = await generatePasswordHash(newPass);

        const isUpdated = await authService.updatePasswordByEmpId(empId, newHashedPassword);

        if (isUpdated) {
            res.status(204).send();
            return;
        }
        res.status(404).send({ code: "user/not-found", message: "User not found" });
    } catch (error) {
        logError("An error occured in Employee Register API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error occured" });
    }
};
