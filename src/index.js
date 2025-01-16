import dotenv from "dotenv";
// Load env variables first
dotenv.config({
    path: "./.env"
});

import connectDB from "./db/index.js";
import { app } from "./app.js";
import express from "express";

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server running at ${process.env.PORT}`)
    })
})
    .catch(err => console.log("error ecoonecting to db", err));