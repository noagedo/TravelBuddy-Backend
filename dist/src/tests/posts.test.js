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
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log("beforeAll - Posts");
    yield post_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll - Posts");
    yield mongoose_1.default.connection.close();
}));
let postId = "";
const testPost = {
    content: "Test content",
    sender: "yuval",
};
const invalidPost = {
    content: "Test content",
};
describe("Posts test suite", () => {
    test("Get all posts initially", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    }));
    test("Add new post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send(testPost);
        expect(response.statusCode).toBe(201);
        expect(response.body.content).toBe(testPost.content);
        expect(response.body.sender).toBe(testPost.sender);
        postId = response.body._id;
    }));
    test("Add invalid post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send(invalidPost);
        expect(response.statusCode).toBe(400); // Adjusted to match schema validation behavior
    }));
    test("Get all posts after adding one", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    }));
    test("Get posts by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?sender=" + testPost.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testPost.sender);
    }));
    test("Get post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("Fail to get post by non-existing ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/675d74c7e039287983e32a15");
        console.log("EROROROROROR" + response.body);
        expect(response.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=posts.test.js.map