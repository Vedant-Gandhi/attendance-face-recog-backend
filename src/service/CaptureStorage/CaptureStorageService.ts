import hoursModel, { ICaptures, IHours } from "../../models/Hours/Hours";

class CaptureStorageService {
    async createStorageService(captureService: Partial<IHours>) {
        captureService.empId = captureService.empId ?? "";

        const capture = await hoursModel.create(captureService);
        return capture.toJSON();
    }

    async addCaptureTimeStamp(empId: string, date: Date, capture: ICaptures) {
        const updatedCapture = await hoursModel.updateOne(
            {
                empId: empId,
                createdAt: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            },
            {
                $push: {
                    verificationCaptures: capture,
                },
            },
            {
                upsert: true,
            }
        );

        return updatedCapture === null ? null : updatedCapture;
    }
}
export default CaptureStorageService;
