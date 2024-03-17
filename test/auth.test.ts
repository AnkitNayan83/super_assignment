import request from "supertest";
import app from "../src/app";
import { prismaMock } from "../src/utils/singleton";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth routes", () => {
    describe("Register route", () => {
        it("should return error if request body is empty", async () => {
            const response = await request(app).post("/api/v1/auth/register").send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("email is required");
        });

        it("should return error if name is not provided", async () => {
            const userData = {
                email: "john@example.com",
                password: "password123",
            };
            const response = await request(app).post("/api/v1/auth/register").send(userData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("name is required");
        });

        it("should return error if email is not provided", async () => {
            const userData = {
                name: "John",
                password: "password123",
            };

            const response = await request(app).post("/api/v1/auth/register").send(userData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("email is required");
        });

        it("should return error if password is not provided", async () => {
            const userData = {
                name: "John",
                email: "jhon@gmail.com",
            };

            const response = await request(app).post("/api/v1/auth/register").send(userData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("password is required");
        });

        it("should return error if email is already registered", async () => {
            const userData = {
                name: "Andrew",
                email: "andrew@gmail.com",
                password: "andrew123",
            };

            prismaMock.user.findFirst.mockResolvedValueOnce({
                id: "1",
                email: userData.email,
                name: userData.name,
                hashedPassword: await bcrypt.hash(userData.password, 10),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await request(app).post("/api/v1/auth/register").send(userData);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe("This email is already registered");
        });

        it("should register the user successfully", async () => {
            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            };

            prismaMock.user.findFirst.mockResolvedValueOnce(null);

            prismaMock.user.create.mockResolvedValueOnce({
                id: "1",
                email: userData.email,
                name: userData.name,
                hashedPassword: await bcrypt.hash(userData.password, 10),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce("salt");
            (bcrypt.hash as jest.Mock).mockResolvedValueOnce("hashedPassword");

            // Mock jwt sign function
            (jwt.sign as jest.Mock).mockReturnValueOnce("mockedToken");

            const response = await request(app).post("/api/v1/auth/register").send(userData);

            expect(response.status).toBe(201);
        });
    });

    describe("Login route", () => {
        it("should return error if email is not given", async () => {
            const userData = {
                password: "123456",
            };

            const response = await request(app).post("/api/v1/auth/login").send(userData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("email is required");
        });
        it("should return error if passowrd is not given", async () => {
            const userData = {
                email: "andrew@gmail.com",
            };

            const response = await request(app).post("/api/v1/auth/login").send(userData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("password is required");
        });
        it("should return error if user does not exists", async () => {
            const userData = {
                email: "andrew@gmail.com",
                password: "123456",
            };

            prismaMock.user.findFirst.mockResolvedValueOnce(null);

            const response = await request(app).post("/api/v1/auth/login").send(userData);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("wrong username or password");
        });
        it("should return error if password is incorrect", async () => {
            const userData = {
                email: "andrew@gmail.com",
                password: "incorrect",
            };

            const userInDb = {
                id: "1",
                email: "andrew@gmail.com",
                hashedPassword: await bcrypt.hash("correct", 10),
                name: "Andrew",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            prismaMock.user.findUnique.mockResolvedValueOnce(userInDb);

            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

            const response = await request(app).post("/api/v1/auth/login").send(userData);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("wrong username or password");
        });
        it("should return token and user data on successful login", async () => {
            const userData = {
                email: "andrew@gmail.com",
                password: "correct",
            };

            const userInDb = {
                id: "1",
                email: "andrew@gmail.com",
                hashedPassword: await bcrypt.hash("correct", 10),
                name: "Andrew",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValueOnce(userInDb);

            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
            (jwt.sign as jest.Mock).mockReturnValueOnce("mockedToken");

            const response = await request(app).post("/api/v1/auth/login").send(userData);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBe("mockedToken");
        });
    });
});
