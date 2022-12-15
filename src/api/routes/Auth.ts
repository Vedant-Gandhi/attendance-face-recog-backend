import express from "express";
import { login, resetPassword } from "../controller/Auth/Auth";

const router = express.Router();

router.post("/login", login);
router.post("/reset-password", resetPassword);

export { router as authRouter };
