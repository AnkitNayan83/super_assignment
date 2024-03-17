import { prismaMock } from "../src/utils/singleton";
import request from "supertest";
import app from "../src/app";
import { PaymentMethodType, TransactionStatusType } from "@prisma/client";

const mockCustomerId = "customer_id_1";

const mockTransactions = [
    {
        id: "transaction_id_1",
        amount: 100,
        paymentMethods: [{ type: "CARD", amount: 100 }],
        customer: { id: mockCustomerId, name: "Customer 1" },
    },
    {
        id: "transaction_id_2",
        amount: 200,
        paymentMethods: [{ type: "CRYPTO", amount: 200 }],
        customer: { id: mockCustomerId, name: "Customer 1" },
    },
];

// Mock Prisma method
jest.mock("../utils/db", () => ({
    __esModule: true,
    default: {
        transaction: {
            findMany: jest.fn(),
        },
        customer: {
            findMany: jest.fn(),
        },
    },
}));

describe("GET /transactions/:customerId", () => {
    test("should get all transactions of a customer", async () => {
        // Mock the return value of Prisma method
        db.transaction.findMany.mockResolvedValue(mockTransactions);

        // Send request to get all transactions of a customer
        const response = await request(app).get(`/transactions/${mockCustomerId}`);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockTransactions);
        // Add more assertions as needed
    });
});

describe("GET /sales-value-per-customer", () => {
    test("should get sales value per customer", async () => {
        // Mock the return value of Prisma method
        db.customer.findMany.mockResolvedValue([
            { id: "customer_id_1", name: "Customer 1", transactions: mockTransactions },
        ]);

        // Send request to get sales value per customer
        const response = await request(app).get("/sales-value-per-customer");

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: "customer_id_1", name: "Customer 1", totalSales: 300 },
        ]);
        // Add more assertions as needed
    });
});
