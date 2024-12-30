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
    test("Get post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("Fail to get post by non-existing ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/675d74c7e039287983e32a15");
        expect(response.statusCode).toBe(404);
    }));
    //get post by sender testings
    test("Get posts by sender successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?sender=" + testPost.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testPost.sender);
    }));
    test("Get posts by sender with no posts found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/?sender=nonexistentSender");
        expect(response.statusCode).toBe(404);
        expect(response.text).not.toBe("Success");
    }));
    test("Fail to get posts due to missing sender parameter", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/");
        expect(response.statusCode).toBe(404); // Adjusted based on server validation
        expect(response.text).not.toBe("Success to fetch posts");
    }));
    test("Fail to get posts due to database error", () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate a database error
        const error = new Error("Database error");
        post_1.default.find = jest.fn().mockRejectedValue(error);
        const response = yield (0, supertest_1.default)(app).get("/posts?sender=" + testPost.sender);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("{}");
    }));
    test("Get posts by sender when multiple posts exist", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create another post with the same sender
        const additionalPost = {
            content: "Another post",
            sender: "yuval",
        };
        yield (0, supertest_1.default)(app).post("/").send(additionalPost);
        const response = yield (0, supertest_1.default)(app).get("/?sender=" + testPost.sender);
        expect(response.statusCode).not.toBe(400);
    }));
    //updating testings
    test("Successfully update the post and return it", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockPost = { _id: "123", title: "Updated title", content: "Updated content" };
        post_1.default.findByIdAndUpdate = jest.fn().mockResolvedValue(mockPost);
        const response = yield (0, supertest_1.default)(app)
            .put("/posts/123")
            .send({ title: "Updated title", content: "Updated content" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockPost);
    }));
    test("Fail to update post with non-existing ID", () => __awaiter(void 0, void 0, void 0, function* () {
        post_1.default.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
        const response = yield (0, supertest_1.default)(app)
            .put("/posts/nonexistent-id")
            .send({ title: "Updated title" });
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe("Post not found");
    }));
    test("Fail to update post due to an error", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error("Database error");
        post_1.default.findByIdAndUpdate = jest.fn().mockRejectedValue(error);
        const response = yield (0, supertest_1.default)(app)
            .put("/posts/123")
            .send({ title: "Invalid data" });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("{}");
    }));
    test("Update post with empty request body", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockPost = { _id: "123", title: "Original title", content: "Original content" };
        post_1.default.findByIdAndUpdate = jest.fn().mockResolvedValue(mockPost);
        const response = yield (0, supertest_1.default)(app)
            .put("/posts/123")
            .send({}); // Empty body
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockPost); // No changes, returns original post
    }));
    //deleting testings
    test("Delete post successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + postId);
        expect(response.statusCode).toBe(201);
        expect(response.text).toBe("Post deleted successfully");
    }));
    test("Fail to delete post with invalid ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/invalidId");
        expect(response.statusCode).toBe(400);
        expect(response.text).not.toBe("Success");
    }));
    test("Fail to delete post after it's already deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        // Delete the post once
        yield (0, supertest_1.default)(app).delete("/posts/" + postId);
        // Attempt to delete it again
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + postId);
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe("Post not found");
    }));
    test("Fail to delete post with missing postId parameter", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/"); // Missing postId in the URL
        expect(response.statusCode).toBe(404);
        expect(response.text).not.toBe("Success");
    }));
    test("Fail to delete post due to invalid parameter type", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/12345xyz"); // Invalid postId format
        expect(response.statusCode).toBe(400);
        expect(response.text).not.toBe("Success");
    }));
    test("Fail to delete post due to server error", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error("Server error");
        post_1.default.findByIdAndDelete = jest.fn().mockRejectedValue(error);
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + postId);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("{}");
    }));
});
//# sourceMappingURL=posts.test.js.map