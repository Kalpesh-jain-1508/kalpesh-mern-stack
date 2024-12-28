import express from 'express';
import { config } from 'dotenv';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import userRoute from "./Routes/User/userRoute.js";
import ErrorMiddelware from './Middlewares/error.js';

const app = express();

config({
    path: "./Config/config.env",
});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const URL = process.env.NODE_ENV === "production" ? process.env.LIVE_FRONTEND_URL : process.env.FRONTEND_URL;

app.use(
    cors({
        origin: [
            URL,
            'http://localhost:3000',
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use('/api/v1', userRoute);

export default app;

// Using Custom Error Middelware
app.use(ErrorMiddelware);