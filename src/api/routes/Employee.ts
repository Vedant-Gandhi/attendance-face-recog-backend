import express from "express";
import { profileUploadMulter, registerEmployee } from "../controller/Auth/Auth";

const router = express.Router();

router.post("/register",profileUploadMulter.single("profileImage"), registerEmployee);

export  {  router as employeeRouter };
