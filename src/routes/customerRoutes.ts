import express from "express";
import {
    getAllTransactionsOfACustomer,
    salesValuePerCustomer,
} from "../controller/customerController";

const router = express.Router();

router.get("/:customerId/transaction", getAllTransactionsOfACustomer);

router.get("/total-sales", salesValuePerCustomer);

export default router;
