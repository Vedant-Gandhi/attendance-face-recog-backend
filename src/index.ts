import app from "./app.js";
import dotenv from "dotenv-flow";
import { logError, logInfo } from "./logger/logger.js";
import { initDatabase } from "./database/database.js";
import ImageProcessorService from "./service/ImageProcessing/ImageProcessing.js";

dotenv.load(process.env.LOC_ENV || "",{})



initDatabase().catch((err) => {
    logError("An error occured while initializing the database", err);
    process.exit(1);
});
ImageProcessorService.loadModels().catch((err) => {
    logError("An error occured while loading ML models", err);
    process.exit(1);
});
const portToListen = process.env.PORT || 3000;

app.listen(portToListen, () => {
    logInfo("Server started listening on port" + portToListen);
});
