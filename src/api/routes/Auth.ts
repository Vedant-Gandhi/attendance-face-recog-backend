import express from "express";
import { UserRoles } from "../../models/User/UserModel";
import { login, resetPassword } from "../controller/Auth/Auth";
import { checkTokenValid, isRoleValid } from "../middleware/Auth";

const router = express.Router();

router.post("/login", login);
router.post("/reset-password", checkTokenValid, isRoleValid([UserRoles.ADMIN]), resetPassword);

export { router as authRouter };
