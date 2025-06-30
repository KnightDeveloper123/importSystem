import express from 'express';
import dotenv from "dotenv";

import { errorHandler } from './src/middleware/errorHandler';
import { connectToDataBase } from './src/database/db';
import JobsRouter from "./src/routes/jobs/jobs";
import AuthRoutes from './src/routes/users/auth';

const app = express();
const PORT = 3001;
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/jobs', JobsRouter);
app.use('/auth', AuthRoutes);

app.use(errorHandler);

connectToDataBase().then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => console.log(`server running on port ${PORT} - http://localhost:${PORT}`))
}).catch((err) => console.log(err));

