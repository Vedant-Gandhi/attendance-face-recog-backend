import express from "express";
import { profileUploadMulter, registerEmployee } from "../controller/Auth/Auth.js";
import * as employeeController from "../controller/Employee/Employee.js";
import { imageVerifier } from "../controller/Employee/FaceTracker/FaceTracker.js";

const router = express.Router();

router.post("/register", profileUploadMulter.single("profileImage"), registerEmployee);
router.post("/verify-capture", imageVerifier);
router.delete("/:empId", employeeController.deleteEmployee);
router.put("/:empId", employeeController.updateEmployee);
router.get("/:empId", employeeController.getEmployee);
router.get("/", employeeController.getEmployeesPaginated);
router.get("/:empId/monthly-working-data", employeeController.getEmployeeMonthlyWorkingHrs);
router.get("/search/name", employeeController.searchEmployeeByName);

export { router as employeeRouter };
