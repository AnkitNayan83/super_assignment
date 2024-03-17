import { NextFunction, Request, Response } from "express";
import db from "../utils/db";
import { PaymentMethodType } from "@prisma/client";

type paymentMethodType = {
    amount: number;
    type: PaymentMethodType;
};

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customerId, amount, status, paymentMethods } = req.body;
        if (!customerId) return next({ message: "Customer id is required", status: 400 });
        if (!amount) return next({ message: "Amount is required", status: 400 });
        if (!status) return next({ message: "Payment status is required", status: 400 });

        const transaction = await db.transaction.create({
            data: {
                amount,
                status,
                customerId,
            },
        });

        const paymentMethodsData = paymentMethods.map((method: paymentMethodType) => {
            return {
                type: method.type,
                transactionId: transaction.id,
                amount: method.amount,
            };
        });

        const createdPaymentMethods = await db.paymentMethod.createMany({
            data: paymentMethodsData,
        });

        res.status(201).json({
            success: true,
            transaction,
        });
    } catch (error) {
        next(error);
        console.log(error);
    }
};

export const getSingleTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id)
            return next({
                message: "Transaction id not found",
                status: 400,
            });
        const transaction = await db.transaction.findFirst({
            where: {
                id,
            },
            include: {
                paymentMethods: true,
                customer: true,
            },
        });

        if (!transaction)
            return next({
                message: "No transaction found for this id",
                status: 404,
            });

        res.status(200).json(transaction);
    } catch (error) {
        next(error);
    }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id)
            return next({
                message: "Transaction id not found",
                status: 400,
            });

        const { status } = req.body;

        if (!status)
            return next({
                message: "No status found",
                status: 400,
            });

        const transaction = await db.transaction.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        if (!transaction)
            return next({
                message: "No transaction found for this id",
                status: 404,
            });
        res.status(200).json({
            success: true,
            transaction,
        });
    } catch (error) {
        next(error);
    }
};
