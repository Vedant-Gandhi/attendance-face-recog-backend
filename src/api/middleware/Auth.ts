import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../../auth/AuthUtils";
import { logError, logInfo } from "../../logger/logger";
import { UserRoles } from "../../models/User/UserModel";

export const checkTokenValid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.headers.authorization || "";
        logInfo(`${payload}`);
        const token = payload.split(" ").pop() || "";

        const decodedPayload = await decodeToken(token);

        if (decodedPayload === null) {
            res.status(401).send({ code: "auth/user-unauthorized", message: "Unauthorized user." });
            return;
        }

        res.locals.tokenData = decodedPayload;
        next();
    } catch (error) {
        logError("An error occured while in token verification middleware", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
};

export const isRoleValid = (roles: Array<UserRoles>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const decodedPayload = res.locals.tokenData || {};

        if (!decodedPayload || decodedPayload == null || typeof decodedPayload.role !== "string" || roles.indexOf(decodedPayload.role) === -1) {
            res.status(403).send({ code: "auth/user-forbidden", message: "User forbidden" });
            return;
        }
        next();
    };
};
