import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
// import morgan from "morgan";

// Import routes
// import routes from "./routes/index.js";
// import { handleAIErrors } from './middlewares/ai.middleware.js';

// // Load environment variables
// config();

// const app = express();

// // CORS Configuration
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Middlewares
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(express.static("public"));

// // Routes
// app.use("/api/v1", routes);

// // Health check route
// app.get("/health", (_, res) => {
//     res.status(200).json({
//         status: "success",
//         message: "Server is healthy"
//     });
// });

// // AI error handling middleware (must be before general error handler)
// app.use(handleAIErrors);

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(err.statusCode || 500).json({
//         status: "error",
//         message: err.message || "Internal Server Error",
//         errors: err.errors || []
//     });
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         status: "error",
//         message: `Cannot ${req.method} ${req.url}`
//     });
// });

// export { app };

import chatRouter from "./routes/chat.routes.js";
import moodRouter from "./routes/mood.routes.js";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";
import sosRouter from './routes/sos.routes.js';



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}))

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
