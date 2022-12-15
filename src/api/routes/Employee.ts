import express from "express";
import { UserRoles } from "../../models/User/UserModel.js";
import { profileUploadMulter, registerEmployee } from "../controller/Auth/Auth.js";
import * as employeeController from "../controller/Employee/Employee.js";
import { imageVerifier } from "../controller/Employee/FaceTracker/FaceTracker.js";
import { checkTokenValid, isRoleValid } from "../middleware/Auth.js";

const router = express.Router();

router.post("/register", profileUploadMulter.single("profileImage"), checkTokenValid, isRoleValid([UserRoles.ADMIN]), registerEmployee);
router.post("/verify-capture", checkTokenValid, isRoleValid([UserRoles.EMPLOYEE]), imageVerifier);
router.delete("/:empId", checkTokenValid, isRoleValid([UserRoles.ADMIN]), employeeController.deleteEmployee);
router.put("/:empId", checkTokenValid, isRoleValid([UserRoles.ADMIN]), employeeController.updateEmployee);
router.get("/:empId", checkTokenValid, isRoleValid([UserRoles.ADMIN, UserRoles.EMPLOYEE]), employeeController.getEmployee);
router.get("/", checkTokenValid, isRoleValid([UserRoles.ADMIN]), employeeController.getEmployeesPaginated);
router.get("/:empId/monthly-working-data", checkTokenValid, isRoleValid([UserRoles.ADMIN]), employeeController.getEmployeeMonthlyWorkingHrs);
router.get("/search/name", checkTokenValid, isRoleValid([UserRoles.ADMIN]), employeeController.searchEmployeeByName);

export { router as employeeRouter };
