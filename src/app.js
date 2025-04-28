import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.routes.js";
import moodRouter from "./routes/mood.routes.js";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";
import sosRouter from './routes/sos.routes.js';
import dotenv from 'dotenv';


dotenv.config();


const app = express();

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://myndfull-frontend-2-0-9ufk.vercel.app',
        'https://myndfull.vercel.app',
        process.env.CORS_ORIGIN
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept'
    ],
    exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());



app.use("/api/v1/users", userRouter);
app.use("/api/v1/mood", moodRouter);
app.use("/api/v1/aitherapy", chatRouter);
app.use("/api/v1/community", postRouter);
app.use("/api/v1/sos", sosRouter);


export { app };
