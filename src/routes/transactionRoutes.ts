import express from "express";
import {
    createTransaction,
    getSingleTransaction,
    updateTransaction,
} from "../controller/transactionController";

const router = express.Router();

router.post("/", createTransaction);
router.get("/:id", getSingleTransaction);
router.put("/update/:id", updateTransaction);

export default router;
