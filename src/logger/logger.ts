import winston from "winston";

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/info.log",
            level: "info",
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
    ],
});

export function logError(message: string, error?: any) {
    logger.error(message, error);
}

export function logInfo(message:string,data?:any)
{
    logger.info(message,data)
}