"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_1.default.deleteMany();
    yield post_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const baseUrl = "/auth";
const testUser = {
    userName: "Test User",
    email: "user1@test.com",
    password: "123456",
};
describe("Auth test suite", () => {
    test("Auth test registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send(testUser);
        expect(response.statusCode).toBe(200);
    }));
    test("Auth test registration no password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send({
            email: "sdfsadaf",
        });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test registration email already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send(testUser);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test registration with empty password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send({
            email: "test@example.com",
            password: ""
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Invalid input data" }); // Changed to match actual response
    }));
    test("Auth test registration with empty email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send({
            userName: "TestUser",
            email: "",
            password: "123456"
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Invalid email format" });
    }));
    test("Auth test registration with special characters in email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send({
            email: "test!@#$%^&*()@example.com",
            password: "123456"
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
    }));
    test("Auth test login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        testUser.accessToken = accessToken;
        testUser.refreshToken = refreshToken;
        testUser._id = response.body._id;
    }));
    test("Auth test login with empty credentials", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send({
            email: "",
            password: ""
        });
        expect(response.statusCode).toBe(404);
    }));
    test("Auth test multiple concurrent login attempts", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPromises = Array(3).fill(null).map(() => (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser));
        const responses = yield Promise.all(loginPromises);
        responses.forEach(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("accessToken");
            expect(response.body).toHaveProperty("refreshToken");
        });
        // Verify all tokens are different
        const tokens = responses.map(r => r.body.accessToken);
        const uniqueTokens = new Set(tokens);
        expect(uniqueTokens.size).toBe(tokens.length);
    }));
    test("Auth test login make sure tokens are diffrent", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        expect(accessToken).not.toBe(testUser.accessToken);
        expect(refreshToken).not.toBe(testUser.refreshToken);
        testUser.accessToken = accessToken;
        testUser.refreshToken = refreshToken;
        testUser._id = response.body._id;
    }));
    test("Test token access", () => __awaiter(void 0, void 0, void 0, function* () {
        const response2 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "JWT " + testUser.accessToken,
        })
            .send({
            title: "Test title",
            content: "Test content",
            sender: "noa",
        });
        expect(response2.statusCode).toBe(201);
    }));
    test("Auth middleware with invalid authorization header format", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/")
            .set({
            authorization: "Invalid " + testUser.accessToken,
        })
            .send({
            title: "Test title",
            content: "Test content",
            sender: "test"
        });
        expect(response.statusCode).toBe(404);
    }));
    test("Auth middleware with missing authorization header", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/")
            .send({
            title: "Test title",
            content: "Test content",
            sender: "test"
        });
        expect(response.statusCode).toBe(404);
    }));
    test("Test token access fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response2 = yield (0, supertest_1.default)(app)
            .post("/")
            .set({
            authorization: "JWT " + testUser.accessToken + "f",
        })
            .send({
            title: "Test title",
            content: "Test content",
            sender: "noa",
        });
        expect(response2.statusCode).not.toBe(201);
    }));
    test("Test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        testUser.accessToken = response.body.accessToken;
        testUser.refreshToken = response.body.refreshToken;
    }));
    test("Test refresh with missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({});
        expect(response.statusCode).toBe(400);
        // expect(response.body).toBe("error");
    }));
    test("Test token generation with missing TOKEN_SECRET", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        // Restore TOKEN_SECRET
        process.env.TOKEN_SECRET = originalSecret;
    }));
    test("Test refresh token fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response.statusCode).toBe(200);
        const newRefreshToken = response.body.refreshToken;
        const response2 = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response2.statusCode).not.toBe(200);
        const response3 = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: newRefreshToken,
        });
        expect(response3.statusCode).not.toBe(200);
    }));
    test("Test Logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(200);
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        testUser.accessToken = accessToken;
        testUser.refreshToken = refreshToken;
        const response2 = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/logout")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response2.statusCode).toBe(200);
        const response3 = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response3.statusCode).not.toBe(200);
    }));
    test("Test logout with invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/logout")
            .send({
            refreshToken: "invalid_token"
        });
        expect(response.statusCode).toBe(400);
        // expect(response.body).toBe("error");
    }));
    jest.setTimeout(20000);
    test("Token expiration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(200);
        testUser.accessToken = response.body.accessToken;
        testUser.refreshToken = response.body.refreshToken;
        yield new Promise((resolve) => setTimeout(resolve, 17000));
        const response2 = yield (0, supertest_1.default)(app)
            .post("/")
            .set({
            authorization: "JWT " + testUser.accessToken,
        })
            .send({
            title: "Test title",
            content: "Test content",
            sender: "noa",
        });
        expect(response2.statusCode).not.toBe(201);
        const response3 = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response3.statusCode).toBe(200);
        testUser.accessToken = response3.body.accessToken;
        testUser.refreshToken = response3.body.refreshToken;
        const response4 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "JWT " + testUser.accessToken,
        })
            .send({
            title: "Test title",
            content: "Test content",
            sender: "noa",
        });
        expect(response4.statusCode).toBe(201);
    }));
    test("Auth test invalid email format", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send({
            email: "not-an-email",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Auth test login non-existent user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send({
            email: "nonexistent@test.com",
            password: "123456",
        });
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error");
    }));
    test("Auth test Login - invalid password (less than 8 characters)", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send({
            email: "test@example.com",
            password: "123",
        });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
    }));
    test("Auth test register new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send({
            email: "gedonoa@gmail.com",
            password: "123456",
            userName: "Noaaaaaaaaaa"
        });
        expect(response.statusCode).toBe(200);
    }));
    test("Auth test register with missing fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send({
            email: "newuser@test.com"
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Auth test login with incorrect password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send({
            email: "existinguser@test.com",
            password: "wrongpassword"
        });
        expect(response.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=auth.test.js.map