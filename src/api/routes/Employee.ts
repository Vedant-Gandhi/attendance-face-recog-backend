import express from "express";
import { profileUploadMulter, registerEmployee } from "../controller/Auth/Auth";
import { imageVerifier } from "../controller/Employee/FaceTracker/FaceTracker";

const router = express.Router();

router.post("/register", profileUploadMulter.single("profileImage"), registerEmployee);
router.post("/verify-capture", profileUploadMulter.single("captureImage"), imageVerifier);

export { router as employeeRouter };
