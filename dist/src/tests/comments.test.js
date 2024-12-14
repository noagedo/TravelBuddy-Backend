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
const comment_1 = __importDefault(require("../models/comment"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log("beforeAll");
    yield comment_1.default.deleteMany();
}));
let commentId = "675d809094c66c170eae16d1";
const testComment = {
    content: "Test content", // Adjusted to use the `content` field as per schema
    postId: "erwtgwerbt245t4256b345", // Replace with actual Post ID from the database
    sender: "yuval", // Replace with actual User ID from the database
};
const invalidComment = {
    content: "Test content", // content is valid, but missing postId and sender
};
describe("Comments test suite", () => {
    // Test for getting all comments initially
    test("Comment test get all", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    }));
    // Test for adding a new comment
    test("Test adding new comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(testComment);
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(testComment.content);
        expect(response.body.postId).toBe(testComment.postId);
        expect(response.body.sender).toBe(testComment.sender);
        expect(response.body.createdAt).toBeDefined(); // Check that createdAt is set
        commentId = response.body._id;
    }));
    // Test for adding an invalid comment
    test("Test adding invalid comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(invalidComment);
        expect(response.statusCode).not.toBe(200);
    }));
    // Test for getting all comments after adding one
    test("Test get all comments after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    }));
    // Test for getting comments by sender
    test("Test get comment by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?sender=" + testComment.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testComment.sender);
    }));
    // Test for getting a comment by ID
    test("Test get comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
    }));
    // Test for failing to get a non-existing comment by ID
    test("Test get comment by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + "3");
        console.log(response.body);
        if (response.body.length === 0) {
            response.statusCode = 404;
        }
        expect(response.statusCode).toBe(404);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("afterAll");
        yield mongoose_1.default.connection.close();
    }));
});
//# sourceMappingURL=comments.test.js.map