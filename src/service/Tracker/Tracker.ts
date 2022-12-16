import { logInfo } from "../../logger/logger";
import hoursModel, { ICaptures, ICustomLocation, IHours } from "../../models/Hours/Hours";

export default class TrackerService {
    async getLastTimeStamp(empId: string, date: Date) {
        let hr = await hoursModel.findOne({ empId: empId, createdAt: date }, { empId: 1, createdAt: 1, lastTimeStamp: { $slice: -1 } });
        return hr === null ? null : hr.toJSON();
    }

    async getDetailsByEmpId(empId: string = "") {
        let details = await hoursModel.findOne({ empId: empId });
        return details === null ? null : details.toJSON();
    }

    async getDetailsByEmpIdforSingleDay(empId: string = "", date: Date) {
        let nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        let todaysDay = new Date(date);
        todaysDay.setHours(0, 0, 0, 0);

        let details = await hoursModel.findOne({ empId: empId, createdAt: { $gte: todaysDay, $lt: nextDay } });
        return details === null ? null : details.toJSON();
    }
    async createStorageService(captureService: Partial<IHours>) {
        captureService.empId = captureService.empId ?? "";

        const capture = await hoursModel.create(captureService);
        return capture.toJSON();
    }
    async checkTimestampexists(empId: string, date: Date) {
        let nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        let todaysDay = date;
        todaysDay.setHours(0, 0, 0, 0);
        const doesTrackExists = await hoursModel.exists({ empId: empId, createdAt: { $gte: todaysDay, $lt: nextDay } });
        return doesTrackExists;
    }

    async addOrUpdateTimestamp(empId: string, date: Date, capture: ICaptures, hourToIncrement = 0, location: ICustomLocation) {
        console.log(new Date());
        console.log(date);
        let nextDay = new Date(date.toISOString());
        nextDay.setDate(nextDay.getDate() + 1);
        //nextDay.setHours(0, 0, 0, 0);

        let todaysDate = new Date(date.toISOString());
        //todaysDate.setHours(0, 0, 0, 0);

        const updatedCapture = await hoursModel.findOneAndUpdate(
            {
                empId: empId,
                createdAt: { $gte: todaysDate.toISOString(), $lt: nextDay.toISOString() },
                location: {
                    longitude: location.latitude || -1,
                    latitude: location.latitude || -1,
                },
            },
            {
                $push: {
                    verificationCaptures: capture,
                },
                $inc: {
                    totalHours: hourToIncrement,
                },
            },
            {
                upsert: true,
            }
        );
        logInfo("Updated capture", updatedCapture);

        return updatedCapture === null ? null : updatedCapture;
    }
}
