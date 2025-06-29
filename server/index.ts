import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import JobsRouter from "./src/routes/jobs/jobs";
import { connectToDataBase } from './src/database/db';

const app = express();
const PORT = 3001;
dotenv.config();

app.use('/jobs', JobsRouter);

connectToDataBase().then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => console.log(`server running on port ${PORT} - http://localhost:${PORT}`))
}).catch((err) => console.log(err));

