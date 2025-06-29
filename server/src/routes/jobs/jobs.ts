import express, { Request, Response } from "express";
const router = express.Router();

import { addJobQueue } from "../../queues/Producer";
import { importJobs } from "../../services/importService";
import ImportLog from "../../models/ImportLogs";


const externalApis: string[] = [
    'https://jobicy.com/?feed=job_feed&job_categories=business',
]


router.get('/', async (req: Request, res: Response) => {
    try {
        const details: any[] = [];

        await Promise.all(
            externalApis.map(async (url) => {
                const allJobsDoc = await importJobs(url);
                if (!Array.isArray(allJobsDoc)) return;

                const log = await ImportLog.create({
                    feedUrls: [url],
                    totalFetched: allJobsDoc.length,
                    queuedJobs: allJobsDoc.length,
                    insertedJobs: 0,
                    updatedJobs: 0,
                    skippedJobs: 0,
                    failedJobs: 0,
                    errors: [],
                });

                await addJobQueue(allJobsDoc, log._id.toString());
                details.push({ url, fetched: allJobsDoc.length, queued: allJobsDoc.length, importId: log._id });
            })
        );

        res.status(202).json({ message: "Import scheduled", details });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
});

export default router;
