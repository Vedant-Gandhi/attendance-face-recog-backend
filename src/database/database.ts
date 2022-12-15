import mongoose from "mongoose";

export async function initDatabase() {
    // @ts-ignore
    await mongoose.connect(process.env.MONGO_URL || "");

    mongoose.set('allowDiskUse',true)

    if (process.env.NODE_ENV === "development") {
        mongoose.set("debug", true);
        mongoose.set('allowDiskUse',true)
    }
}
