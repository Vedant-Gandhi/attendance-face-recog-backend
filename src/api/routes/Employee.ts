import express from "express";
import { profileUploadMulter, registerEmployee } from "../controller/Auth/Auth.js";
import { deleteEmployee, getEmployee, getEmployeesPaginated, updateEmployee } from "../controller/Employee/Employee.js";
import { imageVerifier } from "../controller/Employee/FaceTracker/FaceTracker.js";

const router = express.Router();

router.post("/register", profileUploadMulter.single("profileImage"), registerEmployee);
router.post("/verify-capture", profileUploadMulter.single("captureImage"), imageVerifier);
router.delete("/:empId", deleteEmployee);
router.put("/:empId", updateEmployee);
router.get("/:empId",getEmployee)
router.get("/",getEmployeesPaginated)

export { router as employeeRouter };
