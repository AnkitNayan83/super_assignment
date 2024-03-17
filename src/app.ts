import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import transactionRoutes from "./routes/transactionRoutes";
import customerRoutes from "./routes/customerRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();
dotenv.config({ path: "./.env" });

app.use(morgan("dev"));
app.use(express.json());

app.get("/test", (req, res, next) => {
    res.status(200).json({ message: "Testing server" });
});

app.use("/api/transaction", transactionRoutes);
app.use("api/customer", customerRoutes);

app.get("*", (req, res, next) => {
    res.send("<h1>404 Not found</h1>");
});

app.use(errorMiddleware);

export default app;
