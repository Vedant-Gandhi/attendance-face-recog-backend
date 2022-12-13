import express from "express";
import { login } from "../controller/Auth/Auth";

const router = express.Router();

router.post("/login", login);

export { router as authRouter };
