import bcrypt from "bcrypt";
export async function generatePasswordHash(pswd: string) {
    return bcrypt.hash(pswd, 10);
}

export async function checkPasswordValidity(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}
