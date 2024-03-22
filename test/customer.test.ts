import { prismaMock } from "../src/utils/singleton";
import request from "supertest";
import app from "../src/app";
import { PaymentMethodType, TransactionStatusType } from "@prisma/client";

const mockCustomerId = "customer_id_1";

const mockTransactions = [
    {
        id: "transaction_id_1",
        amount: 100,
        status: TransactionStatusType.PENDING,
        customerId: mockCustomerId, // Add customerId field
        paymentMethods: [{ type: "CARD", amount: 100 }],
        customer: { id: mockCustomerId, name: "Customer 1" },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "transaction_id_2",
        amount: 200,
        status: TransactionStatusType.PENDING,
        customerId: mockCustomerId, // Add customerId field
        paymentMethods: [{ type: "CRYPTO", amount: 200 }],
        customer: { id: mockCustomerId, name: "Customer 1" },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

describe("GET /transactions/:customerId", () => {
    test("should get all transactions of a customer", async () => {
        // Mock the return value of Prisma method
        prismaMock.transaction.findMany.mockResolvedValue(mockTransactions);

        // Send request to get all transactions of a customer
        const response = await request(app).get(`/api/customer/${mockCustomerId}/transaction`);

        // Assertions
        expect(response.status).toBe(200);
    });
});

describe("GET /sales-value-per-customer", () => {
    test("should get sales value per customer", async () => {
        // Mock the return value of Prisma method
        prismaMock.customer.findMany.mockResolvedValue([
            {
                id: "customer_id_1",
                name: "Customer 1",
                email: "customer1@example.com",
                phoneNumber: "1234567890",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        // Send request to get sales value per customer
        const response = await request(app).get("/api/customer/total-sales");

        // Assertions
        expect(response.status).toBe(200);
    });
});
