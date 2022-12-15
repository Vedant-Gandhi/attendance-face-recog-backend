import bcrypt from "bcrypt";
export async function generatePasswordHash(pswd: string) {
    return bcrypt.hash(pswd, 10);
}

export async function checkPasswordValidity(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

export async function getTimeDiffInHours(date1: Date, date2: Date) {
    let diff = (date2.getTime() - date1.getTime()) / 1000;
    diff /= 60 * 60;
    return Number(diff.toFixed(2));
}

export function calculateTimeDiffFromNowToDayEnd(date: Date) {
    const tomorrowDate = new Date(date);
    tomorrowDate.setHours(0, 0, 0, 0);
    tomorrowDate.setDate(date.getDate() + 1);
    return tomorrowDate.getTime() - date.getTime();
}
