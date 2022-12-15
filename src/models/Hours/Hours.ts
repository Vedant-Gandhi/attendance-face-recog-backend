import mongoose from "mongoose";

export interface ICaptures {
    isMatch: boolean;
    timeStamp: Date;
}
export interface ICustomLocation {
    latitude: Number;
    longitude: Number;
}
export interface IHours {
    empId: String;
    loginTime: Date;
    logoutTime: Date;
    verificationCaptures: Array<ICaptures>;
    totalHours: number;
    createdAt: Date;
    updatedAt: Date;
    id: string;
    create: Date;
    location: ICustomLocation;
}

const capturesSchema = new mongoose.Schema<ICaptures>({
    isMatch: { type: Boolean, default: false },
    timeStamp: {
        type: Date,
        required: true,
    },
});
const customLocationSchema = new mongoose.Schema<ICustomLocation>({
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
});

const hoursSchema = new mongoose.Schema<IHours>(
    {
        empId: { type: String, required: true },
        loginTime: { type: Date, required: true },
        logoutTime: { type: Date },
        verificationCaptures: [{ type: capturesSchema }],
        totalHours: { type: Number, default: 0.0 },
        create: { type: Date, default: new Date() },
        location: { type: customLocationSchema, default: {} },
    },
    {
        timestamps: true,
    }
);

const hoursModel = mongoose.model("hours", hoursSchema, "hours");

export default hoursModel;
