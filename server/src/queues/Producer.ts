import { Queue } from "bullmq";
import { redisOptions } from '../database/connectToRedis';
import Job, { JobInterface } from "../models/JobSchema";

const connection = {
    host: redisOptions.socket.host,
    port: redisOptions.socket.port,
    password: redisOptions.password,
    username: redisOptions.username,
};

export const jobQueue = new Queue('job-import', { connection });

export const addJobQueue = async (jobs: JobInterface[], importId: string) => {
    if (!jobs.length) return;

    // const externalIds: string[] = jobs.map(j => j.externalId);
    // const existingDocs = await Job.find({ externalId: { $in: externalIds } }).select('externalId');
    // const existingIds = new Set(existingDocs.map(doc => doc.externalId))

    // const newJobs = jobs.filter(j => !existingIds.has(j.externalId));
    // const existingJobs = jobs.filter(j => existingIds.has(j.externalId));

    // if (!newJobs.length) return;


    await jobQueue.add('import-job', { jobs, importId }, {
        jobId: `batch-${importId}`,
        removeOnComplete: true,
        delay: 1 * 1000,
        attempts: 2,
        backoff: { type: 'exponential', delay: 1000 },
    });
    console.log(`🗳️ Batch queued for importId=${importId})`);
}

