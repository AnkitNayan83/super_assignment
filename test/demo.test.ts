import app from "../src/app";
import request from "supertest";

describe("Demo test", () => {
    it("Should respond with status code 200", async () => {
        const response = await request(app).get("/test");
        expect(response.status).toBe(200);
    });
});
