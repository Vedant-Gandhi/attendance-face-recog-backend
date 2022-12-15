import jwt from "jsonwebtoken";
import dotenv from "dotenv-flow";

dotenv.load(process.env.LOC_ENV || "", {});

/**
 *
 * @param payload The payload to be encrypted
 * @param expiresIn The time to expire in seconds
 * @returns
 */
export const generateToken = async (payload: any, expiresIn: number) => {
    const token = jwt.sign(payload, process.env.AUTH_KEY || "", { expiresIn });
    return token;
};

export const decodeToken = async (token: string) => {
    let payload = null;
    try {
        payload = jwt.verify(token, process.env.AUTH_KEY || "");
    } catch (error) {}
    return payload;
};
