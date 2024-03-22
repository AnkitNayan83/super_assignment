import { prismaMock } from "../src/utils/singleton";
import request from "supertest";
import app from "../src/app";
import { PaymentMethodType, TransactionStatusType } from "@prisma/client";

const mockTransactionData = {
    customerId: "customer_id_1",
    amount: 100,
    status: TransactionStatusType.PENDING,
    paymentMethods: [
        {
            type: PaymentMethodType.CARD,
            amount: 100,
            transactionId: "transaction_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    id: "transaction_id_1",
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe("Transactions test", () => {
    test("should create a new transaction", async () => {
        // Mock the return values of Prisma methods
        prismaMock.transaction.create.mockResolvedValue({
            ...mockTransactionData,
        });
        prismaMock.paymentMethod.createMany.mockResolvedValue({
            count: 1,
        });

        const response = await request(app).post("/api/transaction/").send(mockTransactionData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    });
});

describe("GET /transactions/:id", () => {
    test("should get a single transaction", async () => {
        // Mock the return value of Prisma method
        prismaMock.transaction.findFirst.mockResolvedValue(mockTransactionData);

        // Send request to get a single transaction
        const response = await request(app).get("/api/transaction/transaction_id_1");

        // Assertions
        expect(response.status).toBe(200);
    });
});

describe("PUT /transactions/:id", () => {
    test("should update a transaction", async () => {
        // Mock the return value of Prisma method
        prismaMock.transaction.update.mockResolvedValue({
            ...mockTransactionData,
        });

        // Send request to update a transaction
        const response = await request(app)
            .put("/api/transaction/update/transaction_id_1")
            .send({ status: "COMPLETED" });

        // Assertions
        expect(response.status).toBe(200);
    });
});
