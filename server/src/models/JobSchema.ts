import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
    externalId: string;
    title: string;
    link: string;
    pubDate: Date;
    description: string;
    content: string;
    imageUrl?: string;
    location?: string;
    jobType?: string;
    company?: string;
    source: string;
}

export interface JobInterface {
    externalId: string;
    title: string;
    link: string;
    pubDate: Date;
    description: string;
    content: string;
    imageUrl?: string;
    location?: string;
    jobType?: string;
    company?: string;
    source: string;
}

const JobSchema = new Schema<IJob>(
    {
        externalId: { type: String, required: true, unique: true, index: true },
        title: { type: String, required: true },
        link: { type: String },
        pubDate: { type: Date, required: true },
        description: { type: String },
        content: { type: String },
        imageUrl: { type: String },
        location: { type: String },
        jobType: { type: String },
        company: { type: String },
        source: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;