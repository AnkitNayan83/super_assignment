import { NextFunction, Request, Response } from "express";
import db from "../utils/db";

export const getAllTransactionsOfACustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { customerId } = req.params;
        if (!customerId)
            return next({
                message: "Customer id not found",
                status: 400,
            });
        const transactions = await db.transaction.findMany({
            where: {
                customerId,
            },
            include: {
                paymentMethods: true,
                customer: true,
            },
        });
        if (!transactions)
            return next({
                message: "No transaction for for this user",
                status: 404,
            });
        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
};

export const salesValuePerCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalSalesPerCustomer = await db.customer.findMany({
            select: {
                id: true,
                name: true,
                transactions: {
                    select: {
                        amount: true,
                    },
                },
            },
        });

        const customersWithTotalSales = totalSalesPerCustomer.map((customer) => {
            const totalSales = customer.transactions.reduce((acc, curr) => acc + curr.amount, 0);
            return { id: customer.id, name: customer.name, totalSales };
        });

        res.status(200).json(customersWithTotalSales);
    } catch (error) {
        next(error);
    }
};
