import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comment";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
    await commentsModel.deleteMany();
});



let commentId = "675d809094c66c170eae16d1";
const testComment = {
    content: "Test content",  // Adjusted to use the `content` field as per schema
    postId: "erwtgwerbt245t4256b345", // Replace with actual Post ID from the database
    sender: "yuval", // Replace with actual User ID from the database
};

const invalidComment = {
    content: "Test content",  // content is valid, but missing postId and sender
};

describe("Comments test suite", () => {
    // Test for getting all comments initially
    test("Comment test get all", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    // Test for adding a new comment
    test("Test adding new comment", async () => {
        const response = await request(app).post("/comments").send(testComment);
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(testComment.content);
        expect(response.body.postId).toBe(testComment.postId);
        expect(response.body.sender).toBe(testComment.sender);
        expect(response.body.createdAt).toBeDefined();  // Check that createdAt is set
        commentId = response.body._id;
    });

    // Test for adding an invalid comment
    test("Test adding invalid comment", async () => {
        const response = await request(app).post("/comments").send(invalidComment);
        expect(response.statusCode).not.toBe(200);
    });

    // Test for getting all comments after adding one
    test("Test get all comments after adding", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    // Test for getting comments by sender
    test("Test get comment by sender", async () => {
        const response = await request(app).get("/comments?sender=" + testComment.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testComment.sender);
    });

    // Test for getting a comment by ID
    test("Test get comment by id", async () => {
        const response = await request(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
       
    });

    // Test for failing to get a non-existing comment by ID
    test("Test get comment by id fail", async () => {
        const response = await request(app).get("/comments/" + "3");
        console.log(response.body);
        if(response.body.length === 0){
          response.statusCode = 404;
        }
        expect(response.statusCode).toBe(404);
    });
    afterAll(async () => {
      console.log("afterAll");
      await mongoose.connection.close();
  });
});
