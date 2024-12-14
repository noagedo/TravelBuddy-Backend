import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/post";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll - Posts");
    await postModel.deleteMany();
});

afterAll(async () => {
    console.log("afterAll - Posts");
    await mongoose.connection.close();
});

let postId = "";
const testPost = {
    content: "Test content",
    sender: "yuval",
};

const invalidPost = {
    content: "Test content",
};

describe("Posts test suite", () => {
    test("Get all posts initially", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Add new post", async () => {
        const response = await request(app).post("/posts").send(testPost);
        expect(response.statusCode).toBe(201);
        expect(response.body.content).toBe(testPost.content);
        expect(response.body.sender).toBe(testPost.sender);
        postId = response.body._id;
    });

    test("Add invalid post", async () => {
        const response = await request(app).post("/posts").send(invalidPost);
        expect(response.statusCode).toBe(400); // Adjusted to match schema validation behavior
    });

    test("Get all posts after adding one", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Get posts by owner", async () => {
        const response = await request(app).get("/posts?sender=" + testPost.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testPost.sender);
    });

    test("Get post by ID", async () => {
        const response = await request(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    });

    test("Fail to get post by non-existing ID", async () => {
        const response = await request(app).get("/posts/675d74c7e039287983e32a15");
        expect(response.statusCode).toBe(404);
    });
});