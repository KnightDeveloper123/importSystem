import { XMLParser } from "fast-xml-parser";
import { JobInterface } from "../models/JobSchema";

const parser = new XMLParser({
    ignoreAttributes: false,
    preserveOrder: false,
    allowBooleanAttributes: true,
    processEntities: true,
    htmlEntities: true,
    parseTagValue: true,
});

export const fetchDatafromAPI = async (url: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error while fetching details');
        }
        const xml = await response.text();
        const jsonObj = parser.parse(xml);
        const jobsList = jsonObj?.rss?.channel?.item;
        const firstFive = jobsList.slice(0, 5);
        return firstFive
    } catch (error) {
        console.log(error);
    }
}

export const importJobs = async (url: string) => {
    const response = await fetchDatafromAPI(url);
    if (!Array.isArray(response)) return;

    const jobArray: JobInterface[] = response?.reduce((acc, item) => {
        const externalId = item?.id?.toString();
        if (!externalId) acc;
        acc.push({
            externalId,
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate),
            description: item.description,
            content: item["content:encoded"],
            imageUrl: item["media:content"]?.["@_url"],
            location: item["job_listing:location"],
            jobType: item["job_listing:job_type"],
            company: item["job_listing:company"],
            source: "jobicy"
        });

        return acc;
    }, [])
    // console.log(jobArray, "jobArray");
    return jobArray;
}