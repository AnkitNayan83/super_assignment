import express from "express";
import dotenv from "dotenv";

import morgan from "morgan";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();
dotenv.config({ path: "./.env" });

app.use(morgan("dev"));
app.use(express.json());

app.get("/test", (req, res, next) => {
    res.status(200).send("TEST");
});

app.get("*", (req, res, next) => {
    res.status(404).send("<h1>404 Not found</h1>");
});

app.use(errorMiddleware);

export default app;
