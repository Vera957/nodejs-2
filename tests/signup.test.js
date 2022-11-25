const supertest = require("supertest");
const { app } = require('../app');
const mongoose = require("mongoose");
 const { User } = require("../../models/user.model");

require("dotenv").config();

const { HOST_DB_TEST } = process.env;

describe("signup", () => {
    beforeAll(async () => {
        mongoose.connect(HOST_DB_TEST);
    });
})

    afterAll(async () => {
        await User.deleteMany();
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await User.deleteMany();
    }); 

    it("should register new user", async () => {
        const response = await supertest(app).post("/api/users/signup").send({
            email: "testUser1@gmail.com",
            password: "1234456",
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual({
            user: {
                email: expect.any(),
                subscription: expect.any(),
            },
        });
    });
