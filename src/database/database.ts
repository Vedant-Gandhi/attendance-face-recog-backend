import mongoose from "mongoose";

export async function initDatabase() {
    mongoose.connect(process.env.MONGO_URL || "");
}
