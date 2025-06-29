import isEqual from 'lodash.isequal';

import { Job as BullJob, QueueEvents, Worker } from "bullmq";
import Job, { JobInterface } from "../models/JobSchema";
import { redisOptions } from '../database/connectToRedis';
import { connectToDataBase } from "../database/db";
import ImportLog from "../models/ImportLogs";


function clean(obj: any) {
    const clone = JSON.parse(JSON.stringify(obj));
    delete clone._id;
    delete clone.__v;
    delete clone.createdAt;
    delete clone.updatedAt;
    return clone;
}


async function startWorker() {
    console.log('-------------------- Bull - MQ Worker initialized --------------------');
    connectToDataBase().then(() => console.log('✅ Database connected in - (Worker)'))

    const connection = {
        host: redisOptions.socket.host,
        port: redisOptions.socket.port,
        password: redisOptions.password,
        username: redisOptions.username,
    };

    const jobWorker = new Worker('job-import', async (job: BullJob) => {
        const { jobs, importId } = job.data as {
            jobs: JobInterface[],
            importId: string
        };

        if (!Array.isArray(jobs)) throw new Error('Array of Jobs Expected!');

        const externalIds: string[] = jobs.map(j => j.externalId);
        const existingJobs = await Job.find({ externalId: { $in: externalIds } }).lean();
        const existingMap = new Map(existingJobs.map(doc => [doc.externalId, doc]));

        const bulkOps = [];
        let skipped = 0;
        let inserted = 0;
        let updated = 0;
        let failed = 0;

        for (const item of jobs) {
            const existing = existingMap.get(item.externalId);
            if (existing) {
                const cleanExisting = clean(existing);
                const cleanNew = clean(item);
                if (isEqual(cleanExisting, cleanNew)) {
                    skipped++;
                    continue;
                }
            }

            bulkOps.push({
                updateOne: {
                    filter: { externalId: item.externalId },
                    update: { $set: item },
                    upsert: true
                }
            });
        }

        if (bulkOps.length > 0) {
            try {
                const result = await Job.bulkWrite(bulkOps, { ordered: false });
                inserted = result.upsertedCount ?? 0;
                updated = result.modifiedCount ?? 0;
            } catch (err) {
                failed += bulkOps.length;
                console.error('❌ Error in bulkWrite:', err);
            }
        }

        const total = jobs.length;

        console.log(`📝 ImportLog ${importId} → total=${total}, inserted=${inserted}, updated=${updated}, skipped=${skipped}, failed=${failed}`);

        await ImportLog.findByIdAndUpdate(importId, {
            insertedJobs: inserted,
            updatedJobs: updated,
            skippedJobs: skipped,
            failedJobs: failed,
        });

    }, { connection, concurrency: 5 });

    const queueEvents = new QueueEvents('job-import', { connection });

    queueEvents.on('completed', ({ jobId }) =>
        console.log(`✅ [GLOBAL] Job ${jobId} completed`)
    );
    queueEvents.on('failed', ({ jobId, failedReason }) =>
        console.error(`❌ [GLOBAL] Job ${jobId} failed:`, failedReason)
    );
    queueEvents.on('drained', () =>
        console.log('🚦 [GLOBAL] Queue drained — no waiting jobs')
    );

}
startWorker().catch(err => console.error('❌ Worker error on startup', err));


// export const jobWorker = new Worker('job-import', async (job) => {
//     const jobData: JobInterface = job.data;
//     await Job.findOneAndUpdate({ externalId: jobData.externalId }, { $set: jobData }, { upsert: true, new: true });
//     console.log(`📌 Saved job ${jobData.externalId}`);
// }, { connection, concurrency: 5 });



