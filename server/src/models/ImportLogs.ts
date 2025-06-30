import mongoose, { Document, Schema } from "mongoose";


export interface IImportLog {
    feedUrls: string[];
    timestamp: Date;
    totalFetched: number;
    queuedJobs: number;
    insertedJobs: number;
    updatedJobs: number;
    skippedJobs: number;
    failedJobs: number;
    errors: string[];
}

const ImportLogSchema = new Schema<IImportLog>({
    feedUrls: { type: [String], required: true },
    timestamp: { type: Date, default: Date.now },
    totalFetched: { type: Number, required: true },
    queuedJobs: { type: Number, default: 0 },
    insertedJobs: { type: Number, default: 0 },
    updatedJobs: { type: Number, default: 0 },
    skippedJobs: { type: Number, default: 0 },
    failedJobs: { type: Number, default: 0 },
    errors: { type: [String], default: [] },
}, {
    suppressReservedKeysWarning: true
});

const ImportLog = mongoose.model<IImportLog>("ImportLog", ImportLogSchema);
export default ImportLog;
