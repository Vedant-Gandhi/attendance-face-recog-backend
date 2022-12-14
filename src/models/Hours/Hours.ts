import mongoose from "mongoose";

export interface ICaptures {
    isMatch: boolean;
    timeStamp: Date;
}
export interface IHours {
    empId: String;
    loginTime: Date;
    logoutTime: Date;
    verificationCaptures: Array<ICaptures>;
    totalHours: number;
}

const capturesSchema = new mongoose.Schema<ICaptures>({
    isMatch: { type: Boolean, default: false },
    timeStamp: {
        type: Date,
        required: true,
    },
});

const hoursSchema = new mongoose.Schema<IHours>({
    empId: { type: String, required: true },
    loginTime: { type: Date, required: true },
    logoutTime: { type: Date },
    verificationCaptures: [{ type: capturesSchema }],
    totalHours: { type: Number, default: 0 },
});

const hoursModel = mongoose.model("hours", hoursSchema, "hours");

export default hoursModel;
